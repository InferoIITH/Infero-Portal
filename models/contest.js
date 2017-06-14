var mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;
var schema = mongoose.Schema;


var contest = new schema({
	id : Number,
	title : String,
	description : String,
	link : String,
	platform : String,
	starttime : Date,
	endtime : Date,
	duration : {
		days: Number,
		hours: Number,
		minutes: Number
	}
});


module.exports = mongoose.model('Contest', contest,'contests');