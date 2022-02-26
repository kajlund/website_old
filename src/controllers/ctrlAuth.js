// const log = require('../utils/log')
const SvcAuth = require('../services/svcAuth');
const SvcMail = require('../services/svcMailer');
const SvcUsr = require('../services/svcUser');

class AuthController {
  static isAuth(req, res, next) {
    if (!req.session.isLoggedIn) {
      return res.redirect('/login');
    }
    next();
  }

  static async logon(req, res, next) {
    const data = {
      email: req.body.email ? req.body.email : '',
      password: req.body.password ? req.body.password : '',
    };

    const { errors, user } = await SvcAuth.validateLogon(data);
    if (errors) {
      req.flash('errors', errors.split(','));
      return res.redirect('/logon');
    }

    // Authentication OK
    req.session.isAuthenticated = true;
    delete user.password;
    req.session.user = user;
    // Ensure session is persisted before redirect
    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }

  static logoff(req, res, next) {
    req.session.destroy(() => {
      req.isAuthenticated = false;
      req.user = undefined;
      res.redirect('/');
    });
  }

  static renderLogon(req, res, next) {
    res.render('logon', {
      title: 'Logon',
      errors: req.flash('errors'),
    });
  }

  static renderSignup(req, res, next) {
    res.render('signup', {
      title: 'Signup',
      errors: req.flash('errors'),
    });
  }

  static async signup(req, res, next) {
    const data = {
      handle: req.body.handle ? req.body.handle.trim() : '',
      email: req.body.email ? req.body.email.trim() : '',
      password: req.body.password ? req.body.password.trim() : '',
      confirmPassword: req.body.confirmPassword ? req.body.confirmPassword.trim() : '',
    };

    const errors = await SvcAuth.validateSignup(data);
    if (errors) {
      req.flash('errors', errors.split(','));
      return res.redirect('/signup');
    }

    // Signup with valid data, create new user
    await SvcUsr.createUser(data);
    await SvcMail.sendAccountRegistrationMail(data.email);
    res.redirect('/logon');
  }
}

module.exports = AuthController;
