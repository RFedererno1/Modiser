var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost:27017/database", { useNewUrlParser: true });

autoIncrement.initialize(connection);