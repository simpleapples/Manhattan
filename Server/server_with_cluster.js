var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	console.log("Master server start. pid:" + process.pid);

	var userList = {};
	var userCount = 0;

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

	function messageHandler(msg) {
		if (msg.key && msg.cmd) {
			var str = JSON.stringify(msg.cmd);
			var userInfo = '';

			if (str.slice(13, 17) === 'ONLI') {
				userInfo = str.slice(str.indexOf('value') + 8, str.length - 2);
				addUser(msg.key, userInfo);			
				uid = str.slice(29, str.indexOf("value") - 4);
				sendToWorker(msg.key, '{"type":"USLE", "uid":' + uid + ', "value":' + userCount + '}');
				return;
			}

			if (str.slice(13, 17) === 'OFFL') {
				msg.cmd = '{"type":"OFFL", "uid":' + userList[msg.key].slice(9, userList[msg.key].indexOf("uname") - 4) + ', "value":' + userList[msg.key] + '}';
				sendToWorker(msg.key, msg.cmd);
				removeUser(msg.key);
				return;
			}

			sendToWorker(msg.key, msg.cmd);
		}
	}

	function sendToWorker(key, obj) {
		Object.keys(cluster.workers).forEach(function onSendToWorker(id) {
			cluster.workers[id].send({key:key, cmd:obj});
		});
	}

	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', function onClusterExit(worker, code, signal) {
		console.log('worker:' + worker.process.pid + ' died.');
		cluster.fork();
	});

	Object.keys(cluster.workers).forEach(function onClusterMessage(id) {
		cluster.workers[id].on('message', messageHandler);
	});

} else {

	var http = require('http');
	var app = http.createServer().listen(8000);
	var WebSocketServer = require('ws').Server;
	var wss = new WebSocketServer({server:app});

	console.log('websocket server run at port 8000. pid:' + process.pid);

	process.on('message', function onClientMessage(msg) {
		if (msg.key && msg.cmd) {
			sendToAll(msg.cmd);
		}
	});
	
	wss.on('connection', function onWebsocketConnect(conn) {

		var key = conn.upgradeReq.headers['sec-websocket-key'];
		var uid = '';

		console.log("pid:" + process.pid + "conn:", key);

		conn.on('message', function onWebsocketMessage(obj) {
			process.send({key:key, cmd:obj});
		});

		conn.on('error', function onWebsocketError() {
			console.log('onError', key);
		});

		conn.on('close', function onWebsocketClose() {
			var obj = '{"type":"OFFL", "uid":0, "value":0}';
			process.send({key:key, cmd:obj});
			console.log('close', key);
		});
	});

	function sendToAll(obj) {
		var i;
		for (i = wss.clients.length - 1; i >= 0; i--) {
			wss.clients[i].send(obj);
		};

		console.log("pid:" + process.pid + obj);
	}
}