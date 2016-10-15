import * as firebase from 'firebase';
import { User, Event } from './data-model';
import { project } from './util';

export class Checkin {
  app: firebase.app.App;
  database: firebase.database.Database;
  events: firebase.database.Reference;
  users: firebase.database.Reference;
  user: User | null = null;
  uid: string | null = null;

  constructor(app: firebase.app.App) {
    this.app = app;
    this.database = app.database();
    this.users = this.database.ref('/users');
    this.events = this.database.ref('/events');
  }

  setCurrentUser(user: firebase.User | null): Promise<void> {
    if (!user) {
      this.user = null;
      this.uid = null;
      return Promise.resolve(null);
    }

    this.user = project(user, ['email', 'displayName', 'photoURL']) as User;
    this.uid = user.uid;

    let p = this.users.child(this.uid).once('value')
      .then((snapshot) => {
        let data = snapshot.val();
        if (data === null) {
          this.users.child(this.uid!).set(this.user!);
        }
      });
      return p as Promise<void>;
  }

  createEvent(id: string, title: string): Promise<Event> {
    if (this.uid === null) {
      return Promise.reject(new Error("You must be signed in to create an event."));
    }
    let event = {
      title: title,
      owner: this.uid
    };
    return (this.events.child(id).set(event) as Promise<Event>)
      .then(() => {
        return event;
      });
  }

  setEvent(id: string): Promise<Event> {
    return new Promise((resolve, reject) => {
      return this.events.child(id).once('value')
        .then((snapshot: firebase.database.DataSnapshot) => {
          resolve(snapshot.val());
        });
    });
  }
}
