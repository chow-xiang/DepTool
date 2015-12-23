/*关于页面依赖js的关系
模型：{
	'pageName': []
}
*/
'use strict';

var path = require('path');
var madge = require('madge');
var tools = require('./tools/index.js');
var _log = tools._log;
var config = require("../config/config.js");
var alias = config.alias;
var BASE_PATH = config.BASE_CONFIG.BASE_PATH;
var _toResolvePath = function( path ) {
	/*先试探alias里面有没有配置*/ 
	if( !!alias[ path ] ){
		/*迭代一把先*/ 
		path = alias[ path ];
	}
	/*然后转成绝对地址*/
	return path.resolve( BASE_PATH, path );
};
var _print = tools._print;
var _ = require('lodash');

/* 判断该tree是不是，，，嘿嘿嘿（page下的init）*/
var _pageFilter = function ( _path ) {
	return /pages\/\w*\/init/.test( _path );
}

/*json walker - 将json拍扁成数组*/
var _jsonWalker = function ( obj, result ) {
	!!obj && typeof obj == 'string' ? result.push( obj ) : function () {
		for( var key in obj ){
			result.push( key )
			_jsonWalker( obj[key], result );
		}
	}()
}

/*pdj*/
var _pdj = require('./page_dep_js.js');

module.exports = function ( config, _original_tree ) {
_log('正在开启搜索');
	var _result = {};
	var _pageDepTree = {};
	var pdj = _pdj( config, _original_tree );

	/*page tree*/
	for( var key in pdj ){
		_pageDepTree[ key ] = [];
		_jsonWalker( pdj[ key ], _pageDepTree[ key ] );
	}

	/*然后吧，，，我们合并下吧，骚年*/
	for( var key in _pageDepTree ){
		var t = _pageDepTree[ key ];
		for( var i=0;i<t.length;i++){
			!_result[ t[i] ] ? ( _result[ t[i] ] = {} ) : '';
			!_result[ t[i] ][ key ] ? ( _result[ t[i] ][ key ] = 1 ) : ( _result[ t[i] ][ key ]++ );
		}
	}

	return _result;
}
