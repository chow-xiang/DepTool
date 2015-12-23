/*
解析所有js被require的次数
氛围三类，page，lib，module
模型：{
	page: [
		{
			name: 'js-file-name',
			times: 1
		},
		...
	],
	lib: [
		{
			name: 'js-file-name',
			times: 1
		},
		...
	],
	module: [
		{
			name: 'js-file-name',
			times: 1
		},
		...
	]
}
*/
'use strict';

var path = require('path');
/*解析的工具*/
var madge = require('madge');
/*config*/
var config = require( '../config/config' );


/*将相对定位转成绝对定位*/
var tools = require( '../resolvers/tools/index.js' );
var formatJsPath = tools.formatPath;
var _print = tools._print;
var _filter = tools.filter;
var _log = tools._log;

/*被过滤的，防止出错*/
var _unvalidated = [];

module.exports = function ( config, _origin_tree ) {
_log('正在开启搜索');
	var ALIAS = config.ALIAS;
	/*js文件夹路径*/
	var JS_PATH = config.BASE_CONFIG.BASE_PATH;
	// var depObj = madge( config.BASE_CONFIG.BASE_PATH );

	/*all*/
	var all = {};
	tools._walker( config.BASE_CONFIG.BASE_PATH, function( _tree, _path ){
		all[ _path ] = 0;
	}, true );
	/*获取原始依赖关系*/
	// var _depTree = depObj.tree;

	for( var key in _origin_tree ){

		var _thisFile = key;
		var _deps = _origin_tree[ key ];

		/*validate*/

		if( !_filter( key ) ){
			_unvalidated.push( key );
			continue;
		}
		/*该文件也是js文件，也需要解析，主要是解析那些page下的init.js*/
		// _deps.push( _thisFile );

		for (var i=0;i<_deps.length;i++) {

			/*validate*/
			if( !_filter( _deps[i] ) ){
				_unvalidated.push( _deps[i] );
				continue;
			}

			/*格式化路径*/
			var _abPath = formatJsPath( _deps[i], _thisFile );

			/*计数*/
			all[ _abPath ]++;

		}
	}

	return all;
}
