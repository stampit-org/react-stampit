[![Build Status](https://travis-ci.org/troutowicz/react-stampit.svg)](https://travis-ci.org/troutowicz/react-stampit)

# react-stampit

> A specialized [stampit](https://github.com/ericelliott/stampit) factory for [React](https://github.com/facebook/react).

Create React components in a way analogous to `React.createClass`, but powered by [stampit](https://github.com/ericelliott/stampit)'s composable object factories.

**_This is a work in progress. The factory currently produces React components, but composition implementation is being drafted [in this PR](https://github.com/troutowicz/react-stampit/pull/2). Also check below for React issues that are pending._**

## Install

react-stampit can be [installed via npm](https://www.npmjs.com/package/react-stampit)

```
npm install react-stampit
```

or by [downloading the latest release](https://github.com/troutowicz/react-stampit/releases).

## Features

 * Create factory functions (called stamps) which stamp out new React components. All of the new React components inherit all of the prescribed behavior.

 * Compose stamps together to create new stamps. Mixins!

## Use

Let's start by creating the simplest of React components.

```js
const baseComponent = stampit(React, {
  render() {
    return this.state;
  },
});
```

Maybe we have a need for a reusable util function.

```js
const utils = stampit(React, {
  statics: {
    someUtil() {
      return 'reusability through composability!';
    },
  },
});
```

Now for our final form.

```js
const component = stampit(React, {
  /**
   * state: {},
   * statics: {},
   *
   * contextTypes: {},
   * childContextTypes: {}.
   * propTypes: {},
   * defaultProps: {},
   *
   * ...lifecycleMethods
   */

   state: {
     foo: 'foo',
   },
}).compose(baseComponent, utils);
```

```js
test('component().render()', (t) => {
  t.plan(1);

  t.equal(
    component().render().foo,
    'foo',
    'should be inherited from `baseComponent`'
  );
});

>> ok

test('component.someUtil()', (t) => {
  t.plan(1);

  t.equal(
    component.someUtil(),
    'reusability through composability!',
    'should be inherited from `utils`'
  );
});

>> ok
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

### stampit.compose([arg1], [arg2] [,arg3...])

Take two or more stamps produced from `react-stampit` or `stampit` and
combine them to produce and return a new stamp. Combining overrides
properties with last-in priority.

* `@param {...Function} stamp` Two or more stamps.
* `@return {Function}` A new stamp composed from arguments.

## Issues
* [childContextTypes](https://github.com/facebook/react/pull/3940)
* [component testing](https://github.com/facebook/react/pull/3941)

## License
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](http://troutowicz.mit-license.org)
