/*
 * @created at 2013-08-20
 * @author luofei
 * */

// 刚初始化的时候就对链接状态进行初始化 
serverService.connect(connHandler, msgHandler, closeHandler);

    // 发送按钮
var sendBtn = $("#send-btn"),
    // 发送文本
    txt = $("#msg"),
    // 消息容器
    container = $("div.message-container"),
    //消息事件代理器
    containerMask = $('div.message-container-mask'),
    // 滚动条容器
    scrollbarContainer = $('div.scroller-container'),
    // 滚动条部分
    scrollbar = $('div.scrollbar'),
    // 消息遮罩高度
    _height = 420,
    // 是否拖动滚动条
    isDrag = false;

sendBtn.bind('click', function() {
    sendMsg(txt.val());
});

txt.bind('keydown',function(e) {
    var keyCode = e.keyCode || e.which;

    if (keyCode == 13) {
        sendMsg(txt.val());
    }
});

/*
 * @method 发送消息函数
 * @param {String} str 发送的字符串
 * */
function sendMsg(str) {
    var content = encodeURI(str);
    if (str) {
        serverService.send("CHAT", {
            uid: user.uid,
            uname: user.uname,
            uavatar: user.uavatar,
            content: content
        });
    } else {
        txt.focus();
    }
}

/*
 * @method 把接收到的消息追加到容器中
 * @param {String} value 发送文本中的内容
 * */
function chatHandler(obj) {
    // 获取当前消息容器的高度
    var _h = container.height(),
        _isSender = (obj.uid === user.uid ? true : false),
        _item = insertMsg(obj.content, _isSender),
        _diff;

    container.append(_item);

    _diff = container.height();

    // 把最新的消息推上去
    if (_diff > _height) {
        changeScrollbarLen();
        container.stop();
        container.animate({
            top: -(_diff - _height) + "px"
        });
    }

    // 发送后清空文本并获取焦点
    txt.val('');
    txt.focus();
}

/*
 * @method 把接收到的消息文本封装成展示的样式
 * @param {String} str 消息文本
 * @return {String} str 封装成html源码格式的字符串
 * */
function insertMsg(value, isSender) {
    var _item = $('<div class="s-msg"></div>'),
        _con = $('<div class="txt-container"></div>'),
        _txt = $('<div class="txt"></div>');

    if (isSender)
        _item.addClass('right');

    _item.append('<a class="photo" href=""><img src="./img/left.jpg" alt="" title="' + user.uname + '"/></a>'); 
    _txt.text(decodeURI(value));
    _con.append(_txt).append('<b class="to"></b>');
    _item.append(_con);
    return _item;
}

/*
 * @method 根据消息容器的高度自动改变滚动条的高度
 * */
function changeScrollbarLen() {
    var _len = container.height(),
        _barLen = _height * _height / _len;

    scrollbarContainer.css("display", "block");

    scrollbar.height(_barLen);

    //scrollbar.css("top", _height - _barLen + "px");
    scrollbar.stop();
    scrollbar.animate({
        top: _height - _barLen + "px"
    });
}

/*
 * @method 为滚动条绑定滚动事件
 * */
containerMask.bind('mousewheel DOMMouseScroll', function(e) {
    var _diff = (e.originalEvent.wheelDelta > 0) ? -30 : 30,
        _top = scrollbar.css('top').replace('px', '') * 1;

    _diff = _top + _diff;

    changePositionOfBar(_diff);
});

// 防止聊天刷屏
var preventFlushScreen = false;

containerMask.bind("mouseover", function() {
    preventFlushScreen = true;
});

containerMask.bind("mouseout", function() {
    preventFlushScreen = false;
});

function changePositionOfBar(dest) {
    var _cheight = container.height(),
        _nextTop;

    if (dest < 0) 
        dest = 0;
    if (dest > _height - scrollbar.height())
        dest = _height - scrollbar.height();

    _nextTop = -(_cheight - _height) * dest / (_height - scrollbar.height());

    container.css("top", _nextTop);
    scrollbar.css("top", dest + "px");

}

// 记录位置
var pos = {};

/*
 * 给滚动条添加点击和拖动事件
 * */
scrollbar.bind("mousedown", function(e) {
    e.stopPropagation = true;
    isDrag = true;
    pos.y = e.clientY;
});

document.onselectstart = function() {
    return !isDrag;
}

/*
 * document 上绑定鼠标的移动事件
 * */
//$(document).bind("mousemove", function(e) {
document.addEventListener("mousemove", function(e) {
    //e.stopPropagation();
    var _diffY = e.clientY - pos.y;
    _diffY += scrollbar.css("top").replace("px", "") * 1;

    if (isDrag) {
        changePositionOfBar(_diffY);
    }

    pos.y = e.clientY;
}, true);

/*
 * document 上绑定鼠标的抬起事件
 * */
$(document).bind("mouseup", function(e) {
    e.stopPropagation = true;
    isDrag = false;
});
