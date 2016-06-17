var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:ticker', function(req, res) {
  res.send([{ ticker: req.params.ticker }]);
});

module.exports = router;
