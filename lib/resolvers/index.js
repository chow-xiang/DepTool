'use strct';

var timer = require('./timer.js');
var js_dep_page = require('./js_dep_page.js');
var page_dep_js = require('./page_dep_js.js');
var search = require('./search.js');

module.exports = {
	timer: timer,
	js_dep_page: js_dep_page,
	page_dep_js: page_dep_js,
	search: search
}