/*
 * @method 接收到消息的消息处理函数
 * @param {Object} data 服务器发送的json格式消息
 * */
function msgHandler(data) {
    var msg = JSON.parse(data) || {};

    switch(msg.type) {
        // 初始化用户id
        case "INIT":
            user.uid = msg.uid;
            break;
        case "ONLI":
            clientOnlineHandler(msg.data);
            break;
        case "OFFL":
            clientOfflineHandler();
            break;
        case "CHAT":
            chatHandler(msg.data);
            break;
        case "DRLI":
            if (msg.data.uid !== user.uid)
                drawLineHandler(msg.data.pos);
            break;
        case "DRMV":
            if (msg.data.uid !== user.uid)
                drawMoveHandler(msg.data.pos);
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

/*与服务器链接上的处理函数*/
function connHandler() {
    serverService.send("ONLI", user);
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
function getUserListHandler(value) {
    /*
    console.log(msg);
    var msg = JSON.parse(msg) || {},
    */
    //var showNum = $("a.online-title");
    //showNum.html(value + "人在线");
}

/*
 * @method 增加在线人数
 * */
function clientOnlineHandler(obj) {
    var showNum = $("#online-num");
    showNum.html(obj.unum + "人在线");
}

/*
 * @method 减少在线人数
 * */
function clientOfflineHandler() {
    var showNum = $("#online-num");
    var _now = showNum.html().replace("人在线", "") * 1;
    _now -= 1;
    showNum.html(_now + "人在线");
}
