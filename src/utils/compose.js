import assign from 'lodash/object/assign';
import forEach from 'lodash/collection/forEach';
import has from 'lodash/object/has';
import mapValues from 'lodash/object/mapValues';
import omit from 'lodash/object/omit';
import stampit from 'stampit';

import rStampit from '../';
import { isStamp, stripStamp } from './';

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
export default function compose(...stamps) {
  let result = stampit(),
      refs = { state: {} },
      init = [], methods = {}, statics = {};

  if (isStamp(this)) stamps.push(this);

  forEach(stamps, stamp => {
    stamp = !isStamp(stamp) ? rStampit(null, stamp) : stamp; // eslint-disable-line

    init = init.concat(stamp.fixed.init);
    methods = wrapMethods(methods, stamp.fixed.methods);
    statics = extractStatics(statics, omit(stamp, (val, key) => has(result, key)));

    if (stamp.fixed.refs && stamp.fixed.refs.state) {
      assign(refs.state, stamp.fixed.refs.state, dupeFilter);
    }
  });

  result = result
    .init(init)
    .refs(refs)
    .methods(methods)
    .static(statics);
  result.compose = compose;

  return stripStamp(result);
}
