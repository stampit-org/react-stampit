import stampit from './';
import * as cache from './utils/cache';
import { compose, isStamp, stamp } from './utils';

stampit.addons = {
  cache,
  compose,
  isStamp,
  stamp,
};

export default stampit;
