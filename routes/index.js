
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'SnippetShare' });
};

exports.dashboard = function(req, res){
    res.render('dashboard', { user: req.user });
};