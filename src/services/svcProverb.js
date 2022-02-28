// const validator = require('validator');

const Proverb = require('../models/Proverb');
const { proverbCategories } = require('../utils/types');

class ProverbService {
  static async validateProverb(data) {
    const errors = [];

    if (!data.title) {
      errors.push('A proverb needs a title');
    }

    if (!data.content) {
      errors.push('A proverb needs content');
    }

    if (!data.author) {
      errors.push('A proverb needs an author');
    }

    if (proverbCategories.indexOf(data.category) === -1) {
      errors.push(`A proverb category needs to be one of ${proverbCategories.join(' ')}`);
    }

    return errors.join(',');
  }

  static async getAll() {
    return Proverb.find({}).sort({ createdAt: -1 });
  }

  static async getById(aId) {
    return Proverb.findById(aId).exec();
  }

  static async createProverb(data) {
    const proverb = new Proverb(data);
    return proverb.save();
  }

  static async updateProverb(id, data) {
    const proverb = await Proverb.findByIdAndUpdate(id, data, { new: true });
    return proverb;
  }

  static async destroyProverb(id) {
    const removed = await Proverb.findByIdAndRemove(id, {});
    return removed;
  }
}

module.exports = ProverbService;
