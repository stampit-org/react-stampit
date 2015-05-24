[![Build Status](https://travis-ci.org/troutowicz/react-stampit.svg)](https://travis-ci.org/troutowicz/react-stampit)

# react-stampit

> A specialized [stampit](https://github.com/ericelliott/stampit) factory for [React](https://github.com/facebook/react).

Create React components in a way analogous to `React.createClass`, but powered by [stampit](https://github.com/ericelliott/stampit)'s composable object factories.

## Build

While this library is under development, the build step must be run manually.

```js
npm run build
```

## Use

```js
import React from 'react';
import stampit from 'react-stampit';

export default stampit(React, {
  state: {},
  statics: {},

  // static convenience props
  contextTypes: {},
  childContextTypes: {}.
  propTypes: {},
  defaultProps: {},

  // lifecycle methods
  render() {}
}).compose(stampMixin);
```

## API

### stampit(React, [properties])

Return a factory function (called a stamp) that will produce new React components using the prototypes that are passed in or composed.

* `@param {Object} React` The React module.
* `@param {Object} [props]` A map of property names and values specialized for React.
* `@return {Function} stamp` A factory to produce React components using the given properties.
* `@return {Function} stamp.compose` Add mixin (stamp) to stamp. Chainable.

## The stamp object

### stamp.compose([arg1] [,arg2] [,arg3...])

Take one or more stamps produced from `react-stampit` or `stampit` and
combine them with `this` to produce and return a new stamp.
Combining overrides properties with last-in priority.

* `@param {...Function} stamp` One or more stamps.
* `@return {Function}` A new stamp composed from `this` and arguments.

## Utility methods

### stampit.compose()

Take two or more stamps produced from `react-stampit` or `stampit` and
combine them to produce and return a new stamp. Combining overrides
properties with last-in priority.

* `@param {...Function} stamp` Two or more stamps.
* `@return {Function}` A new stamp composed from arguments.

## License
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](http://troutowicz.mit-license.org)
