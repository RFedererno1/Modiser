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

var news_schema = new mongoose.Schema({
    title: String,
    upload_date: String,
    thumbnail_path: String,
    summary: String,
    order: String,
    news_text: [String],
    news_image_path: [String],
    query: String
})

var account_schema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
})


partner_schema.plugin(autoIncrement.plugin, 'partner');

CategorySchema.plugin(autoIncrement.plugin, 'category');

ProductSchema.plugin(autoIncrement.plugin, 'product');

news_schema.plugin(autoIncrement.plugin, 'news');

module.exports.partner_schema = partner_schema;

module.exports.CategorySchema = CategorySchema;

module.exports.ProductSchema = ProductSchema;

module.exports.news_schema = news_schema;

module.exports.account_schema = account_schema;