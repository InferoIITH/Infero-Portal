var User = require('../models/user.js'); 


var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });

var schedule = require('node-schedule');
var async = require('async');

function getRatings(str) {
    var index = 0;
    while(str[index]!="(")
    	index++;
    var start = index+1;
    while(str[index]!=" ")
    	index++;
    return str.substring(start,index);
}

function updateUser(user,callback){
	if(user && user.spoj.handle.length > 0){
		console.log(user.Name,user.spoj.handle,user.spoj.handle.length); 
		nightmare
		.goto('https://www.spoj.com/users/'+user.spoj.handle)
		.wait('#user-profile-left')
		.evaluate(function(){
			return document.querySelector('#user-profile-left').innerHTML;
		})
		.then(function(text){
			user.spoj.points = getRatings(text);
			console.log(user.Name,user.spoj.points);
			user.save(function(err){
			if(err) {
				console.log("spoj",err);
			}
			nightmare.run(function(){
	    		callback();
	  		});

		});
		});
		}
	else 
	{
		callback();
	}
};

function spojCronJob()
{
	var hr = schedule.scheduleJob('45 * * * *',function()
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

module.exports.spojCronJob = spojCronJob;