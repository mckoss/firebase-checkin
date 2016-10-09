import * as firebase from 'firebase';

let config = require('./config');

export class Checkin {
  app: firebase.app.App;

  constructor(app: firebase.app.App) {
    this.app = app;
  }
}

export class CheckinUI {
  app: firebase.app.App;
  checkin: Checkin;

  constructor() {
    this.app = firebase.initializeApp(config);
    this.checkin = new Checkin(this.app);
  }

  signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    this.app.auth().signInWithPopup(provider)
      .then(() => {
        console.log("Signed in");
      })
  }
}