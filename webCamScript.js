// Define constants
const cameraView = document.querySelector("#camera--view"),
      cameraOutput = document.querySelector("#camera--output"),
      cameraSensor = document.querySelector("#camera--sensor"),
      cameraTrigger = document.querySelector("#camera--trigger"),
      cameraAccess = document.querySelector("#camera--access");

let currentStream;

function stopMediaTracks(stream) {
    stream.getTracks().forEach(track => {
        track.stop();
    });
}

function cameraStart() {
    if (typeof currentStream !== 'undefined') {
        stopMediaTracks(currentStream);
    }
    const videoConstraints = {};
    videoConstraints.facingMode = 'environment' || 'user';
    const constraints = {
        video: videoConstraints,
        audio: false
    };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
        currentStream = stream;
        cameraView.srcObject = stream;
        return navigator.mediaDevices.enumerateDevices();
    })
        .catch(error => {
        console.error(error);
    });
};
//get date
let current = new Date();

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/png");
    IO_obj.camImg = cameraOutput.src;
    cameraOutput.classList.add("taken");

    let Latitude = IO_obj.gpsLat.toFixed(2);
    let Longitude = IO_obj.gpsLong.toFixed(2);
    let Z = IO_obj.moAlpha.toFixed(0);
    let X = IO_obj.moGamma.toFixed(0);
    let Y = IO_obj.moBeta.toFixed(0);;
    let Time = current.toLocaleTimeString();
    let img = IO_obj.camImg;
    $.ajax({
        type    : "POST",
        url     : "https://mothra.club",
        data    : {'Latitude': Latitude,'Longitude': Longitude ,'Z':Z,'X':X,'Y': Y, 'Time': Time, 'Img': img},
        success: function(data){
            console.log(data);
        },
        error: function(xhr, status, error) {
            console.log(xhr);
            console.log(status);
            console.log(error);
        }
    });
};

cameraAccess.onclick = function(){
    if (typeof currentStream !== 'undefined') {
        stopMediaTracks(currentStream);
    }
    const videoConstraints = {};
    videoConstraints.facingMode = 'environment' || 'user';
    const constraints = {
        video: videoConstraints,
        audio: false
    };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
        currentStream = stream;
        cameraView.srcObject = stream;
        document.getElementById("camera--access").style.display = "none";
        return navigator.mediaDevices.enumerateDevices();
    })
        .catch(error => {
        console.log("Permission Denied By User!");
    });
};