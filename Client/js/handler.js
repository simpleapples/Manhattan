/*
 * @method 接收到消息的消息处理函数
 * @param {Object} data 服务器发送的json格式消息
 * */
function msgHandler(data) {
    var msg = JSON.parse(data) || {};

    if (msg.uid != uid)  {
        switch(msg.type) {
            case "ONLI":
                break;
            case "OFFL":
                break;
            case "CHAT":
                chatHandler(msg.value);
                break;
            case "DRLI":
                drawLineHandler(msg.value.x, msg.value.y);
                break;
            case "DRMV":
                drawMoveHandler(msg.value.x, msg.value.y);
                break;
            case "DRCL":
                drawCleanHandler();
                break;
            case "GONX":
                goNext();
                break;
            case "GOPV":
                goPrevious();
                break;
            case "USLI":
            	getUserListHandler(msg.value);
            	break;
            default:
                break;
        }
    }
}

/*与服务器链接上的处理函数*/
function connHandler() {
    serverService.send("ONLI", uid);
    console.log("connected!");
}

/*
 * @method 链接关闭触发的函数
 * */
function closeHandler() {
    console.log("close!");
}

/*
 * @method 获取用户列表
 * */
function getUserListHandler(msg) {
}
