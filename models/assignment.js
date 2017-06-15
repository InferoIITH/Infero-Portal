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
        'tags': [String],
        'link' : String,
        'solved': [{'id': Number , 'link':String }],
        'rejected': [Number],
     }],
   comments : [{'Name': String, 'comment': String}]
});



module.exports = mongoose.model('Ass', ass, 'assignments');
