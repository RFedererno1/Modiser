$(document).on('click', '.btn-danger', function() {
    $('#delete-form').data('id', $(this).data('delete-link'));

});

$('.btnRemove').on('click', function(e) {
    e.preventDefault();

    var id = $('#delete-form').data('id');
    var db_id = $('#delete-form').data('id').split("_")[1];
    $('#' + id).remove();
    $('.bs-example-modal-sm').modal('hide');
    fetch('/remove-partner/id=' + db_id, { method: 'POST' });
});

// $(document).on('click', '.btn-success', function() {
//     var select_id = "#" + $(this).data("edit");
//     var partner_type = $(this).data("edit").split("_")[0];

//     // To uppercase first letter in partner type
//     partner_type = partner_type.charAt(0).toUpperCase() + partner_type.slice(1);

//     // data-id for getting partner id. Used in fetching to server to handle request
//     $("#edit-form").data("id", $(this).data("edit"));

//     // Fetching partner's name into edit form.
//     $("#edit-form").find("#name")[0].value = $(select_id).find(".card-header")[0].innerText;

//     // Span image to the edit form. $(select_id).find(".card-img-top")[0].attributes.src.value
//     var current_image = '<img id="img_current_image" class="img-fluid img-thumbnail" src=' + $(select_id).find(".card-img-top")[0].attributes.src.value + ' alt="Card image cap">';
//     $("#current_image").append(current_image);

//     // Choosing the type of partner and set 'selected' to the corresponding option
//     for (var i = 0; i < $("#edit-form").find("#type").children().length; i++) {
//         if ($("#edit-form").find("#type").children()[i].innerText == partner_type) {
//             $("#edit-form").find("#type").children()[i].selected = true;
//         }
//     }

//     // Fetch function goes here

// });


// scrollspy section
(function($) {
    //variable that will hold the href attr of the links in the menu
    var sections = [];
    //variable that stores the id of the section
    var id = false;
    //variable for the selection of the anchors in the navbar
    var $navbara = $('#scrollspy a');

    $navbara.click(function(e) {
        //prevent the page from refreshing
        e.preventDefault();
        history.replaceState(null, null, ' ');
        //set the top offset animation and speed
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 140
        }, 1000);
        hash($(this).attr('href'));
    });



    //select all the anchors in the navbar one after another
    $navbara.each(function() {
        // and adds them in the sections variable
        sections.push($($(this).attr('href')));

    })
    $(window).scroll(function(e) {
        // scrollTop retains the value of the scroll top with the reference at the middle of the page
        var scrollTop = $(this).scrollTop() + ($(window).height() / 2);
        //cycle through the values in sections array
        for (var i in sections) {
            var section = sections[i];
            //if scrollTop variable is bigger than the top offset of a section in the sections array then 
            if (scrollTop > section.offset().top) {
                var scrolled_id = section.attr('id');
            }
        }
        if (scrolled_id !== id) {
            id = scrolled_id;
            $($navbara).removeClass('current');
            $('#scrollspy a[href="#' + id + '"]').addClass('current');
        }
    })
})(jQuery);