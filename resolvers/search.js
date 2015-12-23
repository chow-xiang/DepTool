'use strict';
/*
dep search -timer js=api   查看它的引用情况
dep search -dep js=api     查看它的被那些页面引用
dep search -dep page=api   查看它的js-dep-tree
*/ 
var fs = require('fs');
var path = require('path');
var tools = require('./tools/index.js')
var _formatPath = tools.formatPath;
var _getFileJson = tools._getFileJson;
var _log = tools._log;
var _pageDepJs = require('./page_dep_js.js');
var _jsDepPage = require('./js_dep_page.js');
var _timer = require('./timer.js');

/*处理某个文件的条件*/ 
var _getSearchResult = function ( _searchTree, _searchThing, _searchValue ) {

_log( '开始查找数据 ', _searchValue );	

	var _newSearchValue = _searchThing == 'page' ? _formatPath( _searchValue + '/init' ) : _formatPath( _searchValue );

	var _regExp = new RegExp( function  () {
		if( _searchValue != _newSearchValue ){
			return _searchThing == 'page' ? '\\w*\/' + _searchValue + '\/init\.' : '\\w*' + _searchValue + '\\w*'
		}else{
			return '^' + _newSearchValue + '$';
		}
	}() );

	var val = {};
	/*遍历，这他妈主要是为了逼得输入的值可能他妈的就是乱七八糟的，我们就手动查找下相似的结果吧。。。泪崩啊*/
	for( var key in _searchTree ){
		/*合并结果*/ 
		if( _regExp.test( key ) ){

_log( '找到合适数据 ', key );

			val[ key ] || (val[ key ] = []);
			val[ key ].push(_searchTree[key]);
		}
	}

	return val;
}

/*做个名称的简单的map吧，唉，醉了醉了啊*/
var resultMap = {
	'-timer': '\\times.json',
	'-dep'  : {
		'js':    '\\js_dep_page.json',
		'page' : '\\page_dep_js.json'
	}
}

module.exports = function (  config, _original_tree, type, expression ) {

_log('开始搜索资源');
	
	var RESULT_PATH = config.BASE_CONFIG.RESULT_PATH;
	var _searchThing = expression.split('=')[0];
	var _searchValues = expression.split('=')[1];

	/*哥这么写就是为了秀智商*/ 
	var _searchTree =  function () {
		/*读取本地的文件，唉*/
		RESULT_PATH += resultMap[ type ][ _searchThing ] || resultMap[ type ];
		return _getFileJson( RESULT_PATH );

	}() || function () {
		/*啊哈哈，逮到一个是一个*/ 
		return ( 
			type == '-timer' && 
			function  () {
				return _timer( config, _original_tree );
			}() 
		) 
		||
		( 
			type == '-dep' && 
			function () {
				return ( 
					_searchThing == 'js' && function () {
						return _jsDepPage( config, _original_tree );
					}() 
					) || ( 
					_searchThing == 'page' && function () {
						return _pageDepJs( config, _original_tree);
					}() 
				);
			}() 
		);

	}();



	/*如果麻痹的是个数组，草了个鸡蛋*/
	try{
		_searchValues = JSON.parse( _searchValues );
	} catch(e){
		_searchValues = [ _searchValues ];
	}

	var val = {};
	val[ _searchThing ] = [];

	for( var i=0;i<_searchValues.length;i++ ){
		+function ( i ) {
			val[ _searchThing ].push( _getSearchResult( _searchTree, _searchThing, _searchValues[i] ) );
		}( i )
	}

	console.log( JSON.stringify( val, null, 4 ) );

_log('准备输出');
	return val;
}