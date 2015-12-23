'use strict';
var path = require('path');
var fs = require('fs');
var config = require( '../../config/config.js' );
var JS_PATH = config.BASE_CONFIG.BASE_PATH;
var ALIAS = config.ALIAS;
var HAD_TYPE = /\w*([.](js|css|vue|map))\w*/;

/*关于name的format*/
var _formatName = function( _name ){
	/*预处理 - 艹*/
	_name = _name.replace('.js', '').replace('.vue', '');
	/*判断是不是init结尾，但是没有加'pages/'路径*/
	_name = !/^(pages|modules|libs|i18n|sentry)/.test( _name ) && /\/init$/.test( _name ) ? 'pages/' + _name : _name;

	/*特殊*/
	if( _name.indexOf('/initChartData') != -1 && !/^pages\//.test( _name ) ){
		_name = 'pages/' + _name;
	}

	return _name;
}

module.exports = function( filePath, parentPath, type ){
	/*妈了个鸡蛋啊，同名的css文件害死人啊*/ 
	!!type || ( type = '.js' );
	/*来，初始化下，纯粹是为了筛选出page页面, fuck, 谁特么让你把老子的'pages/'给删掉了，艹*/ 
	filePath = _formatName( filePath );
	/*规范化*/ 
	filePath = path.normalize( filePath );
	/*先判断filePath是否是配置别名，如果是，则取配置里的路径*/ 
	if( !!ALIAS[ filePath ] ){
		filePath = ALIAS[ filePath ];
		// 然后转成绝对路径
		filePath = path.resolve(config.BASE_CONFIG.BASE_PATH, filePath);

	}else if( path.isAbsolute(filePath) ){
		/*如果是绝对路径 - 合并基础路径*/ 
		filePath.split( path.sep ).join('/').indexOf( JS_PATH ) == -1 && ( filePath = path.join(JS_PATH, filePath) );
	}else if( !path.isAbsolute( filePath ) ){

		var cFilePath = filePath;
		/*如果是根据引用做的相对路径 - 先尝试弄成绝对路径 - 判断是不是文件*/ 
		cFilePath = path.resolve(config.BASE_CONFIG.BASE_PATH, filePath);
		cFilePath = HAD_TYPE.test( cFilePath ) ? cFilePath : cFilePath + type;

		var stat;
		try{

			stat = fs.statSync( cFilePath );
			/*如果是文件的话，那么，返回合并的路径*/ 
			stat.isFile() ? ( filePath = cFilePath ) : filePath;

		}catch(e){

		}
	}
	/*将//替换成/*/ 
	var _filePath = filePath.split( path.sep ).join('/');
	
	return HAD_TYPE.test( _filePath ) ? _filePath : _filePath + type;
}


