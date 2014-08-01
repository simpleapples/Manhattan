var drawCanvas = document.getElementById("ppt"),
    drawContext = drawCanvas.getContext('2d'),
    isDrawing = false,
    lineWidth = 2,
    canvasRect = drawCanvas.getBoundingClientRect();

drawCanvas.onmousedown = function (e) {
    isDrawing = true;
    drawContext.beginPath();
    drawContext.strokeStyle = "red"; 
    drawContext.lineWidth = lineWidth;
    drawContext.moveTo(e.pageX - canvasRect.left, e.pageY - canvasRect.top + 30);
    serverService.send("DRMV", {
        uid: user.uid, 
        pos: {
            x: e.pageX - canvasRect.left, 
            y: e.pageY - canvasRect.top + 30
        }
    });
    console.log("canvas down", e.pageX - canvasRect.left, e.pageY - canvasRect.top + 30);
}

drawCanvas.onmouseup = function (e) {
    isDrawing = false;
    drawContext.closePath();
    console.log("canvas up", e.pageX - canvasRect.left, e.pageY - canvasRect.top + 30);
}

drawCanvas.onmousemove = function (e) {
    if (isDrawing) {
        drawContext.lineTo(e.pageX - canvasRect.left, e.pageY - canvasRect.top + 30);
        drawContext.stroke();
        serverService.send("DRLI", {
            uid: user.uid, 
            pos: {
                x: e.pageX - canvasRect.left,
                y: e.pageY - canvasRect.top + 30
            }
        });
        console.log("canvas move", e.pageX - canvasRect.left, e.pageY - canvasRect.top + 30);
    }
}

function drawLineHandler(pos) {
    drawContext.lineTo(pos.x, pos.y);
    drawContext.stroke();
    console.log("draw line handler", pos.x, pos.y);
}

function drawMoveHandler(pos) {
    drawContext.beginPath();
    drawContext.strokeStyle = "red"; 
    drawContext.lineWidth = 2;
    drawContext.moveTo(pos.x, pos.y); 
    console.log("draw move handler", pos.x, pos.y);
}

function drawCleanHandler() {
    drawContext.clearRect(0, 0, canvas.width, canvas.height);
}

// 下载图片功能
$('.pic-import').on('click', function() {
    // 替换BASE64的图像数据，然后通过URL进行下载
    var _dImage = drawCanvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
    //window.location.href = _dImage;

    var $_a = $(this).find('a');

    $_a.attr('download', 'download_' + (+ new Date()) + '.png');

    $_a.attr('href', _dImage);
});
