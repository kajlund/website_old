/**
 * App object configures express server middleware and routes
 */
const path = require('path');

const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const express = require('express');
const favicon = require('serve-favicon');
const createError = require('http-errors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
require('express-async-errors'); // async wrapper
const flash = require('connect-flash');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const routes = require('./routes');

// Configure server
module.exports = (cnf) => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1); // For rate limiter if deployed behind reverse proxy

  // configure session store
  const store = new MongoDBStore({
    uri: cnf.db.uri,
    collection: 'sessions',
  });

  // Configure middleware
  app.use(express.json({ limit: '1000kb' })); // Limit input data size for security reasons
  app.use(express.urlencoded({ extended: false })); // Support also form input
  app.use(cookieParser());
  app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
  app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  }));
  // After session middleware, setup csrf protection
  const csrfProtection = csrf();
  app.use(csrfProtection);

  app.use(flash()); // Flash messages

  // Configure Nunjucks view engine
  const envNunjucks = nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
    watch: true,
  });
  envNunjucks.addFilter('date', dateFilter);
  app.set('view engine', 'njk');

  // Setup global template vars
  app.locals.sitename = 'kajlund.com';

  if (!cnf.isProd) {
    app.disable('view cache');
  }

  // Set view template globals for auth and csrf
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
  });

  // Serve static assets
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Add route handlers
  app.use(routes);

  /**
   * Generic 404 Not Found handler
   */
  app.use((req, res, next) => next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)));

  /**
   * Generic error handler middleware
   */
  app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }
    res.locals.message = error.message;
    res.status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.locals.status = res.status;
    res.render('error', { layout: false, error });
  });

  return app;
};
