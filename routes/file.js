var express = require('express');
var router = express.Router();

router.get('/:file', function (req, res, next) {
    res.sendFile(req.params.file,  { root: './uploads' })
});

module.exports = router;