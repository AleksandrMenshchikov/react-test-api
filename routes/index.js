const router = require('express').Router();
const { createUser } = require('../controllers/users');
const { signin } = require('../controllers/users');
const { patchUser } = require('../controllers/users');

router.use('/signup', createUser);
router.use('/signin', signin);
router.use('/users/me', patchUser);

module.exports = router;
