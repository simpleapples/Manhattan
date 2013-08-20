var canvas = document.getElementById("ppt"),
    context = canvas.getContext('2d'),
    isDrawing = false,
    canvasRect = canvas.getBoundingClientRect();

canvas.onmousedown = function (e) {
    isDrawing = true;
    context.beginPath();
    context.strokeStyle = "red"; 
    context.lineWidth = 2;
    context.moveTo(e.pageX - canvasRect.left, e.pageY - canvasRect.top);
    serverService.send("DRMV", uid, '{"x":' + (e.pageX - canvasRect.left) + ', "y":' + (e.pageY - canvasRect.top) + '}');
    console.log("canvas down", e.pageX - canvasRect.left, e.pageY - canvasRect.top);
}

canvas.onmouseup = function (e) {
    isDrawing = false;
    context.closePath();
    console.log("canvas up", e.pageX - canvasRect.left, e.pageY - canvasRect.top);			
}

canvas.onmousemove = function (e) {
    if (isDrawing) {
        context.lineTo(e.pageX - canvasRect.left, e.pageY - canvasRect.top);
        context.stroke();
        serverService.send("DRLI", uid, '{"x":' + (e.pageX - canvasRect.left) + ', "y":' + (e.pageY - canvasRect.top) + '}');
        console.log("canvas move", e.pageX - canvasRect.left, e.pageY - canvasRect.top);
    }
}

function drawLineHandler(x, y) {
    context.lineTo(x, y);
    context.stroke();
    console.log("draw line handler", x, y);
}

function drawMoveHandler(x, y) {
    context.beginPath();
    context.strokeStyle = "red"; 
    context.lineWidth = 2;
    context.moveTo(x, y); 
    console.log("draw move handler", x, y);
}

function drawCleanHandler() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
