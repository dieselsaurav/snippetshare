var express = require('express')
  , http = require('http')
  , path = require('path')
  , lessMiddleware = require('less-middleware')
  , config = require('./config')
  , flash = require('connect-flash');

var passport = require('passport');

require('express-namespace');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'snippet share' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(lessMiddleware({
    src: __dirname + '/public',
    compress: true
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});

// locals
require('./apps/locals')(app);

// Routes
require('./apps/common')(app);
require('./apps/authentication')(app);
require('./apps/admin')(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port') + " in " + app.settings.env);
});