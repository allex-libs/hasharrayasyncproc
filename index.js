function libCreator (execlib, arryopslib, datafilterslib) {
  'use strict';

  var lib = execlib.lib;
  var mylib = {
    jobs: {},
    jobcores: {}
  };

  require('./aggregators')(lib, mylib);
  require('./traversercreator')(lib, datafilterslib, mylib);
  require('./conditionaltraversecreator')(lib, mylib);
  require('./groupcreator')(lib, mylib);
  require('./joincreator')(lib, arryopslib, mylib);
  require('./aggregatecreator')(lib, mylib);

  return mylib;
}

function createHashArrayAsyncProcLib (execlib) {
  'use strict';

  return execlib.loadDependencies('client', ['allex:arrayoperations:lib', 'allex:datafilters:lib'], libCreator.bind(null, execlib));
}
module.exports = createHashArrayAsyncProcLib;