var fs = require('fs');
var path = require('path');

module.exports = function ( path ) {
	try{
		/*如果有文件的话*/ 
		var stats = fs.statSync( path );
		if( stats.isFile() ){
			return JSON.parse( fs.readFileSync( path, {encoding: 'utf-8'} ) );
		}

	}catch(e){
		return;
	}
}
