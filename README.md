# Primus Logger

[![Build Status](https://travis-ci.org/seegno/primus-logger.png)](https://travis-ci.org/seegno/primus-logger)
[![NPM version](https://badge.fury.io/js/primus-logger.png)](http://badge.fury.io/js/primus)

`primus-logger` is a tiny module for the [Primus](https://github.com/primus/primus) real-time
framework that allows you to add context to logging messages.

Even if you're simply outputting data to the console, it is often useful to correlate certain
messages with application context (for instance, to log which user was responsible for triggering
a certain event). Such metadata usually resides on the [Spark](https://github.com/primus/primus#extending-the-spark--socket)
object, which this module can dynamically export by prefixing each message with certain object
properties.

The modules wraps the [winston](https://github.com/flatiron/winston) logging library, which theoretically
means that every option supported by winston is also supported by `primus-logger` (e.g. transport configuration).

### Installation

Installation occurs via `npm`:

```
npm install primus-logger --save
```

## Usage

Like any other `Primus` plugin, you only need to create a server instance and `use` the plugin. It exposes
a new option, `logging`, where all the configuration necessary for the plugin can be defined.

By default, the Console transport of winston is used, which does not use colors or timestamps, with an
`info` level output cut out. The following overrides theses defaults to adds colors and timestamps.

The `prefix` property uses an object path to get the data from the `Spark` instance. You can read more
about how to formulate your prefix by visiting the [object-path](https://github.com/mariocasciaro/object-path)
project page.

```js
'use strict';

var Primus = require('primus'),
  winston = require('winston');

var server = http.createServer()
  , primus = new Primus(server, {
      logging: {
            prefix: ['id', 'address.ip'],
            transports: [
              new (winston.transports.Console)({
                'timestamp': true,
                'colorize': true
              })
            ]
          }
  });

primus.use('logger', 'primus-logger');

primus.on('connection', function (spark) {
  spark.info('Connected');

  if ('127.0.0.1' !== spark.address.ip) {
    spark.log('error', 'Unexpected ip "' + spark.address.ip + '"');
  }
});
```

The output on the console will look like this:

```
2014-01-01T15:00:28.012Z - info: [1388618721010$0/127.0.0.1] Connected
2014-01-01T15:00:28.012Z - error: [1388618721010$0/127.0.0.1] Unexpected ip "127.0.0.2"
```

## Supported levels

The following logging levels are supported on a `Spark` instance:

* log (generic, requires a `level` argument)
* debug
* info
* warn
* error
* err (alias of `error`)

## Options

Currently, the only configurable option on the `primus-logger` plugin, besides dynamic
properties (configured as `prefix`), is the `separator` string (defaults to `/`).

## Compatibility

This plugin has been tested against Primus 1.5.x only.

### License

MIT
