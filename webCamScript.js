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

// *********** Upload file to Cloudinary ******************** //
function uploadFile(file) {
  var url = `https://api.cloudinary.com/v1_1/dbl3jetzn/upload`;
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  // Reset the upload progress bar
   document.getElementById('progress').style.width = 0;
  
  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function(e) {
    var progress = Math.round((e.loaded * 100.0) / e.total);
    document.getElementById('progress').style.width = progress + "%";

    console.log(`fileuploadprogress data.loaded: ${e.loaded},
  data.total: ${e.total}`);
  });

  xhr.onreadystatechange = function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // File uploaded successfully
      var response = JSON.parse(xhr.responseText);
      // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
      var url = response.secure_url;
      // Create a thumbnail of the uploaded image, with 150px width
      var tokens = url.split('/');
      tokens.splice(-2, 0, 'w_150,c_scale');
      var img = new Image(); // HTML5 Constructor
      img.src = tokens.join('/');
      img.alt = response.public_id;
      console.log(img);
    }
  };

  fd.append('upload_preset', 'dundtgidc');
  fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
  fd.append('file', file);
  xhr.send(fd);
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/png");
    IO_obj.camImg = cameraOutput.src;
    cameraOutput.classList.add("taken");

    uploadFile(IO_obj);

    let Latitude = IO_obj.gpsLat.toFixed(2);
    let Longitude = IO_obj.gpsLong.toFixed(2);
    let Z = IO_obj.moAlpha.toFixed(0);
    let X = IO_obj.moGamma.toFixed(0);
    let Y = IO_obj.moBeta.toFixed(0);;
    let Time = current.toLocaleTimeString();
    let ImgRef = ""
    $.ajax({
        type    : "POST",
        url     : "https://mothra.club",
        data    : {'Latitude': Latitude,'Longitude': Longitude ,'Z':Z,'X':X,'Y': Y, 'Time': Time, 'ImgRef': ImgRef},
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