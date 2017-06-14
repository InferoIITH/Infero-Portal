var User = require('../models/user.js'); 


var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });

var async = require('async');
var schedule = require('node-schedule');

function updateUser(user,callback)
{
	if(user && user.codechef.handle.length > 0){
		
		nightmare
		.goto('https://www.codechef.com/users/'+user.codechef.handle)
		.wait('.rating-number')
		.evaluate(function(){
			return document.querySelector('.rating-number').innerText;
		})
		.then(function(text){
			console.log(user.Name,text);
			user.codechef.rating = text;
			console.log(user.Name,user.codechef.rating);
			user.save(function(err){
			if(err) {
				console.log("codechef",err);
			}
			nightmare.run(function(){
	    		callback();
	  		});
		});
		});	
	}
	else {
		callback();
	}

}	
function codechefCronJob()
{
	var cc = schedule.scheduleJob('30 * * * *',function()
	{
		nightmare = Nightmare({ show: true });
		User.find({}, function(err, users) {
			async.eachSeries(users, updateUser , function(err){
				if(err) console.log(err);
				else nightmare.end();
			});
		});
	});
}

module.exports.codechefCronJob = codechefCronJob;