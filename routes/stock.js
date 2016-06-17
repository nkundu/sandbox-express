var request = require('request');
var cheerio = require('cheerio');

var parseStockData = function (html) {
    $ = cheerio.load(html);

    var result = {};

    result.ticker = $('title').text();
    result.props = [];
    $('.snapshot-td2-cp').each(function (idx) {
        result.props.push({ 
            name: $(this).text(), 
            desc: /\sbody=\[([^\]]+)\]/g.exec($(this).attr('title'))[1],
            val: $(this).next('td').text() });
    });

    result.ratings = $('.fullview-ratings-outer').html();

    return result;
};

var getStockData = function (ticker, res, raw) {
    console.log(ticker);
    request('http://finviz.com/quote.ashx?t=' + ticker, 
        function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var x = parseStockData(html);
                if (raw)
                    res.send(x);
                else
                    res.render('stock', x);
            } else{
                res.send(error);
            }
    });
};

var express = require('express');
var router = express.Router();

router.get('/:ticker', function(req, res) {
    getStockData(req.params.ticker, res, false);
});

router.get('/json/:ticker', function(req, res) {
    getStockData(req.params.ticker, res, true);
});

module.exports = router;
