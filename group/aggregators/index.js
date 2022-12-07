function createAggregators (lib) {
  'use strict';

  var map = new lib.Map();

  map.add('cnt', function (agg, val) {
    return (agg||0)+1;
  });

  function factory (name) {
    var ret = map.get(name);
    if (!lib.isFunction(ret)) {
      throw new lib.Error('AGGREGATOR_NOT_SUPPORTED', name+' is not a supported aggregator name');
    }
    return ret;
  }

  return factory;
}
module.exports = createAggregators;