var express = require('express');
var router = express.Router();
var User = require('../models/user');
var request = require('request');

function check_validity(a)
{
	return a.codeforces.handle && a.hackerrank.handle && a.codechef.handle;
}

router.get('/getStandings',function(req,res){
	User.find({}, function(err, users) {
		var valid_users = users.filter(check_validity);
		valid_users.sort(function(a,b){
			if(parseFloat(a.codeforces.rating)*0.5 + (parseFloat(a.codechef.rating) + parseFloat(a.hackerrank.rating))*0.25 > parseFloat(b.codeforces.rating)*0.5 + (parseFloat(b.codechef.rating) + parseFloat(b.hackerrank.rating))*0.25)
				return -1;
			else if(parseFloat(a.codeforces.rating)*0.5 + (parseFloat(a.codechef.rating) + parseFloat(a.hackerrank.rating))*0.25 < parseFloat(b.codeforces.rating)*0.5 + (parseFloat(b.codechef.rating) + parseFloat(b.hackerrank.rating))*0.25)
				return 1;
		});

		res.send({'status' : true, 'users' : valid_users});
	});
});

router.get('/',isLoggedIn, function(req, res) {
	res.render('standings.ejs', {
        user : req.user // get the user out of session and pass to template
     });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

 
module.exports =router;
