import assign from 'lodash/object/assign';
import stampit from 'stampit';

import { compose } from './stampit';

export function isStamp(obj) {
  return (
    typeof obj === 'function' &&
    typeof obj.compose === 'function' &&
    typeof obj.fixed === 'object'
  );
}

export function stripStamp(stamp) {
  delete stamp.create;
  delete stamp.init;
  delete stamp.methods;
  delete stamp.state;
  delete stamp.refs;
  delete stamp.props;
  delete stamp.enclose;
  delete stamp.static;

  return stamp;
}

/**
 * Get object of non-enum properties
 */
export function getNonEnum(target) {
  const props = Object.getOwnPropertyNames(target);
  const enumOnly = Object.keys(target);
  let obj = {};

  props.forEach(function(key) {
    var indexInEnum = enumOnly.indexOf(key);
    if (indexInEnum === -1 && key !== 'constructor') {
      obj[key] = target[key];
    }
  });

  return obj;
}

/**
 * Get object of enum properties
 */
export function getEnum(target) {
  const props = Object.keys(target);
  let obj = {};

  props.forEach(function(key) {
    obj[key] = target[key];
  });

  return obj;
}

/**
 * ES7 decorator for converting ES6 class to stamp
 */
export function stamp(Class) {
  const constructor = function() {
    assign(this, new Class());
  };
  const methods = assign({},
    Object.getPrototypeOf(Class).prototype,
    getNonEnum(Class.prototype)
  );

  let stamp = stampit
    .init(constructor)
    .methods(methods)
    .static(getEnum(Class));
  stamp.compose = compose;

  return stripStamp(stamp);
}
