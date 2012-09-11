var User = require('../../models/user');
var config = require('../../config');
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

var clientID, clientSecret, callbackURL;

var routes = function(app) {

  if ( app.settings.env === 'production' ) {
    clientID = config.production.fb.appID,
    clientSecret = config.production.fb.appSecret,
    callbackURL = config.production.fb.url + "fbauthed/"
  } else if ( app.settings.env === 'development' ) {
    clientID = config.development.fb.appID,
    clientSecret = config.development.fb.appSecret,
    callbackURL = config.development.fb.url + "fbauthed/"
  }

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });



  passport.use(new FacebookStrategy({
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: callbackURL
    },
    function(accessToken, refreshtoken, profile, done) {
      process.nextTick(function () {
        var query = User.findOne({ 'fbId': profile.id });
        query.exec(function (err, oldUser) {
          if(oldUser) {
            console.log('User: ' + oldUser.name + ' found and logged in!');
            done(null, oldUser);
          } else {
            var newUser = new User();
            newUser.fbId = profile.id;
            newUser.name = profile.displayName;
            newUser.email = profile.emails[0].value;

            newUser.save(function(err) {
              if(err) {throw err;}
              console.log('New user: ' + newUser.name + ' created and logged in!');
              done(null, newUser);
            }); 
          }
        });
      });
    }
  ));

  app.get('/fbauth/', passport.authenticate('facebook', { scope: 'email' }));
  app.get('/fbauthed/', passport.authenticate('facebook', { failureRedirect : '/' }), function (req, res) {
    res.redirect('/admin/snippets');
  });
  app.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/');
  });
}

module.exports = routes;