var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport.js')(passport)

var Blog = require('../models/blog');
/* GET home page. */
router.get('/checkLoginStatus', function(req,res){
	if(req.isAuthenticated()){
		res.send({status:true, user: req.user});
	}
	else {
		res.send({status : false});
	}
});

router.get('/getBlogs', function(req,res){
    Blog.find({},function(err,blogs){
	    res.send({status:true, blogs: blogs});
    });
});

router.post('/newComment',function(req,res){
	Blog.findOne({id: req.body.id},function(err,blog){
		req.body.comment = req.body.comment.replace(/\n\r?/g, "<br />");
		blog.comments.push({'Name': req.body.Name , 'comment' : req.body.comment});
		blog.save(function(err){
			if(err){
				res.send({status:false});
			}
			else res.send({status:true});
		});
	});
});
router.post('/newBlog',function(req,res){
    Blog.find({},function(err,blogs){
        var neb = req.body;
	neb.description = neb.description.replace(/\n\r?/g, "<br />");
     
        var newBlog = Blog({
            id : blogs.length+1,
            title : neb.title,
            description : neb.description,
            author : neb.author,
            comments : []
        })

        newBlog.save(function(err){
            if(err){
                res.send({status:false});
            }
            res.send({status:true});
        });  
    });
    

});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/oauth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

router.get('/oauth/google/callback',
    passport.authenticate('google', {
        successRedirect : '/',
        failureRedirect : '/'
}));

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;

