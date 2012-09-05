module.exports = {
	development: {
		fb: {
			appID: '110275742454335',
			appSecret: '58dcdc5d387534db2f8ffcb1d542a063',
			url: 'http://snippetshare.local:5000/'
		},
		dbUrl: 'mongodb://user:password@alex.mongohq.com:10023/snippetshare'
	},
	production: {
		fb: {
			appID: '248733805247979',
			appSecret: 'dad8bbf0fa888c4998fab641730b9b75',
			url: 'http://snippetshare.com/'
		},
		dbUrl: 'mongodb://user:password@alex.mongohq.com:10023/snippetshare'
	}
}