import React from 'react';
import test from 'tape';

import stampit from '../src/stampit';

test('stampit(React, props).compose(stamp2)', (t) => {
  t.plan(1);

  const stamp2 = stampit(React, {
    render() {
      return 'mixin';
    },
  });

  const stamp = stampit(React, {
    render() {},
  }).compose(stamp2);

  t.equal(
    stamp().render(),
    'mixin',
    'should return a factory composed from `this` and passed args'
  );
});

test('stampit(React, props).compose(stamp2, stamp3)', (t) => {
  t.plan(2);

  const baseComponent = stampit(React, {
    render() {
      return this.state;
    },
  });

  const utils = stampit(React, {
    statics: {
      someUtil() {
        return 'reusability through composability!';
      },
    },
  });

  const component = stampit(React, {
    state: {
      foo: 'foo',
    },
  }).compose(baseComponent, utils);


  t.equal(
    component().render().foo,
    'foo',
    'should expose `this` to inherited methods'
  );

  t.equal(
    component.someUtil(),
    'reusability through composability!',
    'should inherit static methods'
  );
});

test('stampit.compose(stamp1, stamp2)', (t) => {
  t.plan(1);

  const stamp1 = stampit(React, {});
  const stamp2 = stampit(React, {
    render() {},
  });

  t.ok(
    stampit.compose(stamp1, stamp2)().render,
    'should return a factory composed from args'
  );
});
