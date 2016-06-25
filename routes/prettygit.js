var express = require('express');
var request = require('request');

var router = express.Router();

/* GET pretty content from git. */

// path(*) takes everything, including slashes, in this param
router.get('/:owner/:repo/master/:path(*)', function(req, res) {
    request('https://raw.githubusercontent.com/' 
                + req.params.owner + '/' 
                + req.params.repo + '/master/' 
                + req.params.path, 
        function (error, response, html) {
            if (!error && response.statusCode == 200) {
                // parse the element
                res.render('prettygit', {
                    title: req.params.repo + ': ' + req.params.path,
                    code: html
                });
            } else {
                res.status(500).send('Error!');
            }
    });
});

module.exports = router;