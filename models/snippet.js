var mongoose = require('mongoose');
var config = require('../config');

//var db = mongoose.connect(config.development.dbUrl);

var SnippetSchema = new mongoose.Schema({
	description: String,
	name: String,
	snippet: String,
	created: { type: Date, default: Date.now },
	updated: Date
});

module.exports = mongoose.model('Snippet', SnippetSchema);