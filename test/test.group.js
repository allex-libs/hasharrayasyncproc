function equalizer (expct, result) {
  if (!(result instanceof lib.Map)) {
    expect(expct).to.have.deep.members(result);
    return;
  }
}

function testIt (options, expect) {
  it('test', function () {
    this.timeout(1e7);
    var ret = Lib.group(lib.extend({
    }, options)).then(equalizer.bind(null, expect));
    expect = null;
    return ret;
  });
}

describe('Test Group', function () {
  it('Load Lib', function () {
    return setGlobal('Lib', require('..')(execlib));
  });
  testIt({
    data: [{
      name: 'a',
      a: 1
    },{
      name: 'b',
      a: 2
    }],
    group: {
      by: 'name',
      fields: {
        a: 'cnt'
      }
    }
  }, [
    {name: 'a', a: 1},
    {name: 'b', a: 1}
  ]);
});