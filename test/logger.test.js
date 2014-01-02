'use strict';

var chai = require('chai')
  , expect = chai.expect
  , winston = require('winston')
  , Logger = require('../lib/logger');

chai.Assertion.includeStack = true;

describe('primus-logger', function() {
  it('should not include a prefix by default', function (done){
    var logger = new Logger({
      transports: [
        new (winston.transports.Console)({
          'silent': true
        })
      ]
    }),
    object = {
      foo: 'bar'
    };

    logger.logger.on('logging', function (transport, level, msg, meta) {
      expect(transport.name).to.equal('console');
      expect(level).to.equal('info');
      expect(msg).to.equal('an informative message');
      expect(meta).to.be.empty;
      done();
    });

    logger.log(object, 'info', 'an informative message');
  });

  it('should include a prefix when desired', function (done) {
    var logger = new Logger({
      prefix: ['foo'],
      transports: [
        new (winston.transports.Console)({
          'level': 'debug',
          'silent': true
        })
      ]
    }),
    object = {
      foo: 'bar'
    };

    logger.logger.on('logging', function (transport, level, msg, meta) {
      expect(level).to.equal('debug');
      expect(msg).to.equal('[bar] a debug message');
      expect(meta).to.be.empty;
      done();
    });

    logger.log(object, 'debug', 'a debug message');

  });
});
