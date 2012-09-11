var Snippet = require('../../models/snippet');

routes = function (app) {

	app.namespace('/admin', function () {

		// Authentication check
		app.all('/*', function (req, res, next) {
			if(!req.session.passport.user) {
				res.redirect('/');
				return;
			}
			var messagesByType = req.flash() || {};
			var allMessages = [];

			Object.keys(messagesByType).forEach(function(type) {
				var messages = messagesByType[type] || [];
				messages.forEach(function(msg) {
					allMessages.push({ type: type, text: msg});
				});
			});
			res.locals.messages = allMessages;
			res.locals.user = req.user;
			return next();
		});

		app.namespace('/snippets', function() {
			
			// List all snippets
			app.get('/', function(req, res) {
				var snippet = new Snippet();
				Snippet.find({ 'createdBy': req.user.id }, function(err, snippets){
					res.render("" + __dirname + "/views/snippets", { 
						user: req.user, 
						snippets: snippets, 
						snippet: snippet
					});					
				});
			});

			// Display create form
			app.get('/new', function(req, res) {
				res.render(__dirname + '/views/snippets/new');
			});

			// Save snippet
			app.post('/', function(req, res) {
				snippet = new Snippet();
				snippet.name = req.body.name;
				snippet.description = req.body.description;
				snippet.snippet = req.body.snippet;
				snippet.createdBy = req.user.id;
				snippet.save(function () {
					req.flash('success', 'Snippet Created!');
					res.redirect('/admin/snippets');
				});
			});

			// Update snippet with id
			app.put('/:id', function(req, res) {
				updatedSnippet = {
					name: req.body.name,
					description: req.body.description,
					snippet: req.body.snippet
				};
				Snippet.findByIdAndUpdate(req.params.id, { $set: updatedSnippet }, function(err, snippet) {
					if (err) 
						return new Error('Snippet could not be updated with id: ' + req.params.id);
					req.flash('success', 'Snippet Updated!');
					res.redirect('/admin/snippets');
				});
			});

			// Display snippet with id
			app.get('/:id', function(req, res) {

			});

			// Display edit form
			app.get('/:id/edit', function(req, res) {  
				Snippet.findById(req.params.id, function(err, snippet) {
					res.render("" + __dirname + "/views/snippets/edit", { snippet: snippet });
				});
			});	

			// Delete snippet with id
			app.delete('/:id', function(req, res) {
				Snippet.findById(req.params.id).remove(function() {
					req.flash('error', 'Snippet Deleted!');
					res.redirect('/admin/snippets');
				});
			});

		});

	});

}

module.exports = routes;