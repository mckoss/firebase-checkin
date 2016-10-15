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

    this.elements['sign-in-google'].addEventListener('click',
      () => this.signInGoogle());
    this.elements['sign-in-facebook'].addEventListener('click',
      () => this.signInFacebook());
    this.elements['sign-out'].addEventListener('click',
      () => this.signOut());
    this.elements['create-event'].addEventListener('click',
      () => this.createEvent());
    this.elements['join-event'].addEventListener('click',
      () => this.joinEvent());
    this.elements['new-event'].addEventListener('click',
      () => this.newEvent());

    this.app.auth().onAuthStateChanged((user: firebase.User | null) => {
      this.checkin.setCurrentUser(user);
    });

    // Monitor the address bar for changes.
    setInterval(this.checkAnchor.bind(this), 500);

    this.checkin.listen(this.listener.bind(this));
  }

  signInGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    // signInWithPopup does not work on mobile devices
    this.app.auth().signInWithRedirect(provider);
  }

  signInFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
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

    this.setBodyState('signed-in', state.user !== null);
    this.setBodyState('event', state.event !== null);
    this.setBodyState('can-join', this.checkin.canJoin());
    this.setBodyState('is-joined', this.checkin.isJoined());

    if (state.user) {
      this.elements['user-name'].textContent = state.user.displayName;
      this.elements['profile-pic'].src = state.user.photoURL!;
    }

    let attendees = this.elements['attendees'];
    while (attendees.firstChild) {
      attendees.removeChild(attendees.firstChild);
    }

    if (state.event) {
      this.elements['event-title'].textContent = state.event.title;
      this.elements['event-url'].textContent = window.location.href;
      for (let uid in state.event.attendees) {
        let user = state.event.attendees[uid];
        let userDiv = document.createElement('div');
        userDiv.className = 'profile';
        if (user.photoURL) {
          let pic = document.createElement('img');
          pic.src = user.photoURL;
          userDiv.appendChild(pic);
        }
        let userName = document.createElement('span');
        userName.textContent = user.displayName;
        userDiv.appendChild(userName);
        this.elements['attendees'].appendChild(userDiv);
      }
    }
  }

  createEvent() {
    let eventId = this.elements['event-id'].value;
    this.checkin.createEvent(
      eventId,
      this.elements['event-title-input'].value);
    window.location.hash = '#event=' + eventId;
  }

  joinEvent() {
    this.checkin.joinEvent();
  }

  newEvent() {
    window.location.hash = '';
    this.checkin.setEvent('');
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

  private setBodyState(name: string, set = true) {
    if (set) {
      document.body.classList.add(name);
    } else {
      document.body.classList.remove(name);
    }
  }
}
