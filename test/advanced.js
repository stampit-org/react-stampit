import keys from 'lodash/object/keys';
import React from 'react';
import test from 'tape';

import stampit from '../src/stampit';
import { stamp } from '../src/stampit';

test('stamp decorator', (t) => {
  t.plan(4);

  @stamp
  class Component extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        foo: 'foo',
      };
    }

    render() {
      return null;
    }
  }

  Component.defaultProps = {
    foo: 'foo',
  };

  const mixin = {
    state: {
      bar: 'bar',
    },

    defaultProps: {
      bar: 'bar',
    },
  };

  t.ok(stampit.isStamp(Component), 'converts class to stamp');
  /* eslint-disable new-cap */
  t.ok(Component().render, 'maps methods');
  t.deepEqual(
    keys(Component.compose(mixin)().state), ['bar', 'foo'],
    'merges state'
  );
  t.deepEqual(
    keys(Component.compose(mixin).defaultProps), ['bar', 'foo'],
    'merges statics'
  );
  /* eslint-enable new-cap */
});

test('stamp factory', (t) => {
  t.plan(4);

  const stampFactory1 = React => stampit(React, {
    displayName: 'Component',
  });

  const stampFactory2 = React => stampit(React, {
    displayName: 'ReactStamp',
  });

  const stamp1 = stampFactory1(React);
  const stamp2 = stampFactory1(React);
  const stamp3 = stampFactory2(React);
  const stamp4 = stampFactory2(React);
  const composedStamp1 = stampit.compose(stamp1, { displayName: 'ComposedStamp1' });
  const composedStamp2 = stampit.compose(stamp1, { displayName: 'ComposedStamp1' });
  const composedStamp3 = stampit.compose(stamp1, { displayName: 'ReactStamp' });
  const composedStamp4 = stampit.compose(stamp1, { displayName: 'ReactStamp' });

  t.equal(
    stamp1, stamp2,
    'is memoized when displayName prop !== \'ReactStamp\''
  );

  t.notEqual(
    stamp3, stamp4,
    'is not memoized when displayName prop == \'ReactStamp\''
  );

  t.equal(
    composedStamp1, composedStamp2,
    'is memoized in composition when displayName prop !== \'ReactStamp\''
  );

  t.notEqual(
    composedStamp3, composedStamp4,
    'is not memoized in composition when displayName prop == \'ReactStamp\''
  );
});
