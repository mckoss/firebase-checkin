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
    checkin.createEvent('test-event' + randomString(), "This is my test event");
    checkin.listen((state) => {
      assert.equal(state.error, "You must be signed in to create an event.");
    });
  });
});

suite("Checkin Signed In.", () => {
  let checkin: Checkin;
  let signIn: firebase.Promise<any>;
  let eventId: string;
  let user: firebase.User;

  setup(() => {
    checkin = new Checkin(app);
    signIn = app.auth()
      .signInWithEmailAndPassword(TEST_USER_1, config.testAccountPassword)
      .then((newUser) => user = newUser);
    return signIn;
  });

  function createEvent() {
    eventId = 'test-event-' + randomString();
    return signIn
      .then((user) => {
        checkin.setCurrentUser(user);
        return checkin.createEvent(eventId, "This is my test event");
      });
  }

  test("Constructor", () => {
    assert.isNotNull(checkin);
  });

  test("Create user", () => {
    return signIn;
  });

  test("Create Event", (done) => {
    createEvent();
    checkin.listen((state) => {
      if (!state.event) {
        return;
      }
      assert.deepEqual(state, {
        error: null,
        user: {
          email: TEST_USER_1,
          displayName: "testuser01",
          photoURL: null
        },
        event: {
          title: "This is my test event",
          owner: user.uid,
          attendees: {
            [user.uid]: {
              displayName: "testuser01 (Organizer)",
              photoURL: null
            }
          }
        }
      });
      done();
    });
  });

  test("Over-write event by non-owner", function () {
    this.timeout(5000);

    return createEvent()
      .then(() => app.auth().signOut())
      .then(() => app.auth()
            .signInWithEmailAndPassword(TEST_USER_2,
                                        config.testAccountPassword))
      .then((user) => {
        checkin.setCurrentUser(user);
        checkin.createEvent(eventId, "Over-write event");
        checkin.listen((state) => {
          assert.equal(state.error, "Over-writing event by non-owner.");
        });
      });
  });

  test("Set and join event", (done) => {
    let count = 1;
    createEvent()
      .then(() => app.auth()
            .signInWithEmailAndPassword(TEST_USER_2,
                                        config.testAccountPassword))
      .then((user) => checkin.setCurrentUser(user))
      .then(() => checkin.setEvent(eventId))
      .then(() => {
        checkin.listen((state) => {
          assert.equal(state.user!.email, TEST_USER_2);
          assert.equal(Object.keys(state.event!.attendees).length, count);
          if (count === 1) {
            count += 1;
            checkin.joinEvent();
          } else {
            done();
          }
        });
      });
  });
});
