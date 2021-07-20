var express = require('express');
var router = express.Router();

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

router.get('/:file', function (req, res, next) {
    res.sendFile(req.params.file, { root: './uploads' })
});

router.post('/', upload.single('file'), function (req, res, next) {
    console.log(req.file)
    if (req.file) {
        res.send({ status: "success", file: req.file.filename, errorMessage: "" })
    }
    else {
        res.send({ status: "error", file: "", errorMessage: "Upload has not been successfull" })
    }
});


module.exports = router;