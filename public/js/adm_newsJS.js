$('.add_news_btn').click(function(e) {
    e.preventDefault();
    $("#order").data("order", '0');
    $("#order")[0].value = "";
    $('div').remove('.news_ele');

})

$('._add_text').click(function(e) {
    e.preventDefault();
    var order = $("#order").data("order");
    var text_pattern = `<div class="my-2 news_ele" data-order="t` + (Number(order) + 1) + `">
        <div class="row">
            <div class="col-md-10">
                <label for="news_text"> <strong> Text: </strong></label>                
            </div>
            <div class="col-md-2">
                <button class="btn btn-outline-danger remove ml-auto mr-2 my-2">Remove</button>
            </div>            
        </div>
        <textarea rows="5" class="form-control" id="news_text" name="news_text" required></textarea>
        <hr>
        </div>`;
    $('.add_news_wrapper').append(text_pattern);
    $("#order")[0].value = $('#order')[0].value + '_t' + (Number(order) + 1);
    $("#order").data("order", Number(order + 1));
})

$('._add_image').click(function(e) {
    e.preventDefault();
    var order = $("#order").data("order");
    var image_pattern = `<div class="row my-2 news_ele" data-order="i` + (Number(order) + 1) + `">
    <div class="col-md-10">
        <label for="image"><strong>Image:</strong></label>
        <input type="file" class="form-control-file" name="image" accept="image/*" required>
    </div>
    <div class="col-md-2">
        <button class="btn btn-outline-danger remove mt-3">Remove</button>
    </div> 
    <hr>
</div>`;
    $('.add_news_wrapper').append(image_pattern);
    $("#order")[0].value = $("#order")[0].value + '_i' + (Number(order) + 1);
    $("#order").data("order", Number(order + 1));
})

$('.add_news_wrapper').on('click', '.remove', function(e) {
    e.preventDefault();
    $("#order")[0].value = $("#order")[0].value.replace("_" + $(this).closest('div.news_ele').data("order"), "");
    $(this).closest('div.news_ele').remove();
})

$(document).on('click', '.btn-outline-danger', function(e) {
    e.preventDefault();
    var _id = $(this).closest('.card').attr('id');
    $('.btnRemove').data('id', _id);
})
$(document).on('click', '.btnRemove', function(e) {
    e.preventDefault();
    $('div#' + $(this).data('id')).fadeOut('normal', function() {
        $(this).remove();
    });
    fetch('/adm-news/remove-id=' + $(this).data('id'), { method: 'POST' });
    $('.bs-modal-sm').modal('hide');
})