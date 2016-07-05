'use strict';
var path = require('path');
module.exports = function (app) {
  app.get('/state', app.loopback.status());
};
