$('#carousel-example').on('slide.bs.carousel', function(e) {
    /*
        CC 2.0 License Iatek LLC 2018 - Attribution required
    */
    var $e = $(e.relatedTarget);
    var idx = $e.index();
    var itemsPerSlide = 5;
    var totalItems = $('.carousel-item-1').length;

    if (idx >= totalItems - (itemsPerSlide - 1)) {
        var it = itemsPerSlide - (totalItems - idx);
        for (var i = 0; i < it; i++) {
            // append slides to end
            if (e.direction == "left") {
                $('.carousel-item-1').eq(i).appendTo('.carousel-inner-1');
            } else {
                $('.carousel-item-1').eq(0).appendTo('.carousel-inner-1');
            }
        }
    }
});