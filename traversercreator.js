function createTraverseJob (lib, datafilterslib, mylib) {
  'use strict';

  var q = lib.q;
  var qlib = lib.qlib;
  var SteppedJobOnSteppedInstance = qlib.SteppedJobOnSteppedInstance;

  function TraverseJobCore (options) {
    this.options = options;
    this.finalResult = void 0;
    this.index = -1;
    this.filter = (options && options.filter) ? datafilterslib.createFromDescriptor(options.filter) : null;
    this.done = 0;
  }
  TraverseJobCore.prototype.destroy = function () {
    this.done = null;
    if(this.filter) {
       this.filter.destroy();
    }
    this.filter = null;
    this.index = null;
    this.finalResult = null;
    this.options = null;
  };
  TraverseJobCore.prototype.shouldContinue = function () {
    if (lib.defined(this.finalResult)) {
      return this.finalResult;
    }
    if(!this.options) {
      throw new lib.Error('NO_OPTIONS', this.constructor.name+' needs to have options');
    }
    if (!lib.isArray(this.options.data)) {
      throw new lib.Error('NO_OPTIONS.DATA', this.constructor.name+' needs to have options.data');
    }
    if (!lib.isFunction(this.options.cb)) {
      throw new lib.Error('NO_OPTIONS.CB', this.constructor.name+' needs to have options.cb');
    }
  };

  TraverseJobCore.prototype.init = function () {
    var rec, cbret;
    this.index++;
    if (!(this.index < this.options.data.length)) {
      return;
    }
    rec = this.options.data[this.index];
    if (this.filter) {
      if (!this.filter.isOK(rec)) {
        return q(true).then(this.init.bind(this));
      }
    }
    cbret = this.options.cb(rec);
    if (this.cbReturnShouldStopExecution(cbret)) {
      return;
    }
    this.done++;
    if (q.isThenable(cbret)) {
      return cbret.then(this.init.bind(this));
    }
    return q(cbret).then(this.init.bind(this));
  };
  TraverseJobCore.prototype.finalize = function () {
    return this.done;
  };

  TraverseJobCore.prototype.steps = [
    'init',
    'finalize'
  ];

  TraverseJobCore.prototype.cbReturnShouldStopExecution = function (cbret) {
    return false;
  };
  
  mylib.jobcores.Traverse = TraverseJobCore;


  function TraverseJob (options, defer) {
    SteppedJobOnSteppedInstance.call(
      this,
      new TraverseJobCore(options),
      defer
    )
  }
  lib.inherit(TraverseJob, SteppedJobOnSteppedInstance);
  mylib.jobs.Traverse = TraverseJob;

  mylib.traverse = function (options, defer) {
    return (new TraverseJob(options, defer)).go();
  }
}
module.exports = createTraverseJob;