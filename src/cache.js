let cache = {};

export function isStampCached(identifier) {
  return identifier && cache.hasOwnProperty(identifier);
}

export function cacheStamp(stamp) {
  const displayName = stamp.displayName;

  if (displayName && displayName !== 'ReactStamp') {
    cache[displayName] = stamp;
  }

  return stamp;
}

export function getCachedStamp(identifier) {
  return cache[identifier];
}
