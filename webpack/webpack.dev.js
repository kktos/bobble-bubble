const path= require('path');
const { merge }= require('webpack-merge');
const common= require('./webpack.common.js');

module.exports= merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	// progress: true,
	// overlay: true,
	devServer: {
		port: 3000,
		liveReload: true,
		static: {
			directory: path.join(__dirname, '../assets'),
			publicPath: '/',
		},
	},
});