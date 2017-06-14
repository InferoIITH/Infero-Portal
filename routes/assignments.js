var express = require('express');
var router = express.Router();
var Assignment = require('../models/assignment');
var request = require('request');

function check_validity(a)
{
	return true;
}

router.get('/getAssignments',function(req,res){
	Assignment.find({}, function(err, assignments) {
		var valid_assignments = assignments.filter(check_validity);
		console.log(assignments);
		res.send({'status' : true, 'assignments' : assignments});
	});
});

router.get('/',isLoggedIn, function(req, res) {
	res.render('assignments.ejs', {
        user : req.user // get the user out of session and pass to template
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

 
module.exports =router;
