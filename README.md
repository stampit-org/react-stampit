[![Build Status](https://travis-ci.org/troutowicz/react-stampit.svg)](https://travis-ci.org/troutowicz/react-stampit)

# react-stampit

> A specialized [stampit](https://github.com/ericelliott/stampit) factory for [React](https://github.com/facebook/react).

Create React components in a way analogous to `React.createClass`, but powered by [stampit](https://github.com/ericelliott/stampit)'s composable object factories.

## Install

react-stampit can be [installed via npm](https://www.npmjs.com/package/react-stampit)

```
npm install react-stampit
```

or by [downloading the latest release](https://github.com/troutowicz/react-stampit/releases).

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

The best part about [stamps](https://en.wikipedia.org/wiki/Stamp_%28object-oriented_programming%29) is their composability. What this means is that `n` number of stamps can be combined into a new stamp which inherits each passed stamp's behavior. This is perfect for React, since `class` is being pushed as the new norm and does not provide an idiomatic way to use mixins. (classical inheritance :disappointed:). Stamp composability is 100% idiomatic and provides a limitless way to extend any React component.

```js
const mixin1 = {
  componentDidMount() {
    this.state.mixin1 = true;
  },
};

const mixin2 = {
  componentDidMount() {
    this.state.mixin2 = true;
  },
};

const component = stampit(React, {
  state: {
    comp: false,
    mixin1: false,
    mixin2: false,
  },

  someMethod() {
    this.state.comp = true;
  },

  componentDidMount() {
    this.someMethod();
  },
}).compose(mixin1, mixin2);

const instance = component();
instance.componentDidMount();

assert.deepEqual(
  instance.state,
  { comp: true, mixin1: true, mixin2: true }
);

>> ok
```

You may have noticed a few interesting behaviors.

* `this` just works

 This is not `React.createClass` magical autobinding. Stamps are regular objects, and behave like it.
* no `call super`

 React methods are wrapped during composition, providing functional inheritance. Sweet.
* mixins are POJOs

 This is shorthand syntax for:
 ```js
 stampit(null, {
   // stuff
 });
 ```

If you feel limited by `class`, or want a fresh take on `React.createClass`, maybe give react-stampit a try and learn more about what [stampit](https://github.com/ericelliott/stampit) is all about. And please report any issues you encounter!

## API

### stampit(React [,properties])

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

## Pending Issues
* [x] [childContextTypes](https://github.com/facebook/react/pull/3940)
* [x] [component testing](https://github.com/facebook/react/pull/3941)

## License
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](http://troutowicz.mit-license.org)
