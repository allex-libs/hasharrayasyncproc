function libCreator (execlib, arryopslib, datafilterslib) {
  'use strict';

  var lib = execlib.lib;
  var mylib = {
    jobs: {},
    jobcores: {}
  };

  require('./traversercreator')(lib, datafilterslib, mylib);
  require('./conditionaltraversecreator')(lib, mylib);
  require('./group')(lib, mylib);
  require('./joincreator')(lib, arryopslib, mylib);

  return mylib;
}

function createHashArrayAsyncProcLib (execlib) {
  'use strict';

  return execlib.loadDependencies('client', ['allex:arrayoperations:lib', 'allex:datafilters:lib'], libCreator.bind(null, execlib));
}
module.exports = createHashArrayAsyncProcLib;