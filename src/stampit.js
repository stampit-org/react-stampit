import stampit from 'stampit';

const compose = (mixins) => {
  const stamp = stampit
    .compose(this, mixins);

  // React components must have render method
  if (!stamp.fixed.methods.render) {
    return undefined;
  }

  return stamp;
};

export default (React, props) => {
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

  return stampit.mixIn(stamp, statics, { compose });
};
