class AboutController {
  static renderAboutPage(req, res, next) {
    res.render('about', { title: 'Logon', path: 'about' });
  }
}

module.exports = AboutController;
