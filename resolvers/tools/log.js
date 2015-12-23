'use strict';

var color = require('colors');

module.exports = function  ( str, keyWords ) { 
	console.log( color.green( '过程：' ) + color.yellow( str ) + color.red( keyWords || '' ) );
}