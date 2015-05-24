import React from 'react/addons';
import test from 'tape';

import stampit from '../src/stampit';
import coreStampit from 'stampit';

const TestUtils = React.addons.TestUtils;

test('stampit()', (t) => {
  t.plan(1);

  const stamp = stampit();

  t.equal(
    typeof stamp,
    'undefined',
    'should return undefined'
  );
});

test('stampit(React, props)', (t) => {
  t.plan(1);

  const stamp = stampit(React, {});

  t.equal(
    typeof stamp,
    'function',
    'should return a function'
  );
});

test('stampit(React, props)()', (t) => {
  t.plan(1);

  const stamp = stampit(React, {
    render() {},
  });

  t.ok(
    TestUtils.isCompositeComponent(stamp()),
    'should return a React component'
  );
});

test('stampit(React, props).compose', (t) => {
  t.plan(1);

  t.equal(
    typeof stampit(React, {}).compose,
    'function',
    'should be a function'
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

test('stampit(React, props).methods', (t) => {
  t.plan(1);

  t.equal(
    typeof stampit(React, {}).methods,
    'undefined',
    'should be undefined'
  );
});

test('stampit(React, props).state', (t) => {
  t.plan(1);

  t.equal(
    typeof stampit(React, {}).state,
    'undefined',
    'should be undefined'
  );
});

test('stampit(React, props).enclose', (t) => {
  t.plan(1);

  t.equal(
    typeof stampit(React, {}).enclose,
    'undefined',
    'should be undefined'
  );
});
