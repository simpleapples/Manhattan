var http = require('http'),
	app = http.createServer().listen(8000),
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({server:app}),
	userList = {};

console.log('websocket server run at port 8000');

wss.on('connection', function (conn) {

	var key = conn.upgradeReq.headers['sec-websocket-key'],
		uid = '';

	console.log("conn", key);

	conn.on('message', function (obj) {

		var str = JSON.stringify(obj);

		if (str.slice(13, 17) == 'ONLI') {
			uid = str.slice(28, str.length - 2);
			addUser(key, uid);
		}

		if (str.slice(13, 17) == 'OFFL') {
			removeUser(key);
		}

		sendToAll(obj);

	});

	conn.on('error', function () {
		console.log('onError', key);
	});

	conn.on('close', function () {
		sendToAll('{"type":"OFFL", "uid":' + userList[key] + '}');
		removeUser(key);

		console.log('close', key);

	});

	function addUser(key, uid) {

		userList[key] = uid;

	}

	function removeUser(key) {

		if (userList[key]) {
			delete userList[key];
		}

	}

	function sendToAll(obj) {

		var i;
		for (i = wss.clients.length - 1; i >= 0; i--) {
			wss.clients[i].send(obj);
		};

		console.log(obj);

	}

});