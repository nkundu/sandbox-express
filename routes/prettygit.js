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

router.get('/raw/:owner/:repo/master/:path(*)', function(req, res) {
    request('https://cdn.rawgit.com/' 
                + req.params.owner + '/' 
                + req.params.repo + '/master/' 
                + req.params.path, 
        function (error, response, html) {
            if (!error && response.statusCode == 200) {
                res.send(html);
            } else {
                res.status(500).send('Error!');
            }
    });
});


module.exports = router;