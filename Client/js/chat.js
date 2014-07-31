/**
 * @author luofei
 * @date 2013-08-20
 */

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

/**
 * @method 发送消息函数
 * @param {String} str 发送的字符串
 */
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

/**
 * @method 把接收到的消息追加到容器中
 * @param {String} value 发送文本中的内容
 */
function chatHandler(obj) {
    // 获取当前消息容器的高度
    var _h = container.height(),
        _isSender = (obj.uid === user.uid ? true : false),
        _item = insertMsg(obj, _isSender),
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

/**
 * @method 把接收到的消息文本封装成展示的样式
 * @param {String} str 消息文本
 * @return {String} str 封装成html源码格式的字符串
 */
function insertMsg(o, isSender) {
    var _item = $('<div class="s-msg"></div>'),
        _con = $('<div class="r-container"></div>'),
        _txt = $('<div class="txt"></div>');

    if (isSender)
        _item.addClass('right');
    else
        _item.addClass('clearfix');

    _item.append('<a class="photo" href=""><img src="./img/left.jpg" alt="" title="' + o.uname + '"/></a>'); 
    _txt.append(replaceFace(decodeURIComponent(o.content)));
    _con.append('<div class="u-nickname">'+o.uname+'</div>').append($('<div class="txt-container"></div>').append(_txt)).append('<b class="to"></b>');
    _item.append(_con);
    return _item;
}

/**
 * @description 替换文本中真正的表情
 * @param {string} str 原文本
 * @return {object} $con 替换后的dom节点（包含文本信息）
 */
function replaceFace(str) {
    var reg = /\[[^\]]{1,4}\]/g,
        _m = str.match(reg) || [],
        _a = str.split(reg) || [],
        $con = $('<div>');

    for (var i = 0, _c, len = _a.length; i < len; i++) {
        // 第一步：拼装聊天文本
        $con.append($('<span>').text(_a[i]));
        // 第二步：拼装表情
        if (_m[i]) {
            _c = searchFaceList(_m[i]);
            if (_c)
                $con.append(['<img src="', _c.icon, '">'].join(''));
            else
                $con.append($('<span>').text(_m[i]));
        }
    }

    return $con;
}

/**
 * @description 从表情列表中查找目标字符串是否存在
 * @param {string} sor 目标字符串
 * @return {object} _r 找到后的结果
 */
function searchFaceList(sor) {
    for (var i = 0, tmp, len = faces_list.length; i < len; i++) {
        tmp = faces_list[i];
        if (tmp.value === sor)
            return tmp;
    }

    return false;
}

/**
 * @method 根据消息容器的高度自动改变滚动条的高度
 */
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

/**
 * @method 为滚动条绑定滚动事件
 */
containerMask.bind('mousewheel DOMMouseScroll', function(e) {
    var _diff = (e.originalEvent.wheelDelta > 0) ? -30 : 30,
        _top = scrollbar.css('top').replace('px', '') * 1;

    _diff = _top + _diff;

    if (container.height() > $(this).height())
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

/**
 * 给滚动条添加点击和拖动事件
 */
scrollbar.bind("mousedown", function(e) {
    e.stopPropagation = true;
    isDrag = true;
    pos.y = e.clientY;
});

document.onselectstart = function() {
    return !isDrag;
}

/**
 * document 上绑定鼠标的移动事件
 */
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

/**
 * document 上绑定鼠标的抬起事件
 */
$(document).bind("mouseup", function(e) {
    e.stopPropagation = true;
    isDrag = false;
});

$('div.online-list a').on('click', function() {
    $('div.u-list').toggle();
    return false;
});

$('div.u-list').on('click', function() {
    return false;
});

$(document).on('click', function(e) {
    var _t = e.srcElement ? e.srcElement : e.target,
        _node;

    if (e.className !== 'u-list') {
        _node = $('div.u-list');
        if (_node.css('display') === 'block')
            _node.hide();
    }
});

// 清屏事件的处理
$('.chat-container').hover(function() {
    $('.clear-ct').toggle();
});
$('.clear-ct').on('click', function() {
    var $mc = $('.message-container'),
        // 滚动条实体
        $sobar = $('.scroller-container');

    $mc.empty().css('top', 0);
    $sobar.hide();
});

// 表情插件相关
$('#face-icon').on('click', function() {
    var _off = $(this).offset(),
        $con = $('.chat-face');

    if ($con.css('display') === "none") {
        $con.css({
            left: _off.left + $(this).outerWidth() / 2 - $con.outerWidth() / 2 - 8,
            top: _off.top - 250 - 8
        }).show();
    } else {
        $con.hide();
    }

    return false;
});

// 表情后台加载
$(function() {
    $face = $('.chat-face'),tmp = "";

    for (var i = 0, len = faces_list.length; i < len; i++) {
        tmp = "<img src='" + faces_list[i].icon + "' alt='" + faces_list[i].value.replace(/[\[\]]/g, '') + "' title='" + faces_list[i].value.replace(/[\[\]]/g, '') + "'>";

        $face.append(tmp);
        tmp = "";
    }
});

var faceBtn = $('.chat-face');

// 表情事件相关
faceBtn.on('click', function(e) {
    // 取得表情
    var _t = e.srcElement ? e.srcElement : e.target;
    if (_t.nodeName.toLocaleLowerCase() === "img") {
        txt.val(txt.val() + '[' + $(_t).attr('alt') + ']');
        faceBtn.hide();
    }

    // 阻止事件冒泡
    return false;
});
$(document).on('click', function() {
    faceBtn.hide();
});
