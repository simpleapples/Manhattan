var url = 'ws://106.187.96.242:8000',
    ws = new WebSocket(url),
    serverService = {
        connect : function (connHandler, msgHandler, closeHandler) {

            ws.onopen = function () {
                connHandler();
            };

            ws.onmessage = function (msg) {
                msgHandler(msg.data);
            }

            ws.onclose = function () {
                closeHandler();
            }
        },

        send : function (msg) {
            ws.send(msg);
        }
    };
