var routes = function (app) {

	app.get('/', function (req, res) {
		if(req.session.passport.user) res.redirect('/admin');
		else res.render( __dirname + '/views/index');
	});
}

module.exports = routes;