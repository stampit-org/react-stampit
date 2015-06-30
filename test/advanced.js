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
  t.plan(2);

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

  t.equal(
    stamp1, stamp2,
    'memoizes stamp when displayName prop !== \'ReactStamp\''
  );

  t.notEqual(
    stamp3, stamp4,
    'does not memoize stamp when displayName prop == \'ReactStamp\''
  );
});
