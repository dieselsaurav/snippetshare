var express = require('express')
  , http = require('http')
  , path = require('path')
  , routes = require('./routes/')
  , lessMiddleware = require('less-middleware')
  , config = require('./config');

var app = express();

var User = require('./models/user');

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var clientID, clientSecret, callbackURL;

if ( app.settings.env === 'production' ) {
  clientID = config.production.fb.appID,
  clientSecret = config.production.fb.appSecret,
  callbackURL = config.production.fb.url + "fbauthed"
} else if ( app.settings.env === 'development' ) {
  clientID = config.development.fb.appID,
  clientSecret = config.development.fb.appSecret,
  callbackURL = config.development.fb.url + "fbauthed"
}

passport.use(new FacebookStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL
  },
  function(accessToken, refreshtoken, profile, done) {
    process.nextTick(function () {
      var query = User.findOne({ 'fbId': profile.id });
      query.exec(function (err, oldUser) {
        console.log(profile);
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

app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'snippet share' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(lessMiddleware({
    src: __dirname + '/public',
    compress: true
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});


app.get('/', routes.index);

app.get('/fbauth', passport.authenticate('facebook', { scope: 'email' }));

app.get('/fbauthed', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  routes.dashboard
);

app.get('/dashboard', ensureAuthenticated, routes.dashboard);

app.get('/logout', function(req, res){
  req.logOut();
  res.redirect('/');
});

// routes for snippets

require('./routes/snippet')(app, ensureAuthenticated);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port') + " in " + app.settings.env);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}