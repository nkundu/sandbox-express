var express = require('express');
var router = express.Router();

/* GET kalman page. */

router.get('/', function(req, res) {
  res.render('kalman', { year: new Date().getFullYear(), ad: new Date().getMonth() });
});

module.exports = router;
