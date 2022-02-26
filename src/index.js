#!/usr/bin/env node

/**
 * Application entry point.
 * Loads environment variables (.env in root folder), config and log.
 * Sets up DB connection(s), gets app instance and starts http server.
 */

const http = require('http');
const util = require('util');
const mongoose = require('mongoose');

const config = require('./config');
const log = require('./utils/log');
const App = require('./app');

async function connectToDB() {
  await mongoose.connect(config.db.uri, { useNewUrlParser: true });
  try {
    log.info('Successfully connected to MongoDB');
  } catch (err) {
    log.error(err);
    throw err;
  }
}

async function startServer() {
  /* Connect to Database(s) */
  await connectToDB();

  /* Get configured app */
  const app = App(config);
  app.set('port', config.port);

  /* Create HTTP Server */
  const server = http.createServer(app);

  server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    log.info(`Server listening on ${bind}`);
  });

  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        log.error(`${config.bind} requires elevated privileges`);
        throw error;
      case 'EADDRINUSE':
        log.error(`${config.bind} is already in use`);
        throw error;
      default:
        throw error;
    }
  });

  /* Start server */
  server.listen(config.port);
}

process.on('uncaughtException', (err) => {
  log.error(`UNCAUGHT EXCEPTION - ${err.stack || err}`);
  throw err;
});

process.on('unhandledRejection', (reason, p) => {
  log.error(`UNHANDLED PROMISE REJECTION: ${util.inspect(p)} reason: ${reason}`);
});

log.info('Starting server');
startServer()
  .then(() => log.info('Server started OK'))
  .catch((err) => {
    log.error(err);
    throw err;
  });
