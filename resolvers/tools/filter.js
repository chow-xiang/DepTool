'use strct';
/*需要排除的几个邪恶的js文件，如baidu-echarts，内部实现了一套amd*/

module.exports = function( jsPath ){
	return jsPath.indexOf('node_modules') == -1 &&
		jsPath.indexOf('baidu-echarts') == -1 && 
		jsPath.indexOf('gulpfile') == -1 && 
		jsPath.indexOf('webpack.config') == -1;
}

