const validator = require('validator');

const SvcUsr = require('./svcUser');

class AuthService {
  static async validateLogon(data) {
    const errors = [];

    if (!data.email || !data.password) {
      errors.push('Email and password must be provided');
    }

    const user = await SvcUsr.getUserByEmail(data.email, true);
    if (!user) {
      errors.push('Email not registered');
    }

    const ok = await user.comparePassword(data.password);
    if (!ok) {
      errors.push('User and password do not match');
    }

    return { errors: errors.join(','), user };
  }

  static async validateSignup(data) {
    const errors = [];

    if (!data.handle) {
      errors.push('A handle must be provided');
    }

    if (!data.email) {
      errors.push('An email address must be provided');
    }

    if (!validator.isEmail(data.email)) {
      errors.push('A valid email address must be provided');
    }

    if (!data.password) {
      errors.push('A password must be provided');
    }

    if (!validator.isLength(data.password, { min: 8 })) {
      errors.push('Password must be min 8 chars long');
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords must match');
    }

    const user = await SvcUsr.getUserByEmail(data.email);
    if (user) {
      errors.push('Email provided is already registered');
    }

    return errors.join(',');
  }
}

module.exports = AuthService;
