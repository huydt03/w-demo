importScripts('Ajax.js');

// const URL = 'http://localhost/LumenApi/public/api/';
const URL = 'https://api.publicapis.org/entries';

let ajax = new Ajax;

self.onmessage = function(data){
	data = data.data;
	let uri = URL + data.uri;
	let params = data.data;
	let method = data.method;

	ajax.action(uri, params, method, self.postMessage);
}
