var videoBtn = document.getElementById("video-btn"),
	isVideoOpen = false;

rtc.connect('ws://106.187.96.242:8001');

rtc.on('add remote stream', function(stream){
	console.log("add remote stream");
	rtc.attachStream(stream, 'video');
});

videoBtn.addEventListener('click', function() {
	if (isVideoOpen) {
		console.log("is open and turn off");
		isVideoOpen = false;
		videoBtn.value = "打开视频";
		console.log("value", videoBtn.value);
		cameraOff();
	} else {
		console.log("is close and turn on");
		isVideoOpen = true;
		videoBtn.value = "关闭视频";
		console.log("value", videoBtn.value);
		cameraReq();
	}
});

function cameraReq() {
	console.log("camera request");
	rtc.createStream({"video": true, "audio":true}, function(stream){
		rtc.attachStream(stream, 'video');
	});
}

function cameraOff() {
	video.src = "";
}