import assign from 'lodash/object/assign';
import has from 'lodash/object/has';
import isEmpty from 'lodash/lang/isEmpty';
import omit from 'lodash/object/omit';
import pick from 'lodash/object/pick';
import stampit from 'stampit';

import { compose, stripStamp } from './utils';

/**
 * Return a factory function (called a stamp) that will produce new
 * React components using the prototypes that are passed in or composed.
 *
 * @param {Object} React  The React library.
 * @param {Object} [props]  A map of property names and values specialized for React.
 * @return {Function} stamp A factory to produce React components using the given properties.
 * @return {Object} stamp.fixed An object map containing the fixed prototypes.
 */
export default function rStampit(React, props) {
  let stamp = React ? stampit.convertConstructor(React.Component) : stampit();
  let refs, init, methods, statics;

  // Shortcut for converting React's class to a stamp.
  if (isEmpty(props)) {
    stamp.compose = compose;
    return stripStamp(stamp);
  }

  init = props.init || [];
  refs = props.state && { state: props.state } || {};
  statics = assign({},
    props.statics,
    pick(props, ['contextTypes', 'childContextTypes', 'propTypes', 'defaultProps']),
    { displayName: props.displayName || 'ReactStamp' }
  );
  methods = omit(props, (val, key) => has(statics, key) || ['init', 'state', 'statics'].indexOf(key) >= 0);

  stamp = stamp
    .init(init)
    .refs(refs)
    .methods(methods)
    .static(statics);
  stamp.compose = compose;

  return stripStamp(stamp);
}
