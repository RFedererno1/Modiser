$(document).ready(function() {
    $('#search-button, #reset-search-button').on('click', function(event) {
        event.preventDefault();
        $('#search-input').val('');
        $('#search-bar').toggleClass('open');
        $('#search-button').closest('li').toggleClass('active');

        if ($('#search-bar').hasClass('open')) {
            setTimeout(function() {
                $('#search-input').focus();
            }, 100);
        }
    });
    $(document).on('keyup', function(event) {
        if (event.which == 27 && $('#search-bar').hasClass('open')) {
            $('#search-button').trigger('click');
        }
    });
    $(function() {
        $('.jumbotron').click(function(event) {
            $('.navbar-collapse').collapse('hide');
        });
    });

    var last_pos = 0;
    $(window).scroll(function() {
        if ($(window).scrollTop() > last_pos) {
            $('.navbar').css('top', '-200px');
        } else {
            $('.navbar').css('top', '0');
        }
        last_pos = $(window).scrollTop();
    })

});