var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport.js')(passport)

/* GET home page. */
router.get('/checkLoginStatus', function(req,res){
	if(req.isAuthenticated()){
		res.send({status:true, user: req.user});
	}
	else {
		res.send({status : false});
	}
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

