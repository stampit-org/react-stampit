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
 * Iterate through stamp methods, creating wrapper
 * functions for mixable React methods,
 * starting execution with last-in.
 *
 * @param {Object} dest Method destination
 * @param {Object} src New methods
 * @return {Object} An object of methods
 */
function wrapFunctions(targ, src) {
  let funcs;
  const mixability = {
    componentWillMount: 'many',
    componentDidMount: 'many',
    componentWillReceiveProps: 'many',
    componentWillUpdate: 'many',
    shouldComponentUpdate: 'once',
    componentDidUpdate: 'many',
    render: 'once',
    componentWillUnmount: 'many',
    getChildContext: 'many_merged',
  };

  funcs = mapValues(src, (val, key) => {
    if (typeof val === 'function') {
      switch (mixability[key]) {
        case 'many':
          return function () {
            const res1 = targ[key] && targ[key].apply(this, arguments);
            const res2 = val.apply(this, arguments);

            return res2 || res1;
          };
        case 'many_merged':
          return function () {
            const res1 = targ[key] && targ[key].apply(this, arguments);
            const res2 = val.apply(this, arguments);

            if (res1) {
              return assign({}, res1, res2, dupeFilter);
            }

            return res2;
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

  return assign({}, targ, funcs);
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
  const dupeCheck = ['propTypes', 'defaultProps'];

  forEach(src, (val, key) => {
    if (dupeCheck.indexOf(key) >= 0) {
      statics[key] = assign({}, statics[key], val, dupeFilter);
    } else if (typeof val === 'object') {
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
 * Combining overrides properties with last-in priority.
 *
 * state - concatenative inheritance / cloning
 *
 * statics - concatenative inheritance / cloning
 *
 * methods - functional inheritance / closure prototypes
 *   - execute wrapped methods with first-in priority
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
    /* eslint-disable */
    stamp = !isStamp(stamp) ? rStampit(null, stamp) : stamp;
    /* eslint-enable */

    methods = wrapFunctions(methods, stamp.fixed.methods);
    statics = extractStatics(statics, stamp.fixed.static);

    if (stamp.fixed.state && stamp.fixed.state.state) {
      state.state = assign({}, state.state, stamp.fixed.state.state, dupeFilter);
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
    react.compose = compose;
    return stripStamp(react);
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
