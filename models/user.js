const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'поле "Имя" должно быть не менее 2 символов'],
      maxlength: [100, 'поле "Имя" должно быть не более 100 символов'],
      required: [true, 'поле "Имя" необходимо заполнить'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'поле "Email" необходимо заполнить'],
    },
    password: {
      type: String,
      minlength: [6, 'поле "Пароль" должно быть не менее 6 символов'],
      maxlength: [100, 'поле "Пароль" должно быть не более 100 символов'],
      required: [true, 'поле "Пароль" необходимо заполнить'],
      select: false,
    },
    dateOfBirth: {
      type: Number,
      required: [true, 'поле "День рождения" необходимо заполнить'],
    },
    male: {
      type: Boolean,
      required: [true, 'поле "Пол" необходимо заполнить'],
    },
    female: {
      type: Boolean,
      required: [true, 'поле "Пол" необходимо заполнить'],
    },
    avatar: {
      type: String,
      required: [true, 'поле "Аватар" необходимо заполнить'],
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('user', userSchema);
