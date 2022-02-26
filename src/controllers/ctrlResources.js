class ResourcesController {
  static renderResources(req, res, next) {
    res.render('resources', { title: 'Resources', path: 'resources' });
  }
}

module.exports = ResourcesController;
