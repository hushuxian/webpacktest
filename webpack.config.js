let htmlWebpackPlugin = require('html-webpack-plugin')
let {CleanWebpackPlugin} = require('clean-webpack-plugin')
let extractTextCss = require('extract-text-webpack-plugin')
let webpackSpritesmith = require('webpack-spritesmith')
const path = require('path')

module.exports = env =>{
	const common = {
		mode:'development',
		entry:{
			app1:['babel-polyfill','./src/app.js'],
			app2:['babel-polyfill','./src/app2.js'],
		},
		output:{
			path:__dirname + '/dist',
			filename:'[name].[hash:6].js'
		},
		module:{
			rules:[
				{
					test:/\.js$/,
					use:[
						{
							loader:'babel-loader',
							options:{
								plugins:["@babel/plugin-syntax-dynamic-import"],
								presets:[
									['@babel/preset-env',{
										targets:{
											browsers:['>1%']
										}
									}
									]
								]
							}
						}
					]
				},
				{
					test:/\.css$/,
					use:extractTextCss.extract({
						fallback:{
							loader:'style-loader'
						},
						use:[
							{loader:'css-loader'},
							/*{
								loader:'postcss-loader',
								options:{
									plugins:[
										require('postcss-sprites')({
											spritesPath:'./dist/assets/sprites'
										})
									]
								}
							}*/
						]
					})
					
				},
				{
					test:/\.(png|jpg|jpeg|gif|woff2?|eot|ttf|otf|svg)(\?.*)?$/,
					use:[
					{
						loader:'url-loader',
						options:{
							name:'[name].[hash:4].[ext]', //定义打包后的文件名，[name]表示原文件，[ext]表示原扩展名
							outputPath:'assets/imgs', //定义打包文件存放路径
							//publicPath:'assets/imgs',//指定在css里引入的路径
							limit:5000 //把小于5KB的图片转换成base64码，减少请求
						}
					},
					{
						loader:'img-loader',
						options:{
							plugins:[
							require('imagemin-pngquant')({
								speed: 1,//1-11,调整压缩图片的质量，数值越大，压缩质量越高

							}),
							/*require('imagemin-mozjpeg')({
								quality:10 //1-100
							})*/
							require('imagemin-gifsicle')({
								optimizationLevel:3 // 取值只有1，2，3，默认时1
							})
							]
						}
					}

					]
				},
				{
					test:/\.(html|html)$/,
					use:[{
						loader:'html-loader',
						options:{
							attrs:["img:src","img:data-src"] //配置使用data-src和src都能解析img标签下的路径
						}
					}]
				},

			]
		},
		plugins:[
			new htmlWebpackPlugin({
				filename:'index1.html',
				template:'./src/index1.html',
				chunks:['app1','common']
			}),
			new htmlWebpackPlugin({
				filename:'index2.html',
				template:'./src/index2.html',
				chunks:['app2','common']
			}),
			new CleanWebpackPlugin(), //清除dist已打包的内容，引入时需引入单独函数{CleanWebpackPlugin}
			new extractTextCss({
				filename:'name.min.css'
			}),
			new webpackSpritesmith({
				src:{
					cwd:path.join(__dirname,'src/images'),//定义处理图片的来源
					glob:['*.jpg','*.png']//定义处理的图片类型
				},
				target:{
					image:path.join(__dirname,'dist/sprites/sprite.png'),//定义雪碧图输出的路径
					css:path.join(__dirname,'dist/sprites/sprite.css'),//定义Spritesmith生成的css名字
				},
				apiOptions:{
					cssImageRef:'./sprites/sprite.png' //定义在css时引用的路径，和输出路径保持一致
				}
			}),

		],
		optimization:{
			minimize:true,
			splitChunks:{
				chunks:'initial',//initial,all,async指定检查的文件，initial表示入口文件，all表示所有文件
				minSize :30000,//最小打包文件，默认大于30kb才单独提取，
				cacheGroups:{ //自定义提取的模块
					common:{
						test:/[\\/]node_modules[\\/]/, //提取所有node_modules里的模块
						name:'common',//指定提取出的文件名,需在htmlPlugin手动指定次文件名
						chunks:'all' //对所有文件进行提取
					},
					default: {
			          test: /[\\/]module[\\/]/,
			          minChunks: 2,//一般为非第三方公共模块
			        }
				}
			},
			runtimeChunk:true//提取webpack配置的代码
		}
		
	}
	return common;
}