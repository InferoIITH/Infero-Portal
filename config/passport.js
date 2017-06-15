var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User =  require('../models/user');
var configAuth = require('./auth');


module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL
        },
        function(token, refreshToken, profile, done) {

            process.nextTick(function() {
		console.log(profile.emails[0].value);
                User.findOne({ 'email' :  profile.emails[0].value }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser          = new User();
                        newUser.Name  = profile.displayName;
                        newUser.email = profile.emails[0].value;

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });

        }));

};







