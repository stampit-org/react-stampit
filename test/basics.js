import React from 'react/addons';
import test from 'tape';

import stampit from '../src/stampit';

const TestUtils = React.addons.TestUtils;

test('stampit()()', (t) => {
  t.plan(1);

  const stampFactory = stampit();
  const stamp = stampFactory();

  t.ok(
    stampit.isStamp(stamp),
    'should return a stamp'
  );
});

test('stampit(props)(React)', (t) => {
  t.plan(1);

  const stampFactory = stampit({});
  const stamp = stampFactory(React);

  t.ok(
    stampit.isStamp(stamp),
    'should return a stamp'
  );
});

test('stampit()(React)', (t) => {
  t.plan(1);

  const stampFactory = stampit();
  const stamp = stampFactory(React);

  t.ok(
    stampit.isStamp(stamp),
    'should return a stamp'
  );
});

test('stampit(props)()', (t) => {
  t.plan(1);

  const stampFactory = stampit({});
  const stamp = stampFactory();

  t.ok(
    stampit.isStamp(stamp),
    'should return a stamp'
  );
});

test('stampit({ render() })()()', (t) => {
  t.plan(1);

  const stampFactory = stampit({
    render() {},
  });
  const stamp = stampFactory(React);

  t.ok(
    TestUtils.isCompositeComponent(stamp()),
    'should return a React component'
  );
});

test('stampit(props)(React).compose', (t) => {
  t.plan(1);

  const stampFactory = stampit();
  const stamp = stampFactory(React);

  t.equal(
    typeof stamp.compose, 'function',
    'should be a function'
  );
});

test('stampit.compose', (t) => {
  t.plan(1);

  t.equal(
    typeof stampit.compose, 'function',
    'should be a function'
  );
});

test('stampit(props)(React).create', (t) => {
  t.plan(1);

  const stampFactory = stampit();
  const stamp = stampFactory(React);

  t.equal(
    typeof stamp.create, 'undefined',
    'should be undefined'
  );
});

test('stampit(props)(React).init', (t) => {
  t.plan(1);

  const stampFactory = stampit();
  const stamp = stampFactory(React);

  t.equal(
    typeof stamp.init, 'undefined',
    'should be undefined'
  );
});

test('stampit(props)(React).methods', (t) => {
  t.plan(1);

  const stampFactory = stampit();
  const stamp = stampFactory(React);

  t.equal(
    typeof stamp.methods, 'undefined',
    'should be undefined'
  );
});

test('stampit(props)(React).state', (t) => {
  t.plan(1);

  const stampFactory = stampit();
  const stamp = stampFactory(React);

  t.equal(
    typeof stamp.state, 'undefined',
    'should be undefined'
  );
});

test('stampit(props)(React).refs', (t) => {
  t.plan(1);

  const stampFactory = stampit();
  const stamp = stampFactory(React);

  t.equal(
    typeof stamp.refs, 'undefined',
    'should be undefined'
  );
});

test('stampit(props)(React).props', (t) => {
  t.plan(1);

  const stampFactory = stampit();
  const stamp = stampFactory(React);

  t.equal(
    typeof stamp.props, 'undefined',
    'should be undefined'
  );
});

test('stampit(props)(React).enclose', (t) => {
  t.plan(1);

  const stampFactory = stampit();
  const stamp = stampFactory(React);

  t.equal(
    typeof stamp.enclose, 'undefined',
    'should be undefined'
  );
});

test('stampit(props)(React).static', (t) => {
  t.plan(1);

  const stampFactory = stampit();
  const stamp = stampFactory(React);

  t.equal(
    typeof stamp.static, 'undefined',
    'should be undefined'
  );
});
