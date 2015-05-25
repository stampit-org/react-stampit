import stampit from 'stampit';

const compose = function (...stamps) {
  let statics = {};

  stamps.forEach((stamp) => {
    /* eslint-disable */
    const {
      create,
      fixed,
      compose,
      ...other
    } = stamp;
    /* eslint-enable */

    stampit.mixIn(statics, other);
  });

  /**
   * Called by stamp
   */
  if (typeof this === 'function') {
    return stampit.mixIn(
      stampit.compose(this, ...stamps),
      statics
    );
  }

  /**
   * Called by stampit
   */
  return stampit.mixIn(
    stampit.compose(...stamps),
    statics
  );
};

const rStampit = function (React, props) {
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
      if (state) {
        this.state = state;
      }
    })
    .methods(methods);

  /**
   * Lockdown factory
   */
  delete stamp.methods;
  delete stamp.state;
  delete stamp.enclose;
  stamp.compose = compose;

  return stampit.mixIn(stamp, statics);
};

export default stampit.mixIn(rStampit, {
  /**
   * Utility methods to expose
   */
  compose,
});
