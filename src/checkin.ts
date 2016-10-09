import * as firebase from 'firebase';

let config = require('./config');

export class Checkin {
  app: firebase.app.App;

  constructor() {
    this.app = firebase.initializeApp(config);
  }
}
