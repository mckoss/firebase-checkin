import { assert } from 'chai';
import { negatePromise, randomString } from './helpers';

import * as firebase from 'firebase';
import { Checkin } from '../checkin';

let config = require('../config');

let app = firebase.initializeApp(config);

suite("Checkin not Signed In", () => {
  let checkin: Checkin;

  setup(() => {
    checkin = new Checkin(app);
  });

  test("Constructor", () => {
    assert.isNotNull(checkin);
  });

  test("Create Event", () => {
    negatePromise(checkin.createEvent('test-event' + randomString(), "This is my test event"),
      "Should not be able to create events w/o sign in");
  });
});

suite("Checkin Signed In.", () => {
  let checkin: Checkin;

  setup(() => {
    checkin = new Checkin(app);
  });

  test("Constructor", () => {
    assert.isNotNull(checkin);
  });

  test("Create user", () => {
    return app.auth().signInAnonymously()
      .then((user) => {
        checkin.setCurrentUser(user);
      });
  });

  test("Create Event", () => {
    return app.auth().signInAnonymously()
      .then((user) => {
        checkin.setCurrentUser(user);
        return checkin.createEvent('test-event-' + randomString(), "This is my test event");
      });
  });

  test("Over-write event by non-owner", () => {
    let id = 'test-event-' + randomString();
    return app.auth().signInAnonymously()
      .then((user) => {
        checkin.setCurrentUser(user);
        return checkin.createEvent(id, "This is my test event");
      })
      .then(() => app.auth().signOut())
      .then(() => app.auth().signInAnonymously())
      .then((user) => {
        return negatePromise(checkin.createEvent(id, "Over-write event"),
          "Over-writing event by non-owner.");
      });
  });
});
