'use strict';
module.exports = function() {

	return {
		/* cjs or amd or es6 ?*/ 
		"format": "cjs",
		/* filter */
		"exclude": true,
		/* 出错是否停止下去 */ 
		"breakOnError": false,
		/* 优化？ */ 
		"optimized": false,
		/* True if nested dependencies should be found in AMD modules.  */ 
		"findNestedDependencies": false,
		/* 主入口，麻痹，没有 */
		"mainRequireModule": "",
		/* alias */
		"requireConfig": {},
		/* 各种的回调 */
		/* 当特么的拿到一份文件，准备解析的时候，干死他！ */ 
		"onParseFile": null,
		/* 当一份文件解析的结果，插入tree之后 */ 
		"onAddModule": null,
		/* 可被纳入解析范围的文件的后缀 */ 
		"extensions": [".js"]
	}

}()
