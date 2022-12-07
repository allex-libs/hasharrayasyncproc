function createJoinJob (lib, arryopslib, mylib) {
  'use strict';

  var qlib = lib.qlib;
  var SteppedJobOnSteppedInstance = qlib.SteppedJobOnSteppedInstance;

  function JoinJobCore (options) {
    this.options = options;
    this.finalResult = void 0;
    this.joined = [];
  }
  JoinJobCore.prototype.destroy = function () {
    this.joined = null;
    this.finalResult = null;
    this.options = null;
  };
  JoinJobCore.prototype.shouldContinue = function () {
    if (lib.defined(this.finalResult)) {
      return this.finalResult;
    }
    if(!this.options) {
      throw new lib.Error('NO_OPTIONS', this.constructor.name+' needs to have options');
    }
    if (!lib.isArray(this.options.left)) {
      throw new lib.Error('NO_OPTIONS.LEFT', this.constructor.name+' needs to have options.left');
    }
    if (!lib.isArray(this.options.right)) {
      throw new lib.Error('NO_OPTIONS.RIGHT', this.constructor.name+' needs to have options.right');
    }
    if (!this.options.join) {
      throw new lib.Error('NO_OPTIONS.JOIN', this.constructor.name+' needs to have options.join');
    }
    if (!this.options.join.left) {
      throw new lib.Error('NO_OPTIONS.JOIN.LEFT', this.constructor.name+' needs to have options.join.left');
    }
    if (!this.options.join.right) {
      throw new lib.Error('NO_OPTIONS.JOIN.RIGHT', this.constructor.name+' needs to have options.join.right');
    }
  };

  JoinJobCore.prototype.init = function () {
    return mylib.traverse({
      data: this.options.left,
      filter: this.options.filter,
      cb: this.joiner.bind(this)
    });
  };
  JoinJobCore.prototype.finalize = function () {
    return this.joined;
  };

  JoinJobCore.prototype.steps = [
    'init',
    'finalize'
  ];

  JoinJobCore.prototype.joiner = function (rec) {
    var rrec = arryopslib.findElementWithProperty(
      this.options.right,
      this.options.join.right,
      lib.readPropertyFromDotDelimitedString(rec, this.options.join.left)
    )||{};
    this.joined.push(lib.extend({},
      lib.isArray(this.options.join.leftfields) ? lib.pick(rec, this.options.join.leftfields) : rec, //leftfields?
      lib.isArray(this.options.join.rightfields) 
      ?
      lib.pick(rrec, this.options.join.rightfields)
      :
      lib.pickExcept(rrec, [this.options.join.right]) //rightfields
    ));
  };

  function JoinJob (options, defer) {
    SteppedJobOnSteppedInstance.call(
      this,
      new JoinJobCore(options),
      defer
    )
  }
  lib.inherit(JoinJob, SteppedJobOnSteppedInstance);
  mylib.jobs.Join = JoinJob;

  mylib.join = function (options, defer) {
    return (new JoinJob(options, defer)).go();
  }
}
module.exports = createJoinJob;