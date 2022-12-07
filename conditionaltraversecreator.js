function createConditionalTraverseJob (lib, mylib) {
  'use strict';

  var qlib = lib.qlib;
  var SteppedJobOnSteppedInstance = qlib.SteppedJobOnSteppedInstance;
  var TraverseJobCore = mylib.jobcores.Traverse;

  function ConditionalTraverseJobCore (options) {
    TraverseJobCore.call(this, options);
  }
  lib.inherit(ConditionalTraverseJobCore, TraverseJobCore);
  ConditionalTraverseJobCore.prototype.cbReturnShouldStopExecution = function (cbret) {
    if (lib.defined(cbret)) {
      this.finalResult = cbret;
      return true;
    }
    return false;
  };
  ConditionalTraverseJobCore.prototype.finalize = function () {
    return void 0;
  };
  

  function ConditionalTraverseJob (options, defer) {
    SteppedJobOnSteppedInstance.call(
      this,
      new ConditionalTraverseJobCore(options),
      defer
    )
  }
  lib.inherit(ConditionalTraverseJob, SteppedJobOnSteppedInstance);
  mylib.jobs.ConditionalTraverse = ConditionalTraverseJob;

  mylib.conditionalTraverse = function (options, defer) {
    return (new ConditionalTraverseJob(options, defer)).go();
  }
}
module.exports = createConditionalTraverseJob;