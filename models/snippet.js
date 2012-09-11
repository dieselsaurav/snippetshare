var mongoose = require('mongoose');
var config = require('../config');
var moment = require('moment');

var snippetSchema = new mongoose.Schema({
	description: String,
	name: String,
	snippet: String,
	createdBy: mongoose.Schema.ObjectId,  
	created: { type: Date, default: Date.now },
	updated: Date
});

snippetSchema.virtual('createdAt').get(function() {
	return moment(this.created).fromNow();
});


module.exports = mongoose.model('Snippet', snippetSchema);