$(document).ready(function(){
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
        $(document).click(function (event) {
          $('.navbar-collapse').collapse('hide');
        });
      });
});
