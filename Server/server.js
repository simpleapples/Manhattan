var http = require('http'),
	app = http.createServer().listen(8000),
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({server:app}),
    //wss = new ws.Server({server:app}),
	userList = {},
	userCount = 0;

console.log('websocket server run at port 8000');

wss.on('connection', function onWebsocketConnect(conn) {

	var key = conn.upgradeReq.headers['sec-websocket-key'],
		uid = '';

	console.log("conn", key);

	conn.on('message', function onWebsocketMessage(obj) {
		var str = JSON.stringify(obj),
			userInfo = '';

		if (str.slice(13, 17) === 'ONLI') {
			userInfo = str.slice(str.indexOf('value') + 8, str.length - 2);
			addUser(key, userInfo);			
			uid = str.slice(29, str.indexOf("value") - 4);
			sendToClient(key, '{"type":"USLE", "uid":' + uid + ', "value":' + userCount + '}');
		}

		if (str.slice(13, 17) === 'OFFL') {
			removeUser(key);
		}

		sendToAll(obj);
	});

	conn.on('error', function onWebsocketError() {
		console.log('onError', key);
	});

	conn.on('close', function onWebsocketClose() {
		sendToAll('{"type":"OFFL", "uid":' + userList[key].slice(9, userList[key].indexOf("uname") - 4) + ', "value":' + userList[key] + '}');
		removeUser(key);

		console.log('close', key);
	});

	function addUser(key, userInfo) {
		userCount++;
		userList[key] = userInfo;
	}

	function removeUser(key) {
		userCount--;
		if (userList[key]) {
			delete userList[key];
		}
	}

	function sendToClient(client, obj) {
		var i;
		for (i = wss.clients.length - 1; i >= 0; i--) {
			if (wss.clients[i].upgradeReq.headers['sec-websocket-key'] === client) {
				wss.clients[i].send(obj);
				break;
			}
		};

		console.log(obj);
	}

	function sendToAll(obj) {
		var i;
		for (i = wss.clients.length - 1; i >= 0; i--) {
			wss.clients[i].send(obj);
		};

		console.log(obj);
	}

});
