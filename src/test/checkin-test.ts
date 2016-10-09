import {assert} from 'chai';
import {Checkin} from '../checkin';

suite("Checkin tests.", () => {
  test("Constructor", () => {
    let c = new Checkin();
    assert.isNotNull(c);
  });
});
