var webpack = require('webpack');
module.exports = {
    context: __dirname + '/app',
    devtool: '#source-map',
    entry: {
        app: './app.js',
        vendor: ['angular']
    },
    output: {
        path: __dirname,
        filename: 'app.bundle.js'
    }
};