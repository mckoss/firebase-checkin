import * as firebase from 'firebase';
let config = require('./config');

import { Checkin } from './checkin';

type ElementMap = { [id: string]: HTMLInputElement | null };

window.addEventListener("load", () => {
  let app = firebase.initializeApp(config);
  let checkin = new Checkin(app);
  new CheckinUI(app, checkin);
});

export class CheckinUI {
  elements: ElementMap = {
    'sign-in': null,
    'create-event': null,
    'event-id': null,
    'event-title': null,
  };
  constructor(
    private app: firebase.app.App,
    private checkin: Checkin
  ) {
    this.bindElements(this.elements);

    this.elements['sign-in']!.addEventListener('click', this.signIn.bind(this));
    this.elements['create-event']!.addEventListener('click', this.createEvent.bind(this));

    this.app.auth().onAuthStateChanged((user: firebase.User | null) => {
      this.checkin.setCurrentUser(user);
    });

    // Monitor the address bar for changes.
    setInterval(this.checkAnchor.bind(this), 500);
  }

  signIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    this.app.auth().signInWithPopup(provider);
  }

  createEvent() {
    this.checkin.createEvent(
      this.elements['event-id']!.value,
      this.elements['event-title']!.value)
      .then(() => {
        console.log("Event created");
      })
      .catch((e) => {
        console.error("Could not create event: ", e);
      });
  }

  checkAnchor() {
    let hash = window.location.hash.slice(1);
  }

  private bindElements(elements: ElementMap) {
    for (let id of Object.keys(elements)) {
      if (!elements[id]) {
        elements[id] = document.querySelector('#' + id) as HTMLInputElement;
      }
    }
  }
}