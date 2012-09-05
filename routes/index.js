
/*
 * GET home page.
 */

exports.index = function(req, res){
	if(!req.user)
		res.render('index', { title: 'SnippetShare' });
	else
	  res.render('dashboard', { user: req.user });

};

exports.dashboard = function(req, res){
    res.render('dashboard', { user: req.user });
};

exports.newSnippet = function(req, res){
    res.render('snippet/new', { user: req.user });
};