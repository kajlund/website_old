class HomeController {
  static renderHomePage(req, res, next) {
    res.render('home', { title: 'Home', path: 'home' });
  }
}

module.exports = HomeController;
