import React from 'react';
import test from 'tape';

import stampit from '../src/stampit';

test('stampit(React, { state: obj })()', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    state: {
      foo: 'foo',
    },

    render() {},
  });

  t.equal(
    stamp().state.foo,
    'foo',
    'should return an instance with `state` prop'
  );
});
