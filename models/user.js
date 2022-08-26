const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 100,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 100,
      required: true,
      select: false,
    },
    dateOfBirth: {
      type: Number,
      required: true,
    },
    male: {
      type: Boolean,
      required: true,
    },
    female: {
      type: Boolean,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('user', userSchema);
