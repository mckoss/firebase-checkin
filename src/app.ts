import * as firebase from 'firebase';
let config = require('./config');

import { Checkin, CheckinState } from './checkin';

type ElementMap = { [id: string]: HTMLInputElement };

window.addEventListener("load", () => {
  let app = firebase.initializeApp(config);
  let checkin = new Checkin(app);
  new CheckinUI(app, checkin);
});

export class CheckinUI {
  elements: ElementMap;

  constructor(
    private app: firebase.app.App,
    private checkin: Checkin
  ) {
    this.bindElements();

    this.elements['sign-in'].addEventListener(
      'click', this.signIn.bind(this));
    this.elements['sign-out'].addEventListener(
      'click', this.signOut.bind(this));
    this.elements['create-event'].addEventListener(
      'click', this.createEvent.bind(this));
    this.elements['set-event'].addEventListener(
      'click', this.setEvent.bind(this));
    this.elements['join-event'].addEventListener(
      'click', this.joinEvent.bind(this));

    this.app.auth().onAuthStateChanged((user: firebase.User | null) => {
      this.checkin.setCurrentUser(user);
    });

    // Monitor the address bar for changes.
    setInterval(this.checkAnchor.bind(this), 500);

    this.checkin.listen(this.listener.bind(this));
  }

  signIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    // signInWithPopup does not work on mobile devices
    this.app.auth().signInWithRedirect(provider);
  }

  signOut() {
    this.app.auth().signOut();
  }

  listener(state: CheckinState) {
    console.log(state);
    if (state.error) {
      this.elements['error-message'].textContent = state.error;
    } else {
      this.elements['error-message'].textContent = "";
    }

    if (state.user) {
      this.elements['user-name'].textContent = state.user.displayName;
      this.elements['profile-pic'].src = state.user.photoURL!;
    } else {
      this.elements['user-name'].textContent = "Not signed in";
      this.elements['profile-pic'].src = "";
    }

    let attendees = this.elements['attendees'];
    while (attendees.firstChild) {
      attendees.removeChild(attendees.firstChild);
    }

    if (state.event) {
      this.elements['event-title'].textContent = state.event.title;
      for (let uid in state.event.attendees) {
        let user = state.event.attendees[uid];
        let userDiv = document.createElement('div');
        if (user.photoURL) {
          let pic = document.createElement('img');
          pic.src = user.photoURL;
          pic.setAttribute('style', 'height: 50px');
          userDiv.appendChild(pic);
        }
        let userName = document.createElement('span');
        userName.textContent = user.displayName;
        userDiv.appendChild(userName);
        this.elements['attendees'].appendChild(userDiv);
      }
    } else {
      this.elements['event-title'].textContent = "No Event";
    }
  }

  createEvent() {
    this.checkin.createEvent(
      this.elements['event-id'].value,
      this.elements['event-title-input'].value);
  }

  joinEvent() {
    this.checkin.joinEvent();
  }

  setEvent() {
    this.checkin.setEvent(this.elements['event-id'].value);
  }

  checkAnchor() {
    let hash = window.location.hash.slice(1);
    let parts = hash.split('&');
    for (let part of parts) {
      let [key, value] = part.split('=');
      if (key == 'event') {
        this.checkin.setEvent(value);
      }
    }
  }

  private bindElements() {
    this.elements = {};
    let elements = document.querySelectorAll('[id]');
    for (let i = 0; i < elements.length; i++) {
      let elt = elements[i];
      this.elements[elt.id] = elt as HTMLInputElement;
    }
  }
}
