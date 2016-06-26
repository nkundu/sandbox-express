String.prototype.parseNumberAccounting = function () {
    var nbr = this.replace('%', '').replace(/,/g, '');
    if (nbr.endsWith('K'))
        return nbr.replace('K', '') * 1e3;
    else if (nbr.endsWith('M'))
        return nbr.replace('M', '') * 1e6; 
    else if (nbr.endsWith('B'))
        return nbr.replace('B', '') * 1e9;
    else
        return nbr;
};


$(document).ready(function () {
    $('a.chart').click(function () {
        $('#chartImg').attr('src', $(this).attr('data-charturl'));
    });

    $('select.addTicker').select2({
        ajax: {
            url: '/stock/suggest',
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                return {
                    results: $.map(data, function (val, i) {
                        return {
                            id: val.ticker, 
                            text: val.ticker + ' - ' + val.company
                        };
                    })
                };
            }
        }
    });

    $('#addStock').click(function () {
        $.ajax("/stock/add/" + $('select.addTicker').select2('data')[0].id).done(function () {
            window.location = "/stock";
        });
    });

    $('a.deleteStock').click(function () {
        $.ajax("/stock/delete/" + $(this).attr('data-ticker')).done(function () {
            window.location = "/stock";
        });
    });

    // http://www.flatuicolorpicker.com/
    var colors_back = ['#F1A9A0', '#C5EFF7', '#C8F7C5'];
    var colors_bar = ['#E26A6A', '#89C4F4', '#87D37C'];

    $('tr').each(function () {
        var _array = [];

        $(this).find('td.val')
            .filter(function () {
                return $.isNumeric($(this).text().parseNumberAccounting());
            }).each (function () {
                _array.push({
                    dom: this,
                    val: $(this).text().parseNumberAccounting(),
                    isPercent: $(this).text().indexOf('%') != -1
                });
            });
        
        var min = Math.min.apply(Math, _array.map(function(o){return o.val;}));
        var max = Math.max.apply(Math, _array.map(function(o){return o.val;}));

        $.each(_array, function (idx, itm) {
            var bg_idx = 1;
            if (itm.val == min)
                bg_idx = 0;
            else if (itm.val == max)
                bg_idx = 2;
            else
                bg_idx = 1;

            if (itm.isPercent) {
                $(itm.dom).css('background', 
                    'linear-gradient(to right, ' + colors_bar[bg_idx] + ' ' + itm.val + '%,' +
                    colors_back[bg_idx] + ' ' + (itm.val + 1) + '%)');
            } else {
                var perc = 100.0*(itm.val - min)/(max-min);
                $(itm.dom).css('background', 
                    'linear-gradient(to right, ' + colors_bar[bg_idx] + ' ' + perc + '%,' +
                    colors_back[bg_idx] + ' ' + (perc + 1) + '%)');
            }
            
        });

    });

});

