'use strict';

/*爬出该文件下的所有的某类别文件*/


/*这是为了缓存*/
var path = require('path');
var fs = require('fs');
var _formatJsPath = require('./format_path.js');


var _filter = function( _name ){
	return _name.indexOf('node_modules') == -1;
}
/*爬呀爬*/
var _walker = function( _path, callback ){

	var tree = {};
	if ( !_filter( _path ) ) { return; }

	var files = fs.readdirSync( _path);

	files.forEach( function( file ){
		/*简单的路径合并下*/
		var _tPath = path.join(_path, file);
		/*判断该地址是不是文件夹*/
		var stat = fs.statSync( _tPath );
		var _wPath = _tPath.split( path.sep ).join('/');

		!stat.isDirectory() ? function(){
				/*回调*/
				tree[ _wPath ] = {};
				callback && callback( tree, _wPath );

		}() : function(){
			tree[ _wPath ] = _walker( _tPath , callback )
		}()

	} );

	return tree;
}

/*缓存*/
var _cache = {

}

//
module.exports = function ( path, callback, isReflesh ) {

	return !_cache[ path ] || !!isReflesh ? function(){

		_cache[ path ] = _walker( path , callback );
		return _cache[ path ];

	}() : _cache[ path ];

}
