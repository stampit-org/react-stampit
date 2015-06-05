import React from 'react';
import test from 'tape';

import stampit from '../src/stampit';

test('stampit(React, { func() {} })()', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    render() {},
  });

  t.equal(
    typeof Object.getPrototypeOf(stamp()).render,
    'function',
    'should return an instance with `func` as internal proto prop'
  );
});
