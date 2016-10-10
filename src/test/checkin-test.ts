import { assert } from 'chai';

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
    return checkin.createEvent('test-event', "This is my test event")
      .then(() => {
        throw new Error("Should not be able to create events w/o sign in");
      })
      .catch((error) => {
        return true;
      });
  });
});

suite("Checkin Signed In.", () => {
  let checkin: Checkin;
  let user: firebase.User;

  setup(() => {
    checkin = new Checkin(app);
    return app.auth().signInAnonymously()
      .then((u) => {
        user = u;
      });
  });

  test("Constructor", () => {
    assert.isNotNull(checkin);
  });

  test("Create user", () => {
    checkin.setCurrentUser(user);
  });

  test("Create Event", () => {
    checkin.setCurrentUser(user);
    return checkin.createEvent('test-event', "This is my test event");
  });
});
