import * as firebase from 'firebase';

type UserId = string;

interface Event {
  id?: string;
  title: string;
  owner: UserId;
}

export class Checkin {
  app: firebase.app.App;
  database: firebase.database.Database;
  events: firebase.database.Reference;
  users: firebase.database.Reference;
  user: firebase.User | null = null;

  constructor(app: firebase.app.App) {
    this.app = app;
    this.database = app.database();
    this.users = this.database.ref('/user');
    this.events = this.database.ref('/events');
  }

  setCurrentUser(user: firebase.User | null) {
    this.user = user;
    if (user) {
      console.log(user.uid, user.displayName, user.email, user.photoURL);
    }
  }

  createEvent(id: string, title: string): Promise<void> {
    if (this.user === null) {
      return Promise.reject(new Error("You must be signed in to create an event."));
    }
    let event = {
      title: title,
      owner: this.user.uid
    };
    return this.events.child(id).set(event) as Promise<void>;
  }
}