var http = require('http'),
	app = http.createServer().listen(process.env.PORT, process.env.IP),
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({server:app}),
    //wss = new ws.Server({server:app}),
	userList = {},
	uidIdx = 0,
	userCount = 0;

console.log('websocket server run at port ', process.env.PORT);

wss.on('connection', function onWebsocketConnect(conn) {

	var key = conn.upgradeReq.headers['sec-websocket-key'],
		uid = '';

	console.log("conn", key);

	conn.on('message', function onWebsocketMessage(str) {
		var data = JSON.parse(str);
        
        switch(data.type) {
            case "ONLI":
                addUser(key, {
                    uid: uidIdx - 1,
                    uname: data.data.uname,
                    uavatar: data.data.uavatar
                });
                sendToClient(key, JSON.stringify({
                    type: "INIT",
                    uid: uidIdx - 1,
                    value: userCount
                }));
                sendToAll(JSON.stringify({
                    type: "ONLI",
                    data: {
                        unum: userCount,
                        uname: data.data.uname,
                        uavatar: data.data.uavatar
                    }
                }))
                break;
            case "OFFL":
                removeUser(key);
            default:
                // 广播给所有用户
                sendToAll(str);
                break;
        }
	});

	conn.on('error', function onWebsocketError() {
		console.log('onError', key);
	});

	conn.on('close', function onWebsocketClose() {
		sendToAll('{"type":"OFFL", "uid":' + userList[key].uid);
		removeUser(key);

		console.log('close', key);
	});

	function addUser(key, userInfo) {
		userCount++;
		// 一直增加
		uidIdx++;
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
