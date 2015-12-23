'use strict';

/*alias*/ 
var require_config = require( './require_config' );
/*解析时用到的参数*/ 
var resolve_config = require( './resolve_config' );

module.exports = function (argument) {
	return {
		/*js文件大本营*/ 
		"BASE_CONFIG": {
			"BASE_PATH": "e:/copy/inno-pms/web_static/js",
			"RESULT_PATH": "e:/copy/result"
		},
		"ALIAS": require_config,
		"RESOLVE_CONFIG": resolve_config
	}
}()