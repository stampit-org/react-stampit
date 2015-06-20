[![Build Status](https://travis-ci.org/stampit-org/react-stampit.svg)](https://travis-ci.org/stampit-org/react-stampit)

# react-stampit

> A specialized [stampit](https://github.com/stampit-org/stampit) factory for [React](https://github.com/facebook/react).

Create React components in a way analogous to `React.createClass`, but powered by [stampit](https://github.com/stampit-org/stampit)'s composable object factories.

## Install

react-stampit can be [installed via npm](https://www.npmjs.com/package/react-stampit)

```
npm install react-stampit
```

or by [downloading the latest release](https://github.com/stampit-org/react-stampit/releases).

## What is this

This library is the result of wondering about what other ways a React component could be represented. [Stamps](https://en.wikipedia.org/wiki/Stamp_%28object-oriented_programming%29) are a cool concept, and more importantly have proven to be a great alternative to `React.createClass` and the ES6 `class` due to their flexibility and use of multiple kinds of prototypal inheritance.

react-stampit has an API similar to `React.createClass`. The factory accepts two parameters, the first being the React library and the second being an object comprised of React component properties.

```js
const component = stampit(React, {
  state: {},
  statics: {},

  // convenience props for React statics
  contextTypes: {},
  childContextTypes: {}.
  propTypes: {},
  defaultProps: {},

  // ...methods
});
```

The best part about [stamps](https://en.wikipedia.org/wiki/Stamp_%28object-oriented_programming%29) is their composability. What this means is that `n` number of stamps can be combined into a new stamp which inherits each passed stamp's behavior. This is perfect for React, since `class` is being pushed as the new norm and does not provide an idiomatic way to use mixins. (classical inheritance :disappointed:). While stamp composability on the surface is not idiomatic, the conventions used underneath are; it is these conventions that provide a limitless way to extend any React component.

__mixin1.jsx__

```js
export default {
  componentWillMount() {
    this.state.mixin1 = true;
  },
};
```

__mixin2.jsx__

```js
export default {
  componentWillMount() {
    this.state.mixin2 = true;
  },
};
```

__component.jsx__

```js
import stampit from 'react-stampit';

export default React => stampit(React, {
  state: {
    comp: false,
    mixin1: false,
    mixin2: false,
  },

  _onClick() {
    return this.state;
  },

  componentWillMount() {
    this.state.comp = true;
  },

  render() {
    return <input type='button' onClick={() => this._onClick()} />;
  },
});
```

__app.jsx__

```js
import React from 'react';

import componentFactory from './component';
import mixin1 from './mixin1';
import mixin2 from './mixin2';

const Component = componentFactory(React).compose(mixin1, mixin2);

/**
 * Do things
 */
```

```js
shallowRenderer.render(<Component />);
const button = shallowRenderer.getRenderOutput();

assert.deepEqual(
  button.props.onClick(), { comp: true, mixin1: true, mixin2: true },
  'should return component state with all truthy props'
);
  >> ok
```

You may have noticed a few interesting behaviors.

* component is a factory

 By using dependency injection for the React library, we are able to avoid problems caused by multiple instances of React. Read more about that [here](https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375). This pattern is optional, but recommended.

* no autobinding

 Event handlers require explicit binding. No magic. This can be done using `.bind` or through lexical binding with ES6 [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) as shown in the example.
* no `call super`

 React methods are wrapped during composition, providing functional inheritance. Sweet.
* mixins are POJOs

 This is shorthand syntax for:
 ```js
 stampit(null, {
   // stuff
 });
 ```

If you feel limited by `class`, or want a fresh take on `React.createClass`, maybe give react-stampit a try and learn more about what [stampit](https://github.com/stampit-org/stampit) is all about. And please report any issues you encounter!

Read more about react-stampit's composition [here](docs/composition.md).

For some advanced use cases, see [here](docs/advanced.md).

## API

### stampit(React [,props])

Return a factory function (called a stamp) that will produce new React components using the prototypes that are passed in or composed.

* `@param {Object} React` The React library.
* `@param {Object} [props]` A map of property names and values specialized for React.
* `@return {Function} stamp` A factory to produce React components using the given properties.
* `@return {Object} stamp.fixed` An object map containing the fixed prototypes.
* `@return {Function} stamp.compose` Add mixin (stamp) to stamp. Chainable.

## The stamp object

### stamp.compose([arg1] [,arg2] [,arg3...])

Take one or more stamps produced from `react-stampit` or `stampit` and
combine them with `this` to produce and return a new stamp.

* `@param {...Function} stamp` One or more stamps.
* `@return {Function}` A new stamp composed from `this` and arguments.

## Utility methods

### stampit.compose([arg1], [arg2] [,arg3...])

Take two or more stamps produced from `react-stampit` or `stampit` and
combine them to produce and return a new stamp.

* `@param {...Function} stamp` Two or more stamps.
* `@return {Function}` A new stamp composed from arguments.

### stampit.isStamp(obj)

Take an object and return true if it's a stamp, false otherwise.

## Examples
* [react-hello](https://github.com/stampit-org/react-hello)

## Pending Issues
* [x] [childContextTypes](https://github.com/facebook/react/pull/3940)
* [x] [component testing](https://github.com/facebook/react/pull/3941)

## License
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](http://troutowicz.mit-license.org)
