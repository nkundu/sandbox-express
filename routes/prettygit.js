var express = require('express');
var request = require('request');

var router = express.Router();

/* GET pretty content from git. */

// path(*) takes everything, including slashes, in this param
router.get('/:owner/:repo/master/:path(*).html', function(req, res) {
    res.cont
    res.render('prettygit', {
        title: req.params.repo + ': ' + req.params.path,
        code: req.params.owner + '/' 
            + req.params.repo + '/master/' 
            + req.params.path,
        year: new Date().getFullYear(),
        ad: new Date().getMonth()
            });
});

module.exports = router;