function createAggregators (lib, mylib) {
  'use strict';

  var map = new lib.Map();

  map.add('cnt', function (agg, val) {
    return (agg||0)+1;
  });
  map.add('concat', function (agg, val) {
    return lib.joinStringsWith(agg, val, this ? this.delimiter||'' : '');
  });
  map.add('sum', function (agg, val) {
    return (agg||0) + val;
  });

  function checkDesc (desc) {
    if (lib.isString(desc)) {
      if (desc.length>0) {
        return desc;
      }
      throw new lib.Error('INVALID_AGGREGATOR_NAME', 'Aggregator name has to be a non-empty String');
    }
    try {
      if (lib.isString(desc.op)) {
        return checkDesc(desc.op);
      }
    }
    catch (e) {
      throw new lib.JSONizingError('INVALID_AGGREGATOR_DESCRIPTOR', desc, 'not a valid aggregator descriptor');
    }
    throw new lib.JSONizingError('INVALID_AGGREGATOR_DESCRIPTOR', desc, 'not a valid aggregator descriptor');
  }

  function factory (desc) {
    var aggname = checkDesc(desc);
    var ret = map.get(aggname);
    if (!lib.isFunction(ret)) {
      throw new lib.Error('AGGREGATOR_NOT_SUPPORTED', aggname+' is not a supported aggregator name');
    }
    ret = ret.bind(lib.isString(desc) ? null : desc.options);
    return ret;
  }

  mylib.aggregatorFactory = factory;
}
module.exports = createAggregators;