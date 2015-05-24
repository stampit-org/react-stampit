import React from 'react';
import test from 'tape';

import stampit from '../src/stampit';

test('stampit(React, props).compose(stampMixin, ...)', (t) => {
  t.plan(1);

  const stampMixin = stampit(React, {
    render() {
      return 'mixin';
    },
  });

  const stamp = stampit(React, {
    render() {},
  }).compose(stampMixin);

  t.equal(
    stamp().render(),
    'mixin',
    'should return a factory with mixins'
  );
});
