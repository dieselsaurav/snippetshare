var Snippet = require('../../models/snippet');


routes = function (app) {

	app.namespace('/admin', function () {

		// Authentication check

		app.all('/*', function (req, res, next) {
			console.log(req.session.passport.user);
			if(!req.session.passport.user) {
				res.redirect('/');
				return;
			}
			next();
		});

		app.get('/', function (req, res) {
				res.render(__dirname + '/views/dashboard', { user : req.user });
		});

		app.namespace('/snippets', function () {
			
			// List all user snippet
			app.get('/', function (req, res) {
				res.render(__dirname + '/views/snippets', { user : req.user });
			});

			app.get('/new', function (req, res) {
				// Display create form
				res.render(__dirname + '/views/snippets/new', { user : req.user });
			});

			app.post('/', function (req, res) {

				snippet = new Snippet();
				snippet.name = req.body.name;
				snippet.description = req.body.description;
				snippet.snippet = req.body.snippet;
				console.log(snippet);
				snippet.save(function () {
					console.log('Snippet Saved');
					res.redirect('/admin/snippets');
				});


			});

		});

	});

}

module.exports = routes;