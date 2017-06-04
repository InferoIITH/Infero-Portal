var User = require('../models/user.js'); 


var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });

var schedule = require('node-schedule');
var async = require('async');

function getRatings(searchStr, str) {
    var index = str.indexOf(searchStr);
    while(str[index]!=">")
    	index++;
    var start = index+1;
    while(str[index]!="<")
    	index++;
    return str.substring(start,index);
}

function updateUser(user,callback){
	if(user && user.hackerrank.handle.length > 0){
		console.log(user.Name,user.hackerrank.handle,user.hackerrank.handle.length); 
		nightmare
		.goto('https://www.hackerrank.com/'+user.hackerrank.handle)
		.wait('#hacker-contest-score')
		.evaluate(function(){
			return document.body.innerHTML;
		})
		.then(function(text){
			user.hackerrank.rating = getRatings("hacker-contest-score",text);
			console.log(user.Name,user.hackerrank.rating);
			user.save(function(err){
			if(err) {
				console.log("hackerrank",err);
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
function hackerrankCronJob()
{
	var hr = schedule.scheduleJob('30 * * * *',function()
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

module.exports.hackerrankCronJob = hackerrankCronJob;
