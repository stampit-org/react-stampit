import assign from 'lodash/object/assign';
import forEach from 'lodash/collection/forEach';
import has from 'lodash/object/has';
import mapValues from 'lodash/object/mapValues';
import omit from 'lodash/object/omit';
import pick from 'lodash/object/pick';
import stampit from 'stampit';

function isStamp(obj) {
  return (
    typeof obj === 'function' &&
    typeof obj.compose === 'function' &&
    typeof obj.fixed === 'object'
  );
}

function stripStamp(stamp) {
  delete stamp.create;
  delete stamp.methods;
  delete stamp.state;
  delete stamp.enclose;
  delete stamp.static;

  return stamp;
}

const dupeFilter = function (prev, next, key, targ) {
  if (targ[key]) {
    throw new TypeError('Cannot mixin key `' + key + '` because it is provided by multiple sources.');
  }

  return next;
};

/**
 * React specification for creating new components
 */
const reactSpec = {
  propTypes: 'many_merged_dupe',
  defaultProps: 'many_merged_dupe',
  contextTypes: 'many_merged',
  childContextTypes: 'many_merged',
  getChildContext: 'many_merged_dupe',
  render: 'once',
  componentWillMount: 'many',
  componentDidMount: 'many',
  componentWillReceiveProps: 'many',
  shouldComponentUpdate: 'once',
  componentWillUpdate: 'many',
  componentDidUpdate: 'many',
  componentWillUnmount: 'many',
};

/**
 * Iterate through stamp methods, creating wrapper
 * functions for mixable React methods, starting
 * execution with first-in.
 *
 * @param {Object} targ Method destination
 * @param {Object} src New methods
 * @return {Object} An object of methods
 */
function wrapMethods(targ, src) {
  let methods;

  methods = mapValues(src, (val, key) => {
    if (typeof val === 'function') {
      switch (reactSpec[key]) {
        case 'many':
          return function () {
            /* eslint-disable no-unused-expressions */
            targ[key] && targ[key].apply(this, arguments);
            val.apply(this, arguments);
            /* eslint-disable no-unused-expressions */
          };
        case 'many_merged_dupe':
          return function () {
            const res1 = targ[key] && targ[key].apply(this, arguments);
            const res2 = val.apply(this, arguments);

            return res1 ? assign(res1, res2, dupeFilter) : res2;
          };
        case 'once':
        default:
          if (!targ[key]) {
            return val;
          }

          throw new TypeError('Cannot mixin `' + key + '` because it has a unique constraint.');
      }
    }
  });

  return assign({}, targ, methods);
}

/**
 * Process the static properties of a stamp and
 * combine the result with the passed in statics object.
 *
 * @param {Object} stamp A stamp
 * @param {Object} prev An object of past static properties
 * @return {Object} A processed object of static properties
 */
function extractStatics(targ, src) {
  let statics = assign({}, targ);

  forEach(src, (val, key) => {
    if (reactSpec[key] === 'many_merged_dupe') {
      statics[key] = assign({}, statics[key], val, dupeFilter);
    } else if (reactSpec[key] === 'many_merged') {
      statics[key] = assign({}, statics[key], val);
    } else {
      statics[key] = val;
    }
  });

  return statics;
}

/**
 * Take two or more stamps produced from react-stampit or
 * stampit and combine them to produce and return a new stamp.
 *
 * @param {...Function} stamp Two or more stamps.
 * @return {Function} A new stamp composed from arguments.
 */
function compose(...factories) {
  let stamps = factories.slice(),
      state = { state: {} },
      methods = {},
      statics = {};

  if (isStamp(this)) {
    stamps.push(this);
  }

  forEach(stamps, stamp => {
    stamp = !isStamp(stamp) ? rStampit(null, stamp) : stamp; // eslint-disable-line

    methods = wrapMethods(methods, stamp.fixed.methods);
    statics = extractStatics(statics, stamp.fixed.static);

    if (stamp.fixed.state && stamp.fixed.state.state) {
      assign(state.state, stamp.fixed.state.state, dupeFilter);
    }
  });

  return stripStamp(assign(
    stampit()
      .state(state)
      .methods(methods)
      .static(statics),
    { compose }
  ));
}

/**
 * Return a factory function (called a stamp) that will produce new
 * React components using the prototypes that are passed in or composed.
 *
 * @param {Object} React  The React library.
 * @param {Object} [props]  A map of property names and values specialized for React.
 * @return {Function} stamp A factory to produce React components using the given properties.
 * @return {Object} stamp.fixed An object map containing the fixed prototypes.
 */
function rStampit(React, props) {
  let react = React ? stampit.convertConstructor(React.Component) : stampit();
  let filtered, state, methods, statics;

  // shortcut for `convertConstructor`
  if (typeof props !== 'object' || Object.keys(props) === 0) {
    return stripStamp(assign(react, { compose }));
  }

  filtered = omit(props, ['state', 'statics']);
  statics = assign({},
    props.statics,
    pick(filtered, ['contextTypes', 'childContextTypes', 'propTypes', 'defaultProps'])
  );
  methods = omit(filtered, (val, key) => has(statics, key));
  state = props.state && { state: props.state };

  return stripStamp(assign(
    react
      .state(state)
      .methods(methods)
      .static(statics),
    { compose }
  ));
}

export default assign(rStampit, { compose, isStamp });
