var express = require('express');
var router = express.Router();

router.get('/userscount', function (req, res, next) {
    res.send({ count: [4500, 2000, 3500, 4200, 2600, 5000, 2500] });
});

module.exports = router;