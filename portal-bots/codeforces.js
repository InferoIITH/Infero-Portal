var request = require('request');
var User = require('../models/user.js'); 

var schedule = require('node-schedule');
var async = require('async');

var updateUser = function(user,callback)
{
	if(user && user.codeforces.handle.length > 0)
	{
		request.get({
				uri: 'http://codeforces.com/api/user.rating?handle='+user.codeforces.handle,
				method : 'GET',
				json   : true
				},	
	 			function(err,response,body){
		 	if(body.status == 'OK')
			{
				if(body.result.length > 0)
				{
					user.codeforces.rating = body.result[body.result.length - 1].newRating;	
					console.log(user.Name,user.codeforces.rating);	
				}
				user.save(function(err){
					if(err) {
						console.log("codeforces",err);
					}
				});
				callback();
			}
			else
			{
				console.log("erraneous codeforces handle of user",user.Name);
				callback();
			}
		});

	}	
}

function codeforcesCronJob()
{
	var cf = schedule.scheduleJob('35 * * * *',function()
	{
		User.find({}, function(err, users) {
			async.eachSeries(users, updateUser , function(err){
				if(err) console.log(err);
			});
		});
	});	
}


module.exports.codeforcesCronJob = codeforcesCronJob;