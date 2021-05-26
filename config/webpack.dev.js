var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports={
devtool: 'cheap-module-eval-source-map',
entry: {
polyfills: './src/polyfills.ts',
vendor: './src/vendor.ts',
app: './src/main.ts'
},
resolve: {
extensions: ['.ts', '.js']
},
module: {
rules: [{
test: /\.ts$/,
loaders: [
'babel-loader',
{
loader: 'awesome-typescript-loader',
options: {
configFileName: helpers.root('tsconfig.json')
}
},
'angular2-template-loader'
],
exclude: [/node_modules/]
},
{
test: /\.js$/,
loader: 'babel-loader',
exclude: /node_modules/,
query: {
presets: ['es2015']
}
},
{
test: /\.html$/,
loader: 'html-loader'
},
{
test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
loader: 'file-loader?name=assets/[name].[hash].[ext]'
},
{
test: /\.css$/,
exclude: helpers.root('src', 'app'),
loader: ExtractTextPlugin.extract({
fallbackLoader: 'style-loader',
loader: 'css-loader?sourceMap'
})
},
{
test: /\.css$/,
include: helpers.root('src', 'app'),
loader: 'raw-loader'
}
]
},
plugins: [
// Workaround for angular/angular#11580
new webpack.ContextReplacementPlugin(
// The (\\|\/) piece accounts for path separators in *nix and Windows
/angular(\\|\/)core(\\|\/)@angular/,
helpers.root('./src'), // location of your src
{} // a map of your routes
),
new webpack.optimize.CommonsChunkPlugin({
name: ['app', 'vendor', 'polyfills']
}),
new HtmlWebpackPlugin({
template: 'src/index.html'
}),
new ExtractTextPlugin('[name].css'),
new webpack.DefinePlugin({
'process.env': {
API_URL: JSON.stringify('http://localhost:5000/api/')
}
}),
new webpack.NamedModulesPlugin()
]
,
output: {
path: helpers.root('dist'),
publicPath: '/',
filename: '[name].bundle.js',
chunkFilename: '[id].chunk.js'
},
devServer: {
historyApiFallback: true,
stats: 'minimal'
}
}