import rewire from 'rewire';
import test from 'tape';

let stampit = rewire('../src/stampit');
let wrapFunctions = stampit.__get__('wrapFunctions');

test('wrapFunctions(obj1, obj2)', (t) => {
  t.plan(7);

  /* eslint-disable */
  const obj1 = {
    componentWillMount() { this.wrapped = true },
    componentDidMount() { this.wrapped = true },
    componentWillReceiveProps() { this.wrapped = true },
    componentWillUpdate() { this.wrapped = true },
    componentDidUpdate() { this.wrapped = true },
    componentWillUnmount() { this.wrapped = true },
    method() {},
  };

  const obj2 = {
    componentWillMount() { return this.wrapped; },
    componentDidMount() { return this.wrapped; },
    componentWillReceiveProps() { return this.wrapped; },
    componentWillUpdate() { return this.wrapped; },
    componentDidUpdate() { return this.wrapped; },
    componentWillUnmount() { return this.wrapped; },
  };

  const failObj = {
    method() {},
  };
  /* eslint-enable */

  t.ok(
    wrapFunctions(obj1, obj2).componentWillMount(),
    'should wrap `componentWillMount`'
  );

  t.ok(
    wrapFunctions(obj1, obj2).componentDidMount(),
    'should wrap `componentDidMount`'
  );

  t.ok(
    wrapFunctions(obj1, obj2).componentWillReceiveProps(),
    'should wrap `componentWillReceiveProps`'
  );

  t.ok(
    wrapFunctions(obj1, obj2).componentWillUpdate(),
    'should wrap `componentWillUpdate`'
  );

  t.ok(
    wrapFunctions(obj1, obj2).componentDidUpdate(),
    'should wrap `componentDidUpdate`'
  );

  t.ok(
    wrapFunctions(obj1, obj2).componentWillUnmount(),
    'should wrap `componentWillUnmount`'
  );

  t.throws(
    () => wrapFunctions(obj1, failObj), TypeError,
    'should throw on dupe non-React method'
  );
});
