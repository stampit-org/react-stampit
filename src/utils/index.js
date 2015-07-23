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
