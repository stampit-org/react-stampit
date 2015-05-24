[![Build Status](https://travis-ci.org/troutowicz/react-stampit.svg)](https://travis-ci.org/troutowicz/react-stampit)

# react-stamp
> A specialized [stampit](https://github.com/ericelliott/stampit) stamp for [React](https://github.com/facebook/react).

Work in progress

### Use
```js
import React from 'react';
import stampit from 'react-stampit';

export default stampit(React, {
  state: {},
  statics: {},

  // static convenience objects
  contextTypes: {},
  propTypes: {},
  defaultProps: {},

  // lifecycle methods
  render() {}
}).compose(stampMixin);
```

[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](http://troutowicz.mit-license.org)
