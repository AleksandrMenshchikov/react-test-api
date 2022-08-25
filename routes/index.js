const router = require('express').Router();
const { createUser } = require('../controllers/users');

router.use('/signup', createUser);

module.exports = router;
