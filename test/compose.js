import React from 'react';
import test from 'tape';

import stampit from '../src/stampit';

test('stampit(React, props).compose(stamp2)', (t) => {
  t.plan(1);

  const mixin = stampit(null, {
    componentDidMount() {
      return 'mixin';
    },
  });

  const stamp = stampit(React).compose(mixin);

  t.equal(
    stamp().componentDidMount(),
    'mixin',
    'should return a factory composed from `this` and passed args'
  );
});

test('stampit(React, props).compose(stamp2, stamp3)', (t) => {
  t.plan(2);

  const mixin1 = stampit(null, {
    render() {
      return this.state;
    },
  });

  const mixin2 = stampit(null, {
    statics: {
      someUtil() {
        return 'reusability through composability!';
      },
    },
  });

  const stamp = stampit(React, {
    state: {
      foo: 'foo',
    },
  }).compose(mixin1, mixin2);

  t.equal(
    stamp().render().foo,
    'foo',
    'should expose `this` to inherited methods'
  );

  t.equal(
    stamp.someUtil(),
    'reusability through composability!',
    'should inherit static methods'
  );
});

test('stampit.compose(stamp1, stamp2)', (t) => {
  t.plan(1);

  const mixin = stampit(null, {
    render() {
      return this.state;
    },
  });
  const stamp = stampit(React, {
    state: {
      foo: 'foo',
    },
  });

  t.equal(
    stampit.compose(stamp, mixin)().render().foo,
    'foo',
    'should return a factory composed from args'
  );
});

test('stamps composed of stamps with state', (t) => {
  t.plan(1);

  const mixin = stampit(null, {
    state: {
      foo: 'foo',
      bar: 'bar',
    },
  });

  const stamp = stampit(React, {})
    .compose(mixin);

  t.ok(
     stamp().state.foo && stamp().state.bar,
    'should inherit state overriding with last-in priority'
  );
});

test('stamps composed of stamps with React statics', (t) => {
  t.plan(6);

  const mixin = stampit(null, {
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
  });

  const stamp = stampit(React, {
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
  }).compose(mixin);

  const failStamp1 = stampit(React, {
    propTypes: {
      foo: React.PropTypes.string,
    },
  });

  const failStamp2 = stampit(React, {
    defaultProps: {
      foo: 'foo',
    },
  });

  t.ok(
    stamp.contextTypes.foo && stamp.contextTypes.bar,
    'should inherit `contextTypes` props'
  );

  t.ok(
    stamp.childContextTypes.foo && stamp.childContextTypes.bar,
    'should inherit `childContextTypes` props'
  );

  t.ok(
    stamp.propTypes.foo && stamp.propTypes.bar,
    'should inherit `propTypes` props'
  );

  t.ok(
    stamp.defaultProps.foo && stamp.defaultProps.bar,
    'should inherit `defaultProps` props'
  );

  t.throws(
    () => failStamp1.compose(mixin),
    TypeError,
    'should throw on duplicate keys in `propTypes`'
  );

  t.throws(
    () => failStamp2.compose(mixin),
    TypeError,
    'should throw on duplicate keys in `defaultProps`'
  );
});

test('stamps composed of stamps with non-React statics', (t) => {
  t.plan(2);

  const mixin = stampit(null, {
    statics: {
      someObj: {
        foo: 'foo',
        bar: ' ',
      },
      someFunc() {
        return 'foo';
      },
    },
  });

  const stamp = stampit(React, {
    statics: {
      someObj: {
        bar: 'bar',
      },
      someFunc() {
        return 'bar';
      },
    },
  }).compose(mixin);

  t.deepEqual(
    stamp.someObj,
    { foo: 'foo', bar: 'bar' },
    'should inherit static objects overriding props with last-in priority'
  );

  t.equal(
    stamp.someFunc(),
    'bar',
    'should inherit static methods overriding with last-in priority'
  );
});

test('stamps composed of stamps with mixable methods', (t) => {
  t.plan(2);

  const mixin1 = stampit(null, {
    getChildContext() {
      return {
        foo: 'foo',
      };
    },

    componentDidMount() {
      this.state.mixin1 = true;
    },
  });

  const mixin2 = stampit(null, {
    componentDidMount() {
      this.state.mixin2 = true;
    },
  });

  const stamp = stampit(React, {
    state: {
      stamp: false,
      mixin1: false,
      mixin2: false,
    },

    getChildContext() {
      return {
        bar: 'bar',
      };
    },

    componentDidMount() {
      this.state.stamp = true;
    },
  }).compose(mixin1, mixin2);

  const instance = stamp();
  instance.componentDidMount();

  t.deepEqual(
    instance.state,
    { stamp: true, mixin1: true, mixin2: true },
    'should inherit functionality of mixable methods'
  );

  t.deepEqual(
    instance.getChildContext(),
    { foo: 'foo', bar: 'bar' },
    'should inherit functionality of getChildContext'
  );
});

test('stamps composed of stamps with non-mixable methods', (t) => {
  t.plan(1);

  const mixin = stampit(null, {
    render() {},
  });

  const stamp = stampit(React, {
    render() {},
  });

  t.throws(
    () => stamp.compose(mixin),
    TypeError,
    'should throw on duplicate methods'
  );
});

