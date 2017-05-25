var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/updateHandles',function(req, res){
	var data = req.body;
	User.findOne({ "id" : req.user.id } ,function(err,user){
		if(err) {
			console.log(err);
			res.send({status : false})
		}
		

		for(var key in data){
			user[key].handle = data[key];
		}

		user.save(function(err){
			if(err) {
				console.log(err);
				res.send({status:false});
			}
		});

		res.send({status: true});
	});
});
router.get('/',isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user : req.user // get the user out of session and pass to template
     });
});

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


module.exports =router;
