let htmlWebpackPlugin = require('html-webpack-plugin')
let {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = env =>{
	const common = {
		mode:'development',
		entry:{
			app1:'./src/app.js',
			app2:'./src/app2.js',
		},
		output:{
			path:__dirname + '/dist',
			filename:'[name].[hash:6].js'
		},
		module:{
			rules:[
				{
					test:/\.css$/,
					use:[
					{loader:'style-loader'},
						{loader:'css-loader'}
					]
				},
				{
					test:/\.(png|jpg|jpeg|gig)/,
					use:[
					{loader:'file-loader'}
					]
				}
			]
		},
		plugins:[
			new htmlWebpackPlugin({
				filename:'index1.html',
				template:'./src/index1.html',
				chunks:['app1']
			}),
			new htmlWebpackPlugin({
				filename:'index2.html',
				template:'./src/index2.html',
				chunks:['app2']
			}),
			new CleanWebpackPlugin() //清除dist已打包的内容，引入时需引入单独函数{CleanWebpackPlugin}
		],
		optimization:{
			splitChunks:{
				/*chunks:'initial',
				minSize :30000,*/
				cacheGroups:{
					common:{
						test:/[\\/]node_modules[\\/]/,
						name:'common',
						chunks:'all'
					},
					default: {
			          test: /[\\/]module[\\/]/,
			          minChunks: 2,//一般为非第三方公共模块
			        }
				}
			}
		}
		
	}
	return common;
}