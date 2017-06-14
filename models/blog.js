var mongoose = require('mongoose');

var SchemaTypes = mongoose.Schema.Types;

var schema = mongoose.Schema;


var blog = new schema({
	id : Number,
	title : String,
	description : String,
	author : String,
	comments : [{Name : String, comment : String}]
});


module.exports = mongoose.model('Blog', blog,'blogs');