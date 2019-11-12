const webpack = require('webpack');
const webpackDevMid = require('webpack-dev-middleware');
const webpackHotMid = require('webpack-hot-middleware');
const express = require('express')
const app = express()
const config = require('../webpack.config.js')
const compiler = webpack(config());
app.use(webpackDevMid(compiler,{}));
app.listen(3001);
