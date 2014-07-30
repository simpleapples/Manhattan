var http = require('http'),
	//app = http.createServer().listen(process.env.PORT, process.env.IP),
	app = http.createServer().listen('8222'),
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({server:app}),
    //wss = new ws.Server({server:app}),
	userList = {},
	uidIdx = 0,
	userCount = 0,
    uname = require('./lib/uname');

//console.log('websocket server run at port ', process.env.PORT);
console.log('websocket server run at port ', '8222');

wss.on('connection', function onWebsocketConnect(conn) {

	var key = conn.upgradeReq.headers['sec-websocket-key'],
		uid = '';

	console.log("conn", key);

	conn.on('message', function onWebsocketMessage(str) {
		var data = JSON.parse(str), tmp;
        
        switch(data.type) {
            case "ONLI":
                var name = getRandomName();
                addUser(key, {
                    uid: uidIdx,
                    uname: name,
                    uavatar: data.data.uavatar
                });
                sendToClient(key, JSON.stringify({
                    type: "INIT",
                    uid: uidIdx,
                    uname: name,
                    value: userCount
                }));
                sendToAll(JSON.stringify({
                    type: "ONLI",
                    data: {
                        ulist: getUserList(),
                        //uname: data.data.uname,
                        uname: name,
                        uavatar: data.data.uavatar
                    }
                }))
                break;
            case "OFFL":
                tmp = {
                    type: 'OFFL',
                    uid: userList[key].uid
                };
                removeUser(key);
                tmp.ulist = getUserList();
                sendToAll(JSON.stringify(tmp));
                break;
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
        var tmp = {
            type: 'OFFL',
            uid: userList[key].uid
        };
		removeUser(key);
        tmp.ulist = getUserList();
        sendToAll(JSON.stringify(tmp));

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

    function getUserList() {
        var _re = [];
        for (var o in userList) {
            if (userList.hasOwnProperty(o))
                _re.push(userList[o]);
        }

        return _re;
    }

	function sendToClient(client, obj) {
		var i;
		for (i = wss.clients.length - 1; i >= 0; i--) {
			if (wss.clients[i].upgradeReq.headers['sec-websocket-key'] === client) {
				wss.clients[i].send(obj);
				break;
			}
		};
	}

	function sendToAll(obj) {
		var i;
		for (i = wss.clients.length - 1; i >= 0; i--) {
			wss.clients[i].send(obj);
		};
	}

    function getRandomName() {
        var _r = Math.floor(Math.random() * 400);
        // TODO 当用户超过400以后会存在BUG
        while(uname.usedList[_r]) {
            _r++;
            if (_r >= 400) {
                _r = 0;
            }
        }
        uname.usedList[_r] = true;
        return uname.nameList[_r];
    }

});
