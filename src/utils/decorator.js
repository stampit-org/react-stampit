import assign from 'lodash/object/assign';
import merge from 'lodash/object/merge';
import stampit from 'stampit';

import { compose } from '../';
import { stripStamp } from './';

/**
 * Get object of non-enum properties
 */
function getNonEnum(target) {
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
function getEnum(target) {
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
export default function stamp(Class) {
  const constructor = function() {
    merge(this, new Class());
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
