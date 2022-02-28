const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
    handle: {
      type: String,
      required: [true, 'A user must have a handle'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your e-mail address'],
      lowercase: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid e-mail address',
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password needs to be at least 8 characters'],
    },
    verified: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    avatar: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  // Only run if pwd actually was modified
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre('save', function () {
  if (!this.isModified('email')) return;

  // Only run if email actually was modified
  this.avatar = gravatar.url(this.email, { s: '200', r: 'pg', d: 'mm' });
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordTokenExpirationDate = Date.now() + 10 * 60 * 1000; // 10 mins

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
