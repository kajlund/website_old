const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const SIGNUP = `<h1>Your Account was created</h1>
 <p>Login at <a href="https://www.kajlund.com/logon">kajlund.com</a></p>`;

const cnf = require('../config');
const log = require('../utils/log');

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: cnf.mail.apiKey,
  },
}));

class MailService {
  static async sendAccountRegistrationMail(email) {
    try {
      await transporter.sendMail({
        to: email,
        from: 'noreply@kajlund.com',
        subject: 'Signup verification',
        html: SIGNUP,
      });
    } catch (err) {
      log.error(err);
    }
  }
}

module.exports = MailService;
