/**
 * Created by sid on 25/5/17.
 */
var mongoose = require('mongoose');

var schema = mongoose.Schema;


var ass = new schema({
    id : Number,
    problems: [{
        'qid' : Number,
        'pid' : String,
        'desc': String,
        'link' : String,
        'solved': [String],
        'attempted': [String]
    }]
});



module.exports = mongoose.model('Ass', ass, 'assignments');