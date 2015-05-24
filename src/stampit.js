import stampit from 'stampit';

const rStampit = (React, props) => {
  if (!React) {
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

  /**
   * Lockdown factory
   */
  delete stamp.methods;
  delete stamp.state;
  delete stamp.enclose;

  return stampit.mixIn(stamp, statics);
};

export default stampit.mixIn(rStampit, {
  /**
   * Utility methods to expose
   */
  compose: stampit.compose,
});
