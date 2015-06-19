import keys from 'lodash/object/keys';
import React from 'react';
import test from 'tape';

import stampit from '../src/stampit';

test('stampit(props)(React).compose(stamp)', (t) => {
  t.plan(1);

  const mixinFactory = stampit({
    method() {
      return 'mixin';
    },
  });

  const stamp = stampit()(React).compose(mixinFactory());

  t.equal(
    stamp().method(), 'mixin',
    'should return a stamp composed of `this` and passed stamp'
  );
});

test('stampit(props)(React).compose(pojo)', (t) => {
  t.plan(1);

  const mixin = {
    method() {
      return 'mixin';
    },
  };

  const stamp = stampit()(React).compose(mixin);

  t.equal(
    stamp().method(), 'mixin',
    'should return a stamp composed of `this` and passed pojo'
  );
});

test('stampit(props)(React).compose(stamp2, stamp3)', (t) => {
  t.plan(2);

  const mixin1 = {
    method() {
      return this.state;
    },
  };

  const mixin2 = {
    statics: {
      util() {
        return 'static';
      },
    },
  };

  const stampFactory = stampit({
    state: {
      foo: '',
    },
  });
  const stamp = stampFactory(React).compose(mixin1, mixin2);

  t.deepEqual(
    keys(stamp().method()), ['foo'],
    'should expose `this` to inherited methods'
  );

  t.equal(
    stamp.util(), 'static',
    'should inherit static methods'
  );
});

test('stampit.compose(stamp2, stamp1)', (t) => {
  t.plan(1);

  const mixin = {
    method() {
      return 'mixin';
    },
  };

  const stampFactory = stampit();
  const stamp = stampFactory(React);

  t.equal(
    stampit.compose(mixin, stamp)().method(), 'mixin',
    'should return a stamp composed of passed stamps'
  );
});

test('stamps composed of stamps with state', (t) => {
  t.plan(2);

  const mixin = {
    state: {
      foo: ' ',
    },
  };

  const stampFactory = stampit({
    state: {
      bar: ' ',
    },
  });
  const stamp = stampFactory(React).compose(mixin);

  const failStampFactory = stampit({
    state: {
      foo: ' ',
    },
  });
  const failStamp = failStampFactory(React);

  t.deepEqual(
     stamp().state, { foo: ' ', bar: ' ' },
    'should inherit state'
  );

  t.throws(
    () => failStamp.compose(mixin), TypeError,
    'should throw on duplicate keys'
  );
});

test('stamps composed of stamps with React statics', (t) => {
  t.plan(8);

  const mixin = {
    contextTypes: {
      foo: React.PropTypes.string,
    },
    childContextTypes: {
      foo: React.PropTypes.string,
    },
    propTypes: {
      foo: React.PropTypes.string,
    },
    defaultProps: {
      foo: 'foo',
    },
  };

  const stampFactory = stampit({
    contextTypes: {
      bar: React.PropTypes.string,
    },
    childContextTypes: {
      bar: React.PropTypes.string,
    },
    propTypes: {
      bar: React.PropTypes.string,
    },
    defaultProps: {
      bar: 'bar',
    },
  });
  const stamp = stampFactory(React).compose(mixin);

  const failStampFactory1 = stampit({
    propTypes: {
      foo: React.PropTypes.string,
    },
  });
  const failStamp1 = failStampFactory1(React);

  const failStampFactory2 = stampit({
    defaultProps: {
      foo: 'foo',
    },
  });
  const failStamp2 = failStampFactory2(React);

  const okStampFactory1 = stampit({
    contextTypes: {
      foo: React.PropTypes.string,
    },
  });
  const okStamp1 = okStampFactory1(React);

  const okStampFactory2 = stampit({
    childContextTypes: {
      foo: React.PropTypes.string,
    },
  });
  const okStamp2 = okStampFactory2(React);

  t.deepEqual(
    keys(stamp.contextTypes), ['foo', 'bar'],
    'should inherit `contextTypes` props'
  );

  t.deepEqual(
    keys(stamp.childContextTypes), ['foo', 'bar'],
    'should inherit `childContextTypes` props'
  );

  t.deepEqual(
    keys(stamp.propTypes), ['foo', 'bar'],
    'should inherit `propTypes` props'
  );

  t.deepEqual(
    keys(stamp.defaultProps), ['foo', 'bar'],
    'should inherit `defaultProps` props'
  );

  t.throws(
    () => failStamp1.compose(mixin), TypeError,
    'should throw on duplicate keys in `propTypes`'
  );

  t.throws(
    () => failStamp2.compose(mixin), TypeError,
    'should throw on duplicate keys in `defaultProps`'
  );

  t.doesNotThrow(
    () => okStamp1.compose(mixin),
    'should not throw on duplicate keys in `contextTypes`'
  );

  t.doesNotThrow(
    () => okStamp2.compose(mixin),
    'should not throw on duplicate keys in `childContextTypes`'
  );
});

test('stamps composed of stamps with non-React statics', (t) => {
  t.plan(2);

  const mixin = {
    statics: {
      obj: {
        foo: 'foo',
        bar: '',
      },
      method() {
        return 'foo';
      },
    },
  };

  const stampFactory = stampit({
    statics: {
      obj: {
        bar: 'bar',
      },
      method() {
        return 'bar';
      },
    },
  });
  const stamp = stampFactory(React).compose(mixin);

  t.deepEqual(
    stamp.obj, { bar: 'bar' },
    'should inherit static objects overriding with last-in priority'
  );

  t.equal(
    stamp.method(), 'bar',
    'should inherit static methods overriding with last-in priority'
  );
});

test('stamps composed of stamps with mixable methods', (t) => {
  t.plan(2);

  const mixin1 = {
    getChildContext() {
      return {
        foo: '',
      };
    },

    componentDidMount() {
      this.state.mixin1 = true;
    },
  };

  const mixin2 = {
    componentDidMount() {
      this.state.mixin2 = true;
    },
  };

  const stampFactory = stampit({
    state: {
      stamp: false,
      mixin1: false,
      mixin2: false,
    },

    getChildContext() {
      return {
        bar: '',
      };
    },

    componentDidMount() {
      this.state.stamp = true;
    },
  });
  const stamp = stampFactory(React).compose(mixin1, mixin2);

  const instance = stamp();
  instance.componentDidMount();

  t.deepEqual(
    instance.state, { stamp: true, mixin1: true, mixin2: true },
    'should inherit functionality of mixable methods'
  );

  t.deepEqual(
    keys(instance.getChildContext()), ['foo', 'bar'],
    'should inherit functionality of getChildContext'
  );
});

test('stamps composed of stamps with non-mixable methods', (t) => {
  t.plan(1);

  const mixin = {
    render() {},
  };

  const stampFactory = stampit({
    render() {},
  });
  const stamp = stampFactory(React);

  t.throws(
    () => stamp.compose(mixin), TypeError,
    'should throw on duplicate methods'
  );
});

