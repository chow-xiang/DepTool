'use strict';

/*打印文件*/
var fs = require('fs');
var path = require('path');
var _log = require('./log.js');

var _write = function( printType, _str, RESULT_PATH){

	var _newFilePath = path.join( RESULT_PATH, printType + '.json' );
	/*唉，容点错*/
	fs.open( _newFilePath, 'w', function( e ){
		/*判断文件夹是否存在*/
		!!e ? fs.mkdir( RESULT_PATH, function ( e ) {
			fs.writeFile( _newFilePath, _str, function(e){
				!!e ? console.error( e ) : _log('输出已完成：', printType + '.json');
			} );
		} ) : 
			fs.writeFile( _newFilePath, _str, function(e){
				!!e ? console.error( e ) : _log('输出已完成：', printType + '.json');
		} );

	} );
}

module.exports = function( printType, data, RESULT_PATH ) {

	!data ? _log(printType + ':',  + 'no data') : function(){
		var _str = JSON.stringify( data, null, 4 );
		_write( printType, _str, RESULT_PATH )

	}()

};
