var express = require('express');
var router = express.Router();
var Contest = require('../models/contest');
var request = require('request');

function check_validity(a)
{
	return true;
}

router.get('/getContests',function(req,res){
	Contest.find({}, function(err, contests) {
		var valid_contests = contests.filter(check_validity);
		valid_contests.sort(function(a,b){
			if(a.starttime > b.starttime) return -1;
			else if(a.starttime < b.starttime) return 1;
			else return 0;
		});
		var check = new Date();
		var past_contests = [];
		var past_count = 0;
		var ongoing_contests = [];
		var future_count = 0;
		var future_contests = [];

		var first_found = -1;
		var last_found = -1;
		for(var i=0;i < valid_contests.length;i++){
			console.log(valid_contests[i].starttime,check);
			if(valid_contests[i].starttime <= check && check <= valid_contests){
				if(first_found == -1) first_found = i;
				ongoing_contests.push(valid_contests[i]);
			}
			else if(first_found != -1){
				last_found = i;
			}
		}
		if(first_found != -1){
			var j = first_found - 1;
			while(j > 0 && past_count<5){
				past_count++;
				past_contests.push(valid_contests[j]);
			}
		}
		if(last_found != -1){
			var j = last_found;
			while(j < valid_contests.length && future_count<5){
				future_count++;
				future_contests.push(valid_contests[j]);
			}
		}
		console.log(valid_contests);
		console.log(past_contests);
		console.log(ongoing_contests);
		console.log(future_contests);
		res.send({'status' : true, 'past': past_contests , 'ongoing': ongoing_contests , 'future': future_contests  });
	});
});

router.get('/',isLoggedIn, function(req, res) {
	res.render('contests.ejs', {
        user : req.user // get the user out of session and pass to template
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

 
module.exports =router;
