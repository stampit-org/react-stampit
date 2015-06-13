### Class decorator

For all those nice guys/gals that like `class` and just want some mixability. It is assumed that the component directly extends React.Component, anything else should be inherited via stamp composition.

```js
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
    bar: 'bar',
  },
};

Component = Component.compose(mixin);

assert.deepEqual(Component.propTypes, { foo: 'foo', bar: 'bar' });
  >> ok
```

__*Warning: Class decorators are a proposal for ES7, they are not set in stone.*__
