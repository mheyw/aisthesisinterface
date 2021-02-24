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

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/png");
    IO_obj.camImg = cameraOutput.src;
    cameraOutput.classList.add("taken");
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
        console.error(error);
    });
};