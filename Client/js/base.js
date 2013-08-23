function parseUrl(url) {
    // 找到url中的第一个?号
    var parse = url.substring(url.indexOf("?") + 1),
        params = parse.split("&"),
        len = params.length,
        i = 0,
        item = [];
        param = {};

    for (; i < len; i++) {
        item = params[i].split("=");
        param[item[0]] = item[1];
    }

    return param;
}
