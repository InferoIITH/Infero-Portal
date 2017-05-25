var express = require('express');
var router = express.Router();
var User = require('../models/user');
var schedule = require('node-schedule');
var request = require('request');

var ratingCronJob = schedule.scheduleJob('30 * * * *', function(){
	User.find({}, function(err, users) {
		var qstring = "http://codeforces.com/api/user.info?handles=";

		for(var i = 0; i < users.length; i++){
			qstring += users[i].codeforces.handle;
			if(i != users.length -1)
				qstring += ';';
			else {
				request.get(
				qstring,
				, function(err,res){
					if(err){
						console.log(err);
					}
					else {
						for(var j = 0; j < users.length;j++)
						{
							users[j].Rating = res.data[j].rating;
							if(j == users.length - 1)
							{
								res.send({status : true});
							}
						}
					}
				});		
			}
		}
		
	});
});

router.get('/getSortedData',function(req,res){
	User.find({}, function(err, users) {
		users.sort(function(a,b){
			if(a.Rating < b.Rating)
				return -1;
			else if(a.Rating > b.Rating)
				return 1;
		});

		res.send({'status' : true, 'Users' : users});
	}
});

router.get('/',isLoggedIn, function(req, res) {
	ratingCronJob();
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
