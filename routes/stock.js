var request = require('request');
var cheerio = require('cheerio');

var parseStockData = function (html, result) {
    $ = cheerio.load(html);

    var ticker = $('#ticker').text();

    result.ticker.push({
        name: ticker,
        chart: 'http://finviz.com/' + $('#chart0').attr('src')
    });

    $('.snapshot-td2-cp').each(function (idx) {
        var name = $(this).text();
        var desc = /\sbody=\[([^\]]+)\]/g.exec($(this).attr('title'))[1];
        // if the prop already exists for another stock, update the array
        // otherwise, add it
        var prop = result.props.find(function (item) {
            return item.name == name && item.desc == desc;
        });

        if (prop == undefined) {
            result.props.push({ 
                name: name, 
                desc: desc,
                val: [ $(this).next('td').text() ] });
        } else {
            prop.val.push($(this).next('td').text());
        }
    });

    result.ratings.push({
        ticker: ticker,
        content: $('.fullview-ratings-outer').html()
    });
};

var getStockData = function (tickers, res, raw) {
    // initialize.  each ticker will be added in sequence
    var result = {};
    result.ticker = [];
    result.props = [];
    result.ratings = [];

    // tail recursion!
    (function processOneTicker() {
        // take the first element and trim it from the array
        var ticker = tickers.splice(0, 1)[0];
        request('http://finviz.com/quote.ashx?t=' + ticker, 
            function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    // parse the element
                    parseStockData(html, result);
                }

                if (tickers.length == 0) {
                    // if there are no more elements, return
                    if (raw)
                        res.send(result);
                    else
                        res.render('stock', result);
                } else {
                    // process the next element
                    processOneTicker();
                }
        });
    })();
};

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) { 
    getStockData(req.session.tickers.split(','), res, false);
});

router.get('/add/:ticker', function(req, res) {
    req.session.tickers = req.session.tickers + ',' + req.params.ticker; 
    res.sendStatus(200);
});

router.get('/suggest', function(req, res) {
    request('http://finviz.com/api/suggestions.ashx?input=' + req.query.term, 
        function (error, response, html) {
            res.send(html);
    });
});

router.get('/delete/:ticker', function(req, res) {
    var existing = req.session.tickers.toLowerCase().split(',');
    var idx = existing.indexOf(req.params.ticker.toLowerCase());
    if (idx != -1)
    {
        existing.splice(idx, 1);
        req.session.tickers = existing.join(',');
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
});

router.get('/:ticker', function(req, res) {
    req.session.tickers = req.params.ticker; 
    getStockData(req.session.tickers.split(','), res, false);
});

router.get('/json/:ticker', function(req, res) {
    getStockData(req.params.ticker, res, true);
});

module.exports = router;
