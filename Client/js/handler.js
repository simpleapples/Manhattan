/*
 * @method 接收到消息的消息处理函数
 * @param {Object} data 服务器发送的json格式消息
 * */
function msgHandler(data) {
    var msg = JSON.parse(data) || {};

    if (msg.uid == urlMsg.uid)  {
        switch(msg.type) {
        	case "USLE":
                getUserCountHandler(msg.value);
                break;
            default:
                break;
        }
    } else {
    	switch(msg.type) {
            case "ONLI":
                clientOnlineHandler();
                break;
            case "OFFL":
                clientOfflineHandler();
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
    var userInfo = '{"uid": '+ urlMsg.uid +', "uname": "' + urlMsg.uname +
        '", "urole": ' + urlMsg.urole + ', "uavatar": "'+ urlMsg.uavatar +'"}';
    console.log(userInfo);
    serverService.send("ONLI", urlMsg.uid, userInfo);
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
 * @method 获取最新的在线人数列表
 * @param {int} value 在线的人数
 * */
function getUserCountHandler(value) {
    var showNum = $("#online-num");
    console.log("vlaue is:" + value);
    console.log("showNum:" + showNum);
    showNum.html(value + "人在线");
}

/*
 * @method 增加在线人数
 * */
function clientOnlineHandler() {
    var showNum = $("#online-num");
    var _now = showNum.html().replace("人在线", "") * 1;
    _now += 1;
    showNum.html(_now + "人在线");
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
