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
    $('.form-group').append(text_pattern);
    $("#order")[0].value = $('#order')[0].value + '_t' + (Number(order) + 1);
    $("#order").data("order", Number(order + 1));
})

$('._add_image').click(function(e) {
    e.preventDefault();
    var order = $("#order").data("order");
    var image_pattern = `<div class="my-2 news_ele" data-order="i` + (Number(order) + 1) + `">
    <div class="row">
    <div class="col-md-10">
        <label for="image"><strong>Image:</strong></label>
        <input type="file" class="form-control-file" name="image" accept="image/*" required>
    </div>
    <div class="col-md-2">
        <button class="btn btn-outline-danger remove mt-3">Remove</button>
    </div> 
    </div>
    <hr>
</div>`;
    $('.form-group').append(image_pattern);
    $("#order")[0].value = $("#order")[0].value + '_i' + (Number(order) + 1);
    $("#order").data("order", Number(order + 1));
})

$('.form-group').on('click', '.remove', function(e) {
    e.preventDefault();
    $("#order")[0].value = $("#order")[0].value.replace("_" + $(this).closest('div.news_ele').data("order"), "");
    $(this).closest('div.news_ele').remove();
})

$(document).ready(function() {
    $('.btn-primary').click(function(e) {
        e.preventDefault();
        if ($('input.form-control-file')[0].value) {
            $('#flow')[0].value += "thumbnail";
        }
        for (i = 1; i < $('input.form-control-file').length; i++) {
            if ($('input.form-control-file')[i].value) {
                $('#flow')[0].value += "_" + $('input.form-control-file')[i].closest('div.news_ele').attributes[1].value;
            }
        }
    })

    $(document).on('click', '.btn-primary', function() {
        $("#form")[0].submit();
    })
})