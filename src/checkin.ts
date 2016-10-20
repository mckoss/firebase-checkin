import * as firebase from 'firebase';
import { User, Event } from './data-model';
import { project, deepCopy } from './util';

export interface CheckinState {
  user: User | null;
  event: Event | null;
  error: string | null;
}

export type StateListener = (state: CheckinState) => void;

export class Checkin {
  events: firebase.database.Reference;
  users: firebase.database.Reference;
  uid: string | null = null;
  listeners: StateListener[] = [];
  eventId: string | null = null;;
  eventFn: any;

  state: CheckinState = {
    user: null,
    event: null,
    error: null
  };

  constructor(app: firebase.app.App) {
    let database = app.database();
    this.users = database.ref('/users');
    this.events = database.ref('/events');
  }

  listen(listener: StateListener) {
    this.listeners.push(listener);
  }

  updateState() {
    let state = deepCopy(this.state);
    if (this.state.error) {
      this.state.error = null;
    }
    for (let listener of this.listeners) {
      listener(state);
    }
  }

  setCurrentUser(user: firebase.User | null) {
    if (!user) {
      this.uid = null;
      this.state.user = null;
      this.updateState();
      this.updateState();
      return;
    }

    let currentUser = project(user,
      ['email', 'displayName', 'photoURL']) as User;
    if (!currentUser.displayName) {
      if (user.email) {
        currentUser.displayName = user.email.slice(0, user.email.indexOf('@'));
      } else {
        currentUser.displayName = "A User"
      }
    }
    this.uid = user.uid;
    this.state.user = currentUser;

    // Ensure user is registered.
    this.users.child(this.uid).once('value')
      .then((snapshot) => {
        let data = snapshot.val();
        if (data === null) {
          this.users.child(this.uid!).set(this.state.user);
        }
      });
    this.updateState();
  }

  createEvent(id: string, title: string) {
    if (this.uid === null) {
      this.state.error = "You must be signed in to create an event.";
      this.updateState();
      return;
    }
    let event = {
      title: title,
      owner: this.uid,
      attendees: {
        [this.uid]: {
          displayName: this.state.user!.displayName,
          photoURL: this.state.user!.photoURL
        }
      }
    };
    this.events.child(id).set(event)
      .then(() => {
        this.state.event = event;
        this.updateState();
      })
      .catch((error) => {
        this.state.error = "Could not create event: " + error;
        this.updateState();
      });
  }

  setEvent(id: string) {
    if (id === this.eventId) {
      return;
    }
    if (this.eventId) {
      this.events.child(this.eventId).off('value', this.eventFn);
      this.state.event = null;
      this.eventId = null;
    }
    if (id == '') {
      this.updateState();
      return;
    }
    this.eventFn = this.events.child(id).on('value', (snapshot) => {
      this.eventId = id;
      this.state.event = snapshot!.val() as Event;
      this.updateState();
    });
  };

  joinEvent() {
    if (this.uid === null) {
      this.state.error = "You must be signed in to create an event.";
      this.updateState();
      return;
    }
    if (!this.eventId) {
      this.state.error = "There is no current event to join.";
      this.updateState();
      return;
    }
    this.events.child(this.eventId).child('attendees').child(this.uid)
      .set(this.state.user);
  }

  canJoin(): boolean {
    let result = this.uid !== null &&
      this.state.event !== null &&
      this.state.event.attendees[this.uid] === undefined;
    return result;
  }

  isJoined(): boolean {
    let result = this.uid !== null &&
      this.state.event !== null &&
      this.state.event.attendees[this.uid] !== undefined;
    return result;
  }

  feedback(score: number) {
    if (this.uid === null || this.eventId === null) {
      this.state.error = "Must be signed into an event to score it.";
      this.updateState();
      return;
    }
    this.events.child(this.eventId).child('attendees').child(this.uid)
      .child('feedback').set(score);
  }
}
