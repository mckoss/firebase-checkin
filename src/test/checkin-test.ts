import {assert} from 'chai';
import {Checkin} from '../checkin';

let config = require('../config');

suite("Checkin tests.", () => {
  test("Constructor", () => {
    let c = new Checkin(firebase.initializeApp(config));
    assert.isNotNull(c);
  });
});
