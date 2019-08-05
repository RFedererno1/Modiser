var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost:27017/database", { useNewUrlParser: true });

autoIncrement.initialize(connection);

var partner_schema = new mongoose.Schema({
    type: String,
    name: String,
    image_path: String
});

var CategorySchema = new mongoose.Schema({
    NameCategory: String,
    imagePathCategory: String,
    ProductCountCategory: [Number]
});

var ProductSchema = new mongoose.Schema({
    NameProduct: String,
    OriginProduct: String,
    BarcodeProduct: String,
    DescriptionProduct: String,
    ImagePathProduct: String,
    CategoryIdProduct: Number
})

partner_schema.plugin(autoIncrement.plugin, 'partner');

CategorySchema.plugin(autoIncrement.plugin, 'category');

ProductSchema.plugin(autoIncrement.plugin, 'product');

module.exports.partner_schema = partner_schema;

module.exports.CategorySchema = CategorySchema;

module.exports.ProductSchema = ProductSchema;