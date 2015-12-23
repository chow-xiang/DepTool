#!/usr/bin/env node

'use strct';

var path = require('path');
/*config*/
var config = require( '../config/config' );
var RESULT_PATH = config.BASE_CONFIG.RESULT_PATH;
/*resovler*/
var resolvers = require( '../resolvers/index.js' );
var tools = require( '../resolvers/tools/index.js' );
/*输出json的方法*/
var _print = tools._print;
/*uuid*/ 
var _uuid = tools._uuid;
var _log = tools._log;
var _getFileJson = tools._getFileJson;
/*解析的工具*/
var madge = require('madge');


// process.argv[3] = '-dep';
// process.argv[4] = 'js=ept';
// var _original_tree = madge( config.BASE_CONFIG.BASE_PATH ).tree;
// +function () {
// 	debugger;
// 	var val = resolvers.search( config, _original_tree, process.argv[3], process.argv[4] );
// 	_print( process.argv[3].replace('-', '') + '-' + _uuid(), val );
// }();
_log('启动node');
/*输入的参数*/
var DEP_TYPE = process.argv[2];

DEP_TYPE == '--help' ? console.log('\
-n,        --normal                     get normal result                           \n\
-t,        --times                      get use time of all js file                 \n\
-pdj,      --page-dep-js                get all page quote happening                \n\
-jdp,      --js-dep-page                the js used which pages                     \n\
search,    search -type <expression>    you can search result by expression         \n\
') : function (config) {
_log('正在初始化原始数据');
	/*以上四种模式，是不能提取缓存的，要每次都刷新*/ 
	switch ( DEP_TYPE ){
		case '-n':
			_print( 'original_dep', madge( config.BASE_CONFIG.BASE_PATH ).tree, RESULT_PATH );
			break;
		case '-t':
			_print( 'times', resolvers.timer( config, madge( config.BASE_CONFIG.BASE_PATH ).tree ), RESULT_PATH );
			break;
		case '-pdj':
			_print( 'page_dep_js', resolvers.page_dep_js( config, madge( config.BASE_CONFIG.BASE_PATH ).tree ), RESULT_PATH );
			break;
		case '-jdp':
			_print( 'js_dep_page', resolvers.js_dep_page( config, madge( config.BASE_CONFIG.BASE_PATH ).tree ), RESULT_PATH );
			break;
		case 'search':
			+function () {
				var _original_tree = _getFileJson( RESULT_PATH + '/original_dep.json' ) || function(){
					var original_dep = madge( config.BASE_CONFIG.BASE_PATH ).tree;
					_print( 'original_dep', original_dep, RESULT_PATH  );
					return original_dep;
				}();
				var val = resolvers.search( config, _original_tree, process.argv[3], process.argv[4] );
				_print( process.argv[3].replace('-', '') + '-' + _uuid(), val, RESULT_PATH );
			}();
			break;
	}

}(config)

