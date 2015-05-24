[![Build Status](https://travis-ci.org/troutowicz/react-stampit.svg)](https://travis-ci.org/troutowicz/react-stampit)

# react-stampit
> A specialized [stampit](https://github.com/ericelliott/stampit) factory for [React](https://github.com/facebook/react).

Work in progress

### Build
While this library is under development, the build step must be run manually.
```js
npm run build
```

### Use
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

[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](http://troutowicz.mit-license.org)
