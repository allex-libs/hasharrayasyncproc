var hasharry = [{
  name: 'r',
  age: 20
},{
  name: 'l',
  age: 29
},{
  name: 'a',
  age: 55
}];

function equalizer (expct, result) {
  if (lib.isNumber(expct) ||
    lib.isString(expct) ||
    lib.isBoolean(expct) ||
    !lib.isVal(expct)
  ) {
    expect(expct).to.equal(result);
    return;
  }
  expect(expct).to.deep.equal(result);
}

function testIt (options, expect) {
  it('test', function () {
    this.timeout(1e7);
    var ret = Lib.aggregate(lib.extend({
    }, options)).then(equalizer.bind(null, expect));
    expect = null;
    return ret;
  });
}

describe('Test Aggregate', function () {
  it('Load Lib', function () {
    return setGlobal('Lib', require('..')(execlib));
  });
  testIt({
    data: hasharry,
    aggregate: 'cnt'
  }, 3);
  testIt({
    data: hasharry,
    aggregate: {
      name: {
        op: 'concat',
        options: {
          delimiter: '|'
        }
      }
    }
  }, {name: 'r|l|a'});
  testIt({
    data: hasharry,
    aggregate: {
      name: {
        op: 'concat'
      },
      age: 'sum'
    }
  }, {
    name: 'rla',
    age: 104
  });
});