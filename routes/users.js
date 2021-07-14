var express = require('express');
var router = express.Router();
const { getUsers, register } = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.jwt');

/* GET users listing. */
router.get('/', [verifyToken, isAdmin], getUsers);

router.post('/', register);

module.exports = router;
