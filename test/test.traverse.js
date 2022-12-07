function recProc (rec) {
}

function testIt (options, expect) {
  it('test', function () {
    this.timeout(1e7);
    return Lib.traverse(lib.extend({
      cb: recProc
    }, options)).should.eventually.equal(expect);
  });
}

describe('Test Traverse', function () {
  it('Load Lib', function () {
    return setGlobal('Lib', require('..')(execlib));
  });
  testIt({
    data: [{
      a: 1
    },{
      a: 2
    }]
  }, 2);
  testIt({
    data: [{
      a: 1
    },{
      a: 2
    }],
    filter: {
      op: 'eq',
      field: 'a',
      value: 1
    }
  }, 1);
});