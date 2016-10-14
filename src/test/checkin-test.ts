import { assert } from 'chai';
import { negatePromise, randomString, tracePromise } from './helpers';

import * as firebase from 'firebase';
import { Checkin } from '../checkin';

let config = require('../config');

let app = firebase.initializeApp(config);

const TEST_USER_1 = 'testuser01@example.com';
const TEST_USER_2 = 'testuser02@example.com';

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
  let signIn: firebase.Promise<any>;

  setup(() => {
    checkin = new Checkin(app);
    signIn = app.auth()
      .signInWithEmailAndPassword(TEST_USER_1, config.testAccountPassword);
    return signIn;
  });

  test("Constructor", () => {
    assert.isNotNull(checkin);
  });

  test("Create user", () => {
    return signIn
      .then((user) => {
        tracePromise(checkin.setCurrentUser(user), "setCurrentUser");
      });
  });

  test("Create Event", () => {
    return signIn
      .then((user) => {
        checkin.setCurrentUser(user);
        return checkin.createEvent('test-event-' + randomString(), "This is my test event");
      });
  });

  test("Over-write event by non-owner", function () {
    this.timeout(5000);

    let id = 'test-event-' + randomString();
    return signIn
      .then((user) => {
        checkin.setCurrentUser(user);
        return checkin.createEvent(id, "This is my test event");
      })
      .then(() => app.auth().signOut())
      .then(() => app.auth().signInWithEmailAndPassword(TEST_USER_2, config.testAccountPassword))
      .then((user) => {
        checkin.setCurrentUser(user);
        return negatePromise(checkin.createEvent(id, "Over-write event"),
          "Over-writing event by non-owner.");
      });
  });

  test("Join event", () => {
  });
});
