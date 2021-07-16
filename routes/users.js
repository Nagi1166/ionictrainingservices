var express = require('express');
var router = express.Router();
const { getUsers, register, updateUser } = require('../controllers/user.controller');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth.jwt');
const multer = require("multer");
var path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({ storage: storage });


/* GET users listing. */
router.get('/', [verifyToken, isAdmin], getUsers);

router.put('/:id', upload.single('profilePic'), updateUser)

router.post('/', register);

module.exports = router;
