var url = 'ws://192.168.0.46:8000',
    ws = new WebSocket(url),
    serverService = {
        connect : function (connHandler, msgHandler, closeHandler) {

            ws.onopen = function () {
                connHandler();
            };

            ws.onmessage = function () {
                msgHandler();
            }

            ws.onclose = function () {
                closeHandler();
            }
        },

        send : function (msg) {
            ws.send(msg);
        }
    };
