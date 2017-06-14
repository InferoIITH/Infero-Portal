var mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;
var schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

var announcement = new schema({
	id : Number,
	description : String,
	category : String
}).plugin(timestamps);


module.exports = mongoose.model('Announcement', announcement,'announcements');