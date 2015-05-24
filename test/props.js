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

test('stampit(React, { statics: obj })', (t) => {
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
    'should return a factory with `statics` props as props'
  );
});

test('stampit(React, { contextTypes: obj })', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    contextTypes: {},

    render() {},
  });

  t.equal(
    typeof stamp.contextTypes,
    'object',
    'should return a factory with `contextTypes` prop'
  );
});

test('stampit(React, { childContextTypes: obj })', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    childContextTypes: {},

    render() {},
  });

  t.equal(
    typeof stamp.childContextTypes,
    'object',
    'should return a factory with `childContextTypes` prop'
  );
});

test('stampit(React, { propTypes: obj })', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    propTypes: {},

    render() {},
  });

  t.equal(
    typeof stamp.propTypes,
    'object',
    'should return a factory with `propTypes` prop'
  );
});

test('stampit(React, { defaultProps: obj })', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    defaultProps: {},

    render() {},
  });

  t.equal(
    typeof stamp.defaultProps,
    'object',
    'should return a factory with `defaultProps` prop'
  );
});

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
