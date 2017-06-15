var express = require('express');
var router = express.Router();
var Assignment = require('../models/assignment');
var request = require('request');

function check_validity(a)
{
	return true;
}
router.post('/submitLink',function(req,res){
	Assignment.findOne({id: req.body.id},function(err,ass){

		for(var i =0 ; i < ass.problems.length;i++)
		{
			if(ass.problems[i].qid == req.body.qid){
				var ind = -1;
				
				for(var j =0; j < ass.problems[i].solved.length;j++)
				{
					
					if(ass.problems[i].solved[j].id ==req.body.uid ){
						ind = j;
						break;
					}
				}
				if(ind == -1)
				{
					console.log("trying to push");
						ass.problems[i].solved.push({'id':req.body.uid,'link':req.body.link});	
				}
				else 
				{
					console.log("trying to update");
					ass.problems[i].solved[ind] = {'id': req.body.uid,'link': req.body.link};
				}
				break;
			}
		}
		ass.save(function(err){
			if(err){
				res.send({status:false});
			}
			else res.send({status:true});
		});
	});
});



router.post('/newComment',function(req,res){
	Assignment.findOne({id: req.body.id},function(err,ass){
		req.body.comment = req.body.comment.replace(/\n\r?/g, "<br />");
		ass.comments.push({'Name': req.body.Name , 'comment' : req.body.comment});
		ass.save(function(err){
			if(err){
				res.send({status:false});
			}
			else res.send({status:true});
		});
	});
});

router.get('/getAssignments',function(req,res){
	Assignment.find({}, function(err, assignments) {
		var valid_assignments = assignments.filter(check_validity);
		valid_assignments.reverse();
		res.send({'status' : true, 'assignments' : valid_assignments});
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
