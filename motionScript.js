document.querySelector('#motion--access').addEventListener('click', requestDeviceOrientation);

function motionRequest(){
        DeviceOrientationEvent.requestPermission();
        document.getElementById("#motion--access").outerHTML = "";
}

function requestDeviceOrientation () {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
  DeviceOrientationEvent.requestPermission()
  .then(permissionState => {
  if (permissionState === 'granted') {
  processMotionData();
  }
  })
  .catch(console.error);
  } else {
  // handle regular non iOS 13+ devices
  processMotionData();
  }
}
function processMotionData(){ 
window.addEventListener("deviceorientation", function(event) {
    // alpha: rotation around z-axis
    let _alpha = event.alpha;
    // gamma: left to right
    let _gamma = event.gamma;
    // beta: front back motion
    let _beta = event.beta;

    IO_obj.moAlpha = _alpha;
    IO_obj.moBeta = _beta;
    IO_obj.moGamma = _gamma;
}, true);
}