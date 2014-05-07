//var url = 'ws://manhattan-c9-luofei2011.c9.io',
var url = 'ws://localhost:8888',
    ws = new WebSocket(url),
	serverService = {
        connect : function (connHandler, msgHandler, closeHandler) {
			ws.onopen = function () {
				connHandler();
			};
			
			ws.onmessage = function (msg) {
                //console.log('response', msg);
				msgHandler(msg.data);
			};
			
			ws.onclose = function () {
				closeHandler();
			};
		},
		
		send : function (type, info) {
			ws.send(JSON.stringify({
                type: type,
                data: info
            }));
		}
	};
