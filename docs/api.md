## API

### stampit(React [,descObj])

Return a factory function (called a stamp) that will produce new React components using the prototypes that are passed in or composed.

* `@param {Object} React` The React library.
* `@param {Object} descObj` A map of property names and values specialized for React.
* `@return {Function} stamp` A factory to produce React components using the given properties.
* `@return {Object} stamp.fixed` An object map containing the fixed prototypes.
* `@return {Function} stamp.compose` Add mixin (stamp) to stamp. Chainable.

### stamp.compose([arg1] [,arg2] [,arg3...])

Take one or more stamps produced from `react-stampit` or `stampit` and
combine them with `this` to produce and return a new stamp.

* `@param {...Function} stamp` One or more stamps.
* `@return {Function}` A new stamp composed from `this` and arguments.

## Utility methods

### compose([arg1], [arg2] [,arg3...])

Take two or more stamps produced from `react-stampit` or `stampit` and
combine them to produce and return a new stamp.

* `@param {...Function} stamp` Two or more stamps.
* `@return {Function}` A new stamp composed from arguments.

### isStamp(obj)

Take an object and return true if it's a stamp, false otherwise.

## API Differences

react-stampit utitlizes a stamp description object made specifically for React components. Consider it a long lost relative of [stampit](https://github.com/stampit-org/stampit)'s stamp description object with nothing in common.

react-stampit has also stripped all of stampit's static methods to enforce an API familiar to React users. Users are encouraged to utilize [React's lifecycle](https://facebook.github.io/react/docs/component-specs.html) and [component properties](#what-is-this) as replacements for these methods.
