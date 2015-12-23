'use strict';

/*关于页面依赖js的关系
模型：{
	'pageName': []
}
*/
var madge = require('madge');
var tools = require('./tools/index.js');
var _formatPath = tools.formatPath;
var _print = tools._print;
var _log = tools._log;
var _ = require('lodash');


/*filter 去特么的！！！还真的有死循环在啊！！！赶紧的排除掉node_modules*/
var _filter = function( _name ){
	return _name.indexOf('node_modules') == -1 && _name.indexOf('baidu-echarts') == -1;
}

/*数组转json*/
var _arrayToObj = function( array ){
	var t = {}
	for( var i=0;i<array.length;i++ ){
		t[ array[i] ] = [];
	}
	return t;
}

/*关于name的format*/
var _formatName = function( _name, config ){
	/*预处理 - 管他妈的是不是pages/开头，艹*/
	_name = _name.replace('.js', '').replace('pages/', '');
	/*判断是不是init结尾，但是没有加'pages/'路径*/
	return !/\/init\.?(js|vue|js.map)*$/.test( _name ) ? function( _name ){
		/*查看alias里面有没有*/
		return config.ALIAS[ _name ] || _name;
	}( _name ) : 'pages/' + _name;
}

/*递归*/
var _recursivePageDep = function( _tree, _original_tree, config ){
	for( var key in _tree ){
		var _name = _formatName(key, config);

		!!_filter( _name ) ? function(){
			/*子集先合并*/
			var _child = _arrayToObj( _tree[ key ].concat(
				_original_tree[ _name ] || []
			) );

			_tree[ key ] = _child;

			/*递归*/
			_recursivePageDep( _tree[ key ], _original_tree, config );

		}() : '';
	}
}

/*递归整容数据*/ 
var _recursiveFormatPath = function( result, parentPath ) {
	for( var key in result ){

		!!_filter( key ) ? function  () {
			/*迭代*/
			var newName = _formatPath( key, parentPath );
			result[newName] = result[key];
			delete result[key]

			/*递归*/
			parentPath = key;
			_recursiveFormatPath( result[newName], parentPath );

		}() : '';

	}

}

module.exports = function ( config, _original_tree ) {
_log('正在开启搜索');
	var PAGE_JS_PATH = config.BASE_CONFIG.BASE_PATH + '/pages';

	/*迭代过滤方法-找出path以/init结尾的文件*/
	config.exclude = '^((?!\/init).)*$';
	/*得到所有page的init.js的依赖关系*/
	var _page = madge( PAGE_JS_PATH, config ).tree;
	// _print( 'all_page', _page);

	var result = _.cloneDeep(_page);
	_recursivePageDep( result, _original_tree, config );
	/*艹艹艹，水平有限只能使用*/ 
	_recursiveFormatPath( result );
	
	return result;
}


