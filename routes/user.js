var express = require('express');
var router = express.Router();

var userController = require('../controllers/user');

/* GET users listing. */
router.get('/', userController.index);

/* POST user signup. */
router.post('/signup', userController.signup);

module.exports = router;
