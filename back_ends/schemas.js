var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost:27017/database", { useNewUrlParser: true });

autoIncrement.initialize(connection);

var partner_schema = new mongoose.Schema({
    type: String,
    name: String,
    image_path: String
});

partner_schema.plugin(autoIncrement.plugin, 'partner');

module.exports.partner_schema = partner_schema;