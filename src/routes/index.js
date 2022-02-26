const express = require('express');

const CtrlAbout = require('../controllers/ctrlAbout');
const CtrlAuth = require('../controllers/ctrlAuth');
const CtrlHome = require('../controllers/ctrlHome');
const CtrlRes = require('../controllers/ctrlResources');
// const CtrlUsr = require('../controllers/ctrlUser')

const router = express.Router();

router.route('/')
  .get(CtrlHome.renderHomePage);
router.route('/logon')
  .get(CtrlAuth.renderLogon)
  .post(CtrlAuth.logon);
router.route('/logoff')
  .get(CtrlAuth.logoff);
router.route('/signup')
  .get(CtrlAuth.renderSignup)
  .post(CtrlAuth.signup);
router.route('/about')
  .get(CtrlAbout.renderAboutPage);
router.route('/resources')
  .get(CtrlRes.renderResources);

module.exports = router;
