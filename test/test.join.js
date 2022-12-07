function equalizer (expct, result) {
  if (!(result instanceof lib.Map)) {
    expect(expct).to.have.deep.members(result);
    return;
  }
}

function testIt (options, expect) {
  it('test', function () {
    this.timeout(1e7);
    var ret = Lib.join(lib.extend({
    }, options)).then(equalizer.bind(null, expect));
    expect = null;
    return ret;
  });
}

describe('Test Join', function () {
  it('Load Lib', function () {
    return setGlobal('Lib', require('..')(execlib));
  });
  testIt({
    left: [{
      name: 'a',
      a: 1
    },{
      name: 'b',
      a: 2
    }],
    right: [{
      product: 'a',
      weight: 50
    },{
      product: 'b',
      weight: 60
    }],
    join: {
      left: 'name',
      right: 'product'
    }
  }, [
    {name: 'a', a: 1, weight: 50},
    {name: 'b', a: 2, weight: 60}
  ]);
  testIt({
    left: [{
      name: 'a',
      a: 1
    },{
      name: 'c',
      a: 2
    }],
    right: [{
      product: 'a',
      weight: 50
    },{
      product: 'b',
      weight: 60
    }],
    join: {
      left: 'name',
      right: 'product'
    }
  }, [
    {name: 'a', a: 1, weight: 50},
    {name: 'c', a: 2}
  ]);
  testIt({
    left: [{
      name: 'a',
      a: 1
    },{
      name: 'b',
      a: 2
    }],
    right: [{
      product: 'a',
      weight: 50
    },{
      product: 'b',
      weight: 60
    }],
    join: {
      left: 'name',
      right: 'product',
      leftfields: ['a'],
      rightfields: ['product']
    }
  }, [
    {product: 'a', a: 1},
    {product: 'b', a: 2}
  ])
});