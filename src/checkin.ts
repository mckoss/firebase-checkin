import * as firebase from 'firebase';
import { User, Event } from './data-model';
import { project, deepCopy } from './util';

export interface CheckinState {
  user: User | null;
  event: Event | null;
}

export type StateListener = (state: CheckinState) => void;

export class Checkin {
  events: firebase.database.Reference;
  users: firebase.database.Reference;
  uid: string | null = null;
  listeners: StateListener[] = [];
  eventFn: any;

  state: CheckinState = {
    user: null,
    event: null
  };

  constructor(app: firebase.app.App) {
    let database = app.database();
    this.users = database.ref('/users');
    this.events = database.ref('/events');
  }

  listen(listener: StateListener) {
    this.listeners.push(listener);
    listener(deepCopy(this.state));
  }

  updateState(): Promise<CheckinState> {
    return new Promise((resolve) => {
      resolve(deepCopy(this.state));
    });
  }

  setCurrentUser(user: firebase.User | null): Promise<CheckinState> {
    if (!user) {
      this.uid = null;
      this.state.user = null;
      return this.updateState();
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
    return this.updateState();
  }

  createEvent(id: string, title: string): Promise<CheckinState> {
    if (this.uid === null) {
      return Promise.reject(new Error("You must be signed in to create an event."));
    }
    let event = {
      title: title,
      owner: this.uid,
      attendees: {
        [this.uid]: {
          displayName: this.state.user!.displayName + " (Organizer)",
          photoURL: this.state.user!.photoURL
        }
      }
    };
    return (this.events.child(id).set(event) as Promise<any>)
      .then(() => {
        this.state.event = event;
        return this.updateState();
      });
  }

  setEvent(id: string) {
    if (this.eventFn) {
      this.events.child(id).off('value', this.eventFn);
      this.state.event = null;
    }
    this.eventFn = this.events.child(id).on('value', function(snapshot) {
      this.state.event = snapshot!.val() as Event;
      this.updateState();
    });
  };
}
