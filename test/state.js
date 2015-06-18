import has from 'lodash/object/has';
import React from 'react';
import test from 'tape';

import stampit from '../src/stampit';

test('stampit({ state: obj })(React)()', (t) => {
  t.plan(1);

  const stampFactory = stampit({
    state: {
      foo: '',
    },
  });
  const stamp = stampFactory(React);

  t.ok(
    has(stamp().state, 'foo'),
    'should return an instance with `state` prop'
  );
});
