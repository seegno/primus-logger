'use strict';

var winston = require('winston')
  , objectPath = require('object-path')
  , _ = require('lodash');

_.str = require('underscore.string');

var Logger = function Logger(options) {
  this.options = _.defaults(options || {}, {
    prefix: [],
    separator: '/',
    transports: [
      new (winston.transports.Console)()
    ]
  });

  this.logger = new (winston.Logger)(options);
};

Logger.LEVELS = [
  'debug',
  'info',
  'warn',
  'error'
];

Logger.prototype.log = function log(object, level, data) {
  var prefixArgs,
    placeholders,
    prefix,
    args;

  prefixArgs = _.map(this.options.prefix, function(property) {
    return objectPath.get(object, property);
  }, this);

  placeholders = _.times(prefixArgs.length, function() {
    return '%s';
  }).join(this.options.separator);

  if (placeholders.length > 0) {
    prefix = _.str.sprintf.apply(this, [['[', placeholders, ']'].join('')].concat(prefixArgs));
  }

  return this.logger[level].apply(this, _.flatten([prefix || []].concat(data)));
};

module.exports = Logger;
