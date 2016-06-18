$(document).ready(function () {
    $('a.chart').click(function () {
        $('#chartImg').attr('src', $(this).attr('data-charturl'));
    });
});
