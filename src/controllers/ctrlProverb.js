const SvcPrvb = require('../services/svcProverb');

class ProverbsController {
  static async destroy(req, res, next) {
    await SvcPrvb.destroyProverb(req.params.id);
    req.flash('toasts', 'Deleted proverb');
    res.redirect('/proverbs');
  }

  static async renderDetail(req, res, next) {
    const toasts = req.flash('toasts');
    const proverb = await SvcPrvb.getById(req.params.id);
    res.render('proverbs/view', {
      title: 'View Proverb',
      path: 'proverbs',
      proverb,
      toasts,
    });
  }

  static async renderEditForm(req, res, next) {
    const id = req.params.id === '0' ? '' : req.params.id;
    const errors = req.flash('errors');
    let data = req.flash('data')[0];
    if (!data && id) {
      data = await SvcPrvb.getById(id);
    }

    res.render('proverbs/edit', {
      title: id ? 'Edit Proverb' : 'Add Proverb',
      path: 'proverbs',
      data,
      errors,
    });
  }

  static async renderList(req, res, next) {
    const toasts = req.flash('toasts');
    const proverbs = await SvcPrvb.getAll();
    res.render('proverbs/list', {
      title: 'Proverbs',
      path: 'proverbs',
      proverbs,
      toasts,
    });
  }

  static async save(req, res, next) {
    const id = req.body.dataid;
    const data = {
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      author: req.body.author.trim(),
      authorDesc: req.body.authorDesc.trim(),
      category: req.body.category.trim(),
    };

    const errors = await SvcPrvb.validateProverb(req.body);
    if (errors.length) {
      req.flash('errors', errors.split(','));
      req.flash('data', data);
      if (id) {
        return res.redirect(`/proverbs/${id}/edit`);
      }
      return res.redirect('/proverbs/0/edit');
    }

    if (!id) {
      const added = await SvcPrvb.createProverb(data);
      req.flash('toasts', ['New proverb was added OK']);
      res.redirect(`/proverbs/${added.id}/view`);
    } else {
      await SvcPrvb.updateProverb(id, data);
      req.flash('toasts', 'Updated proverb OK');
      res.redirect(`/proverbs/${id}/view`);
    }
  }
}

module.exports = ProverbsController;
