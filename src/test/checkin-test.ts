import {assert} from 'chai';
import {Checkin} from '../checkin';
import * as rest from '../firebase-rest';

let secrets = require('../../auth-secrets');

suite("Checkin tests.", () => {
  let client = new rest.Client(secrets.APP, secrets.SECRET);

  test("Constructor", () => {
    let c = new Checkin();
    assert.isNotNull(c);
  });
});
