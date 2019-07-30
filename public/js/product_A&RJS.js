$(document).on('click', '.btn-danger', function() {
    $('#deleteCategory').data('id', $(this).data('delete-link'));
});

$('.btnRemove').on('click', function(e) {
    e.preventDefault();

    var id = $('#deleteCategory').data('id');
    var db_id = $('#deleteCategory').data('id').split("_")[1];;
    $('#' + id).remove();
    $('#Delete').modal('hide');
    fetch('/remove-category/id=' + db_id, { method: 'POST' });
});

$(document).on('click', '.btn-danger', function() {
    $('#deleteCategory').data('id', $(this).data('delete-link'));
});

$(document).on('click', '.btn-danger', function() {
    $('#deleteCategory').data('id', $(this).data('delete-link'));
});

// $("#addProductBtn").click(function(e) {
//     // e.preventDefault();
//     console.log($(this).data("category-id"));
//     $("#tempCategoryId").remove();
//     var category_id = "<div id='tempCategoryId' style='display: hidden;'> <input type='text' name='CategoryIdProduct' value=" + $(this).data("category-id") + "> </div>";
//     $("#addProductForm").append(category_id);
// });

$(document).on('click', '#addProductBtn', function() {
    console.log($(this).data("category-id"));
    $("#tempCategoryId").remove();
    var category_id = "<div id='tempCategoryId' style='display: hidden;'> <input type='text' name='CategoryIdProduct' value=" + $(this).data("category-id") + "> </div>";
    $("#addProductForm").append(category_id);
});
$(document).on('click', '#submitAddProductBtn', function() {
    console.log($(this).data("category-id"));
    $("#tempCategoryId").remove();
    var category_id = "<div id='tempCategoryId' style='display: hidden;'> <input type='text' name='CategoryIdProduct' value=" + $(this).data("category-id") + "> </div>";
    $("#addProductForm").append(category_id);
});