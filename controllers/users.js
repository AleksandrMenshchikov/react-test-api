const bcrypt = require('bcrypt');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');

module.exports.createUser = (req, res, next) => {
  const { name, email, password, dateOfBirth, gender, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
        dateOfBirth,
        male: gender === 'male' ? true : false,
        female: gender === 'female' ? true : false,
        avatar,
      })
        .then((user) => {
          res.status(201).json({
            _id: user._id,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
            avatar: user.avatar,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new ConflictError('Пользователь с таким email уже существует')
            );
          } else {
            next(err);
          }
        });
    })
    .catch((err) => next(err));
};
