module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{html,png,js,css,json}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};