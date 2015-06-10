import keys from 'lodash/object/keys';
import React from 'react';
import test from 'tape';

import stampit from '../src/stampit';
import { stamp } from '../src/stampit';

test('stamp decorator', (t) => {
  t.plan(5);

  @stamp
  class Component extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        foo: 'foo',
      };
    }

    render() {}
  }

  Component.propTypes = {
    foo: '',
  };

  const mixin = {
    propTypes: {
      bar: '',
    },
  };

  t.ok(stampit.isStamp(Component), 'converts class to stamp');
  /* eslint-disable new-cap */
  t.ok(Component().state.foo, 'maps state');
  t.ok(Component().render, 'maps methods');
  t.ok(Component.propTypes, 'maps statics');
  t.deepEqual(
    keys(Component.compose(mixin).propTypes), ['bar', 'foo'],
    'brings composability'
  );
  /* eslint-enable new-cap */
});
