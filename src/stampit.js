import stampit from 'stampit';

let factory = (React, props) => {
  // React components must have render method
  if (!props.render) {
    return undefined;
  }

  const react = stampit.convertConstructor(React.Component);

  let {
    state,
    statics,
    contextTypes,
    childContextTypes,
    propTypes,
    defaultProps,
    /* eslint-disable */
    ...methods
    /* eslint-enable */
  } = props;

  statics = statics || {};
  if (contextTypes) {
    statics.contextTypes = contextTypes;
  }
  if (childContextTypes) {
    statics.childContextTypes = childContextTypes;
  }
  if (propTypes) {
    statics.propTypes = propTypes;
  }
  if (defaultProps) {
    statics.defaultProps = defaultProps;
  }

  let stamp = stampit
    .compose(react)
    .enclose(function () {
      this.state = state || {};
    })
    .methods(methods);

  return stampit.mixIn(stamp, statics);
};

let compose = (mixins) => {
  return stampit
    .compose(this)
    .methods(mixins);
};

export default stampit.mixIn(factory, { compose });
