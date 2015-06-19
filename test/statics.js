import has from 'lodash/object/has';
import React from 'react';
import test from 'tape';

import stampit from '../src/stampit';

test('stampit({ statics: obj })(React)', (t) => {
  t.plan(1);

  const stampFactory = stampit({
    statics: {
      foo: '',
    },
  });
  const stamp = stampFactory(React);

  t.ok(
    has(stamp, 'foo'),
    'should return a stamp with `statics` props as props'
  );
});

test('stampit({ contextTypes: obj })(React)', (t) => {
  t.plan(1);

  const stampFactory = stampit({
    contextTypes: {},
  });
  const stamp = stampFactory(React);

  t.ok(
    has(stamp, 'contextTypes'),
    'should return a stamp with `contextTypes` prop'
  );
});

test('stampit({ childContextTypes: obj })(React)', (t) => {
  t.plan(1);

  const stampFactory = stampit({
    childContextTypes: {},
  });
  const stamp = stampFactory(React);

  t.ok(
    has(stamp, 'childContextTypes'),
    'should return a stamp with `childContextTypes` prop'
  );
});

test('stampit({ propTypes: obj })(React)', (t) => {
  t.plan(1);

  const stampFactory = stampit({
    propTypes: {},
  });
  const stamp = stampFactory(React);

  t.ok(
    has(stamp, 'propTypes'),
    'should return a stamp with `propTypes` prop'
  );
});

test('stampit({ defaultProps: obj })(React)', (t) => {
  t.plan(1);

  const stampFactory = stampit({
    defaultProps: {},
  });
  const stamp = stampFactory(React);

  t.ok(
    has(stamp, 'defaultProps'),
    'should return a stamp with `defaultProps` prop'
  );
});
