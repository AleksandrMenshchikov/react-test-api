const bcrypt = require('bcrypt');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

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
            data: {
              _id: user._id,
              name: user.name,
              dateOfBirth: user.dateOfBirth,
              avatar: user.avatar,
            },
          });
        })
        .catch((err) => {
          err.code === 11000
            ? next(
                new ConflictError('Пользователь с таким email уже существует')
              )
            : next(err);
        });
    })
    .catch((err) => next(err));
};

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  let userMatched;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(
          new UnauthorizedError('Пользователь с таким email не зарегистрирован')
        );
      }
      userMatched = user;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        next(new BadRequestError('Неправильно указан пароль'));
      } else {
        res.status(200).json({
          data: {
            _id: userMatched._id,
            name: userMatched.name,
            dateOfBirth: userMatched.dateOfBirth,
            avatar: userMatched.avatar,
          },
        });
      }
    })
    .catch((err) => next(err));
};

module.exports.patchUser = (req, res, next) => {
  const { id, name, password: password, avatar } = req.body;
  if (password.length < 6) {
    User.findByIdAndUpdate(
      id,
      { name, avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    )
      .then((user) => {
        res.status(200).json({
          data: {
            _id: user._id,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
            avatar: user.avatar,
          },
        });
      })
      .catch((err) => next(err));
  } else {
    User.findById(id)
      .then((user) => {
        if (!user) {
          next(new NotFoundError('Пользователь с таким id не найден'));
        }
        bcrypt
          .hash(password, 10)
          .then((hash) => {
            User.findByIdAndUpdate(
              id,
              { name, avatar, password: hash },
              {
                new: true, // обработчик then получит на вход обновлённую запись
                runValidators: true, // данные будут валидированы перед изменением
              }
            )
              .then((user) => {
                res.status(200).json({
                  data: {
                    _id: user._id,
                    name: user.name,
                    dateOfBirth: user.dateOfBirth,
                    avatar: user.avatar,
                  },
                });
              })
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  }
};

module.exports.getUsers = (req, res, next) => {
  const { id } = req.body;

  User.find({ _id: { $ne: id } })
    .then((users) => {
      res.status(200).json({
        data: users.map((item) => ({
          _id: item._id,
          name: item.name,
          dateOfBirth: item.dateOfBirth,
          avatar: item.avatar,
        })),
      });
    })
    .catch((err) => next(err));
};
