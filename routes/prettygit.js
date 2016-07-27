var express = require('express');
var request = require('request');

var router = express.Router();

/* GET pretty content from git. */

// path(*) takes everything, including slashes, in this param
router.get('/:owner/:repo/master/:path(*)', function(req, res) {
    res.render('prettygit', {
        title: req.params.repo + ': ' + req.params.path,
        code: req.params.owner + '/' 
            + req.params.repo + '/master/' 
            + req.params.path,
        year: new Date().getFullYear()
            });
});

module.exports = router;