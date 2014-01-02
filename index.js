'use strict';

var _ = require('lodash'),
  Logger = require('./lib/logger');

module.exports.server = function server(primus, options) {
  var Spark = primus.Spark;

  Spark.prototype._logger = new Logger(options.logging);

  Spark.prototype._log = function() {
    return this._logger.log.call(this._logger, this, _.first(arguments), _.rest(arguments));
  };

  Spark.prototype.log = function(level) {
    return this._logger.log.call(this._logger, this, level, _.rest(arguments));
  };

  //
  // Expose all supported logging levels
  //
  _.forEach(Logger.LEVELS, function(level) {
      Spark.prototype[level] = function() {
        return this._log.apply(this, [level].concat(_.toArray(arguments)));
      };
    });

  //
  // Alias err to error
  //
  Spark.prototype.err = Spark.prototype.error;
};

