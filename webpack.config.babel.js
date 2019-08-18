import path from 'path';

module.exports = {
	entry: {
	  preload: './target/entry.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '../dist/',
		filename: 'extract-normalize-urls.bundle.js',
		chunkFilename: '[id].bundle.js',
        libraryTarget: 'var',
        library: 'Pattern'
	}
};