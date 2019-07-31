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

$(document).on('click', '#addProductBtn', function() {
    console.log($(this).data("category-id"));
    $("#tempCategoryId").remove();
    var category_id = "<div id='tempCategoryId' style='display: none;'> <input type='text' name='CategoryIdProduct' value=" + $(this).data("category-id") + "> </div>";
    $("#addProductForm").append(category_id);
});

$(document).on('click', '.category_mod', function() {
    // Set initial values for modify form
    $('#modifyCategoryForm').find("input")[0].value = $("#Category_" + $(this).data('id')).find('span')[0].innerText;

    // Set POST query
    $('#modifyCategoryForm').attr('action', '/adjust-product/modify-category-id=' + $(this).data('id'));
});

$(document).on('click', '.product_mod', function() {
    // Set initial values for modify form
    var data = $('#Prod_' + $(this).data('id'));
    ////////// Firstly, NameProduct
    $('#modifyProductForm').find('input')[0].value = data.find('#name')[0].innerText;
    ////////// Origin
    $('#modifyProductForm').find('input')[1].value = data.find('#origin')[0].innerText;
    ////////// Barcode
    $('#modifyProductForm').find('input')[2].value = data.find('#barcode')[0].innerText;
    ////////// Description
    $('#modifyProductForm').find('textarea')[0].value = data.find('#description')[0].innerText;
    ////////// Current image
    $('#modifyProductForm').find('img')[0].attributes.src.value = data.find('img')[0].attributes.src.value;

    // Set POST query
    $('#modifyProductForm').attr('action', '/adjust-product/modify-product-id=' + $(this).data('id'));

})