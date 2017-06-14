var mongoose = require('mongoose');

var SchemaTypes = mongoose.Schema.Types;

var schema = mongoose.Schema;

var user = new schema({
    id: Number,
    Name: String,
    Rating: Number,
    email: String,
    a20j: {
        'handle': String,
        'contests': {
            'given': [String],
            'giving': [String]
        }
    },
    codechef: {
        'handle': String,
        'rating': String,
        'contests': {
            'given': [String],
            'giving': [String]
        },
        'problems': {
            'solved': [String],
            'todo': [String]
        }
    },
    codeforces: {
        'handle': String,
        'rating': String,
        'contests': {
            'given': [String],
            'giving': [String]
        },
        'problems': {
            'solved': [String],
            'todo': [String]
        }
    },
    github: {
        'handle': String
    },
    hackerearth: {
        'handle': String,
        'rating': String,
        'contests': {
            'given': [String],
            'giving': [String]
        },
        'problems': {
            'solved': [String],
            'todo': [String]
        }
    },
    hackerrank: {
        'handle': String,
        'rating': String,
        'contests': {
            'given': [String],
            'giving': [String]
        },
        'problems': {
            'solved': [String],
            'todo': [String]
        }
    },
    spoj: {
        'handle': String,
        'points': String,
        'problems': {
            'solved': [String],
            'todo': [String]
        }
    }
});

module.exports = mongoose.model('User', user,'users');
