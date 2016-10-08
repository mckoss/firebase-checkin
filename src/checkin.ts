import * as firebase from 'firebase';

export class Checkin {
  app: firebase.app.App;

  constructor() {
    this.app = firebase.initializeApp({});
  }
}
