import keys from 'lodash/object/keys';
import React from 'react';
import test from 'tape';

import stampit from '../src';
import stamp from '../src/utils/decorator';

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
