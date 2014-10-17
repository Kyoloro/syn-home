$(function () {
    $('.carousel').carousel({
        interval: 4000,
        pause: false
    });
    var $body = $('body')
    $('.smooth').click(function (e) {
        e.preventDefault();
        var target = $($(this).attr('href')).position().top - 40 + 'px';
        $body.scrollTo(target, 800, {
            easing: 'easeOutQuad'
        });
    });
    if (!('hasOwnProperty' in document) || !document.hasOwnProperty("ontouchstart")) {
        skrollr.init({
            smoothScrolling: false,
            forceHeight: false
        });
    }
});
