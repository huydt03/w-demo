function Ajax(){

	let self = {action};

	let handle;

  	let xhttp = new XMLHttpRequest();

  	let fns = {
  		get: (url, data = {}, success = function(){})=> {
  			action(url, data, 'GET', success);
  		},
  		post: (url, data = {}, success = function(){})=> {
  			action(url, data, 'POST', success);
  		},
  		put: (url, data = {}, success = function(){})=> {
  			action(url, data, 'PUT', success);
  		},
  		delete: (url, data = {}, success = function(){})=> {
  			action(url, data, 'DELETE', success);
  		},
  	}
  	function serialize(obj, prefix) {
	  var str = [],
	    p;
	  for (p in obj) {
	    if (obj.hasOwnProperty(p)) {
	      var k = prefix ? prefix + "[" + p + "]" : p,
	        v = obj[p];
	      str.push((v !== null && typeof v === "object") ?
	        serialize(v, k) :
	        encodeURIComponent(k) + "=" + encodeURIComponent(v));
	    }
	  }
	  return str.join("&");
	}

  	function action(url, data = {}, method = 'GET', success = function(){}){
	  xhttp.onload = function(){
	  	if(this.readyState == 4 && this.status == 200){
	  		let responseData = JSON.parse(this.responseText);
	  		success(responseData);
	  	}
	  	else{
	  		success({message: this.statusText});
	  	}
	  };

	  xhttp.onerror = function(e){
	  	success(e)
	  }

	  xhttp.open(method, url, true);
	  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	  let header = data._header;
	  for(let k in header){
	  	xhttp.setRequestHeader(k, header[k]);
	  }
	  delete data._header;

	  xhttp.send(serialize(data));
  	}

	function init(){
		for(let key in fns){
			Object.defineProperty(self, key, {
				get: function(){ return fns[key]; }
			});
		}
	}

	init();

	return self;
}