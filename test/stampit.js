import React from 'react/addons';
import test from 'tape';

import stampit from '../src/stampit';

const TestUtils = React.addons.TestUtils;

test('stampit(React, {})', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    render() {},
  });

  t.equal(
    typeof stamp,
    'function',
    'should produce a function'
  );
});

test('stampit.compose', (t) => {
  t.plan(1);

  t.equal(
    typeof stampit.compose,
    'function',
    'should be a function'
  );
});

test('stamp factory without `render` prop', (t) => {
  t.plan(1);

  const stamp = stampit(React, {});

  t.equal(
    typeof stamp,
    'undefined',
    'should be undefined'
  );
});

test('stamp instance', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    render() {},
  });

  t.ok(
    TestUtils.isCompositeComponent(stamp()),
    'should be a React component'
  );
});

test('declared `state` prop', (t) => {
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
    'should exist as stamp instance\'s state prop'
  );
});

test('declared `statics` prop', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    statics: {
      foo: 'foo',
    },

    render() {},
  });

  t.equal(
    stamp.foo,
    'foo',
    'should exist as stamp factory props'
  );
});

test('declared `contextTypes` prop', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    contextTypes: {},

    render() {},
  });

  t.equal(
    typeof stamp.contextTypes,
    'object',
    'should exist as stamp factory prop'
  );
});

test('declared `childContextTypes` prop', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    childContextTypes: {},

    render() {},
  });

  t.equal(
    typeof stamp.childContextTypes,
    'object',
    'should exist as stamp factory prop'
  );
});

test('declared `propTypes` prop', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    propTypes: {},

    render() {},
  });

  t.equal(
    typeof stamp.propTypes,
    'object',
    'should exist as stamp factory prop'
  );
});

test('declared `defaultProps` prop', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    defaultProps: {},

    render() {},
  });

  t.equal(
    typeof stamp.defaultProps,
    'object',
    'should exist as stamp factory prop'
  );
});

test('declared methods', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    render() {},
  });

  t.equal(
    typeof Object.getPrototypeOf(stamp()).render,
    'function',
    'should exist on stamp instance\'s internal prototype'
  );
});

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
    'should produce stamp that includes properties of mixins'
  );
});
