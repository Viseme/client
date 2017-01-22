/**
 * Created by nathan on 21/1/17.
 */


/* socket */
const SOCKET_URL = "http://viseme.herokuapp.com";
var socket = io(SOCKET_URL);

socket.on("connect", function() {
    socket.emit("ping", {message: "<script>alert('xss'</script>"});
});

socket.on("ping", function (obj) {
    console.log(obj);
});


function videoController() {

        window.video = document.querySelector("#videoElement");

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({audio: true, video: true}, handleVideo, videoError);
        }

        function handleVideo(stream) {
            video.src = window.URL.createObjectURL(stream);
            audioController(stream);
        }

        function videoError(e) {
            // do something
            console.log("Stream error: " + e);
        }

}

function audioController(stream) {
    //http://stackoverflow.com/questions/16724414/microphone-activity-level-of-webrtc-mediastream
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();

    console.log(stream);

    microphone = audioContext.createMediaStreamSource(stream);
    javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    //canvasContext = $("#canvas")[0].getContext("2d");
    canvasContext = document.getElementById("amplitude-bar");
    canvasContext= canvasContext.getContext("2d");

    javascriptNode.onaudioprocess = function() {
        var array =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;

        var length = array.length;
        for (var i = 0; i < length; i++) {
            values += array[i];
        }

        var average = values / length;
        //console.log("Average amplitude: " + average);
        canvasContext.clearRect(0, 0, 60, 130);
        canvasContext.fillStyle = '#00ff00';
        canvasContext.fillRect(0,130-average,25,130);
    }
    
}

function speechReco() {
    window.voiceReco = new webkitSpeechRecognition();
    voiceReco.continuous = true;
    voiceReco.interimResults = true;

    voiceReco.onstart = function() {
        console.log("Voice recognition API started");
    }

    voiceReco.onresult = function(event) {

        var final_span = document.getElementById('final_span');
        var interim_spam = document.getElementById('interim_span');


        var interim_transcript = '';
        var final_transcript = "";

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }

        console.log(interim_transcript);
        if (final_transcript) { console.log(final_transcript);}


        /*
        final_transcript = capitalize(final_transcript);

        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);

        */

        final_transcript = final_transcript;

        final_span.innerHTML = final_transcript;
        interim_span.innerHTML = interim_transcript;


    }



    voiceReco.onerror = function(event) {

    }

    voiceReco.onend = function() {

    }
}


function setUpDrawFrames() {
    window.frameCanvas = document.createElement("canvas");
    window.frameCanvasContext = frameCanvas.getContext("2d");
    var cw = video.clientWidth;
    var ch = video.clientHeight;
    frameCanvas.width = cw;
    frameCanvas.height = ch;

    window.previewFrame = document.getElementById('preview-frame');

    draw(window.video, frameCanvasContext, cw, ch);

}




function draw(v, bc, w, h) {
    window.frameCanvasContext.drawImage(v, 0, 0, w, h);

    var stringData = window.frameCanvas.toDataURL("image/jpeg", 0.1);

    window.previewFrame.src = stringData;
    sendToServer(stringData);

    setTimeout(function() { draw(v, bc, w, h) }, 3000);
}



function sendToServer(stringData) {
    console.log(stringData);
    socket.emit("frame", {frameData: stringData});
}
videoController();
//audioController();
speechReco();
setUpDrawFrames();

voiceReco.lang = "EN-au";
voiceReco.start();

