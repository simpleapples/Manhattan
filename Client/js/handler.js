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
            user.uname = msg.uname;
            break;
        case "ONLI":
            clientOnlineHandler(msg.data);
            break;
        case "OFFL":
            clientOfflineHandler(msg.ulist);
            break;
        case "CHAT":
            chatHandler(msg.data);
            //console.log(msg.data);
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
    showNum.html(obj.ulist.length + "人在线");
    updateUserList(obj.ulist);
}

/*
 * @method 减少在线人数
 * */
function clientOfflineHandler(list) {
    var showNum = $("#online-num");
    showNum.html(list.length + "人在线");
    updateUserList(list);
}

/*
 * 更新在线人数列表
 * */
function updateUserList(list) {
    var i = 0, len = list.length,
        _tNode = $('div.u-container'),
        _src;

    _tNode.empty();
    for (; i < len; i++) {
        _src = list[i].uavatar || './img/left.jpg';
        _tNode.append('<img src="' + _src +'" title="'+ list[i].uname +'">');
    }
}
