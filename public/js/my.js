$(document).ready(function () {
    $('a.chart').click(function () {
        $('#chartImg').attr('src', $(this).attr('data-charturl'));
    });

    var colors = ['#F1A9A0', '#FFFFFF', '#C8F7C5'];

    $('tr').each(function () {
        var _array = [];

        $(this).find('td.val')
            .filter(function () {
                return $.isNumeric($(this).text().replace('%', ''));
            }).each (function () {
                _array.push({
                    dom: this,
                    val: $(this).text().replace('%', '')
                });
            });
        
        var min = Math.max.apply(Math, _array.map(function(o){return o.val;}));
        var max = Math.min.apply(Math, _array.map(function(o){return o.val;}));

        $.each(_array, function (idx, itm) {
            if (itm.val == min)
                $(itm.dom).css('background-color', colors[2]);
            else if (itm.val == max)
                $(itm.dom).css('background-color', colors[0]);
            else
                $(itm.dom).css('background-color', colors[1]);
        });

    });

});
