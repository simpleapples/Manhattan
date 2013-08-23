var drawCanvas = document.getElementById("ppt"),
    drawContext = drawCanvas.getContext('2d'),
    isDrawing = false,
    canvasRect = canvas.getBoundingClientRect();

drawCanvas.onmousedown = function (e) {
    isDrawing = true;
    drawContext.beginPath();
    drawContext.strokeStyle = "red"; 
    drawContext.lineWidth = 2;
    drawContext.moveTo(e.pageX - canvasRect.left, e.pageY - canvasRect.top);
    serverService.send("DRMV", uid, '{"x":' + (e.pageX - canvasRect.left) + ', "y":' + (e.pageY - canvasRect.top) + '}');
    console.log("canvas down", e.pageX - canvasRect.left, e.pageY - canvasRect.top);
}

drawCanvas.onmouseup = function (e) {
    isDrawing = false;
    drawContext.closePath();
    console.log("canvas up", e.pageX - canvasRect.left, e.pageY - canvasRect.top);			
}

drawCanvas.onmousemove = function (e) {
    if (isDrawing) {
        drawContext.lineTo(e.pageX - canvasRect.left, e.pageY - canvasRect.top);
        drawContext.stroke();
        serverService.send("DRLI", uid, '{"x":' + (e.pageX - canvasRect.left) + ', "y":' + (e.pageY - canvasRect.top) + '}');
        console.log("canvas move", e.pageX - canvasRect.left, e.pageY - canvasRect.top);
    }
}

function drawLineHandler(x, y) {
    drawContext.lineTo(x, y);
    drawContext.stroke();
    console.log("draw line handler", x, y);
}

function drawMoveHandler(x, y) {
    drawContext.beginPath();
    drawContext.strokeStyle = "red"; 
    drawContext.lineWidth = 2;
    drawContext.moveTo(x, y); 
    console.log("draw move handler", x, y);
}

function drawCleanHandler() {
    drawContext.clearRect(0, 0, canvas.width, canvas.height);
}
