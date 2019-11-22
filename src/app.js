//import m1 from "./module/module1"
import m2 from "./module/module2"
import $ from "jquery"
import "./css/style.css"
import "./css/iconfont.css"

let  m1 = import (/*webpackChunkName:"aa"*/'./module/module1.js');//使用import 方法异步加载模块

$(function(){
	
})


console.log(m2)
m2();

console.log(m1)
m1();