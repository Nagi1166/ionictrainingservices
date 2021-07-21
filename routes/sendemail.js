var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const multer = require("multer");
var path = require('path')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '*********',
        pass: '*********'
    }
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

var upload = multer({ storage: storage });


router.post('/', upload.single('attachment'), function (req, res, next) {
    console.log(req.file);
    console.log(req.body);
    if (!req.file) {
        res.send({ status: "error", file: "email has not been sent", errorMessage: "" })
    }

    const cc = req.body.cc.split(",");
    const bcc = req.body.bcc.split(",");

    var mailOptions = {
        from: 'nagendra1166@gmail.com',
        to: req.body.to,
        cc,
        bcc,
        subject: 'Sending mail from ionic react',
        text: req.body.text,
        attachments: [{ path: `./uploads/${req.file.filename}` }]
    };

    console.log(mailOptions);
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send({ status: "error", file: "", errorMessage: "email has not been sent" })
        } else {
            console.log('Email sent: ' + info.response);
            res.send({ status: "success", messgae: info.response, errorMessage: "" })
        }
    });

})

module.exports = router;