module.exports = function(app, ensureAuthenticated) {
	app.get('/snippet/new', ensureAuthenticated, function (req, res) {
    	res.render('snippet/new', { user: req.user });
	});

	app.post('/snippet', ensureAuthenticated, function (res, res) {

	});
}