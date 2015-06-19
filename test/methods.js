import React from 'react';
import test from 'tape';

import stampit from '../src/stampit';

test('stampit({ method() {} })(React)()', (t) => {
  t.plan(1);

  const stampFactory = stampit({
    render() {},
  });
  const stamp = stampFactory(React);

  t.equal(
    typeof Object.getPrototypeOf(stamp()).render, 'function',
    'should return an instance with `method` as internal proto prop'
  );
});
