function createGroupJob (lib, mylib) {
  'use strict';

  var qlib = lib.qlib;
  var SteppedJobOnSteppedInstance = qlib.SteppedJobOnSteppedInstance;

  function GroupJobCore (options) {
    this.options = options;
    this.finalResult = void 0;
    this.resultMap = new lib.Map();
  }
  GroupJobCore.prototype.destroy = function () {
    if(this.resultMap) {
       this.resultMap.destroy();
    }
    this.resultMap = null;
    this.finalResult = null;
    this.options = null;
  };
  GroupJobCore.prototype.shouldContinue = function () {
    if (lib.defined(this.finalResult)) {
      return this.finalResult;
    }
    if(!this.options) {
      throw new lib.Error('NO_OPTIONS', this.constructor.name+' needs to have options');
    }
    if (!lib.isArray(this.options.data)) {
      throw new lib.Error('NO_OPTIONS.DATA', this.constructor.name+' needs to have options.data');
    }
    if (!this.options.group) {
      throw new lib.Error('NO_OPTIONS.GROUP', this.constructor.name+' needs to have options.group');
    }
    if (!this.options.group.by) {
      throw new lib.Error('NO_OPTIONS.GROUP.BY', this.constructor.name+' needs to have options.group.by');
    }
  };

  GroupJobCore.prototype.init = function () {
    return mylib.traverse({
      data: this.options.data,
      filter: this.options.filter,
      cb: this.grouper.bind(this)
    });
  };
  GroupJobCore.prototype.finalize = function () {
    var ret = [], _r = ret, gb = this.options.group.by;
    this.resultMap.traverse(finalizer.bind(null, _r, gb));
    _r = null;
    gb = null;
    return ret;
  };

  function finalizer (ret, gb, val, name) {
    val[gb] = name;
    ret.push(val);
  }

  GroupJobCore.prototype.steps = [
    'init',
    'finalize'
  ];

  GroupJobCore.prototype.grouper = function (rec) {
    var found = true;
    var val = lib.readPropertyFromDotDelimitedString(rec, this.options.group.by);
    var mapitem = this.resultMap.get(val);
    if (!mapitem) {
      found = false;
      mapitem = {};
      mapitem[this.options.group.by] = null;
    }
    lib.traverseShallow(this.options.group.fields, subgrouper.bind(null, mapitem, rec));
    if (!found) {
      this.resultMap.add(val, mapitem);
    }
    mapitem = null;
    rec = null;
  };

  function subgrouper (mapitem, rec, op, field) {
    var agg = mylib.aggregatorFactory(op);
    mapitem[field] = agg(mapitem[field], lib.readPropertyFromDotDelimitedString(rec, field));
  }

  function GroupJob (options, defer) {
    SteppedJobOnSteppedInstance.call(
      this,
      new GroupJobCore(options),
      defer
    )
  }
  lib.inherit(GroupJob, SteppedJobOnSteppedInstance);
  mylib.jobs.Group = GroupJob;

  mylib.group = function (options, defer) {
    return (new GroupJob(options, defer)).go();
  }
}
module.exports = createGroupJob;