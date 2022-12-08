function createAggregateJob (lib, mylib) {
  'use strict';

  var qlib = lib.qlib;
  var SteppedJobOnSteppedInstance = qlib.SteppedJobOnSteppedInstance;

  function AggregateJobCore (options) {
    this.options = options;
    this.finalResult = void 0;
    this.agg = null;
  }
  AggregateJobCore.prototype.destroy = function () {
    this.agg = null;
    this.finalResult = null;
    this.options = null;
  };
  AggregateJobCore.prototype.shouldContinue = function () {
    if (lib.defined(this.finalResult)) {
      return this.finalResult;
    }
    if(!this.options) {
      throw new lib.Error('NO_OPTIONS', this.constructor.name+' needs to have options');
    }
    if (!lib.isArray(this.options.data)) {
      throw new lib.Error('NO_OPTIONS.DATA', this.constructor.name+' needs to have options.data');
    }
    if (!this.options.aggregate) {
      throw new lib.Error('NO_OPTIONS.AGGREGATE', this.constructor.name+' needs to have options.aggregate');
    }
  };

  AggregateJobCore.prototype.init = function () {
    if (!lib.isString(this.options.aggregate)) {
      this.agg = {};
    }
    return mylib.traverse({
      data: this.options.data,
      filter: this.options.filter,
      cb: this.onRec.bind(this)
    })
  };
  AggregateJobCore.prototype.finalize = function () {
    return this.agg;
  };

  AggregateJobCore.prototype.steps = [
    'init',
    'finalize'
  ];

  AggregateJobCore.prototype.onRec = function (rec) {
    var agg;
    if (lib.isString(this.options.aggregate)) {
      agg = mylib.aggregatorFactory(this.options.aggregate);
      this.agg = agg(this.agg, rec);
      return;
    }
    agg = this.agg;
    lib.traverse(this.options.aggregate, aggregator.bind(null, agg, rec));
    agg = null;
    rec = null;
  };

  function aggregator (aggobj, rec, aggname, fld) {
    var agg = mylib.aggregatorFactory(aggname);
    aggobj[fld] = agg(aggobj[fld], rec[fld]);
  }

  mylib.jobcores.Aggregate = AggregateJobCore;

  function AggregateJob (options, defer) {
    SteppedJobOnSteppedInstance.call(
      this,
      new AggregateJobCore(options),
      defer
    )
  }
  lib.inherit(AggregateJob, SteppedJobOnSteppedInstance);
  mylib.jobs.Aggregate = AggregateJob;

  mylib.aggregate = function (options, defer) {
    return (new AggregateJob(options, defer)).go();
  }
}
module.exports = createAggregateJob;