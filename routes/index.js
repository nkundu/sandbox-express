var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Nicholas Kundu', year: new Date().getFullYear(), ad: new Date().getMonth() });
});

module.exports = router;
