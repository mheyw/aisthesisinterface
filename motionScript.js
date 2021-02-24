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
    let rotateDegrees = event.alpha;
    // gamma: left to right
    let leftToRight = event.gamma;
    // beta: front back motion
    let frontToBack = event.beta;

    handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
}, true);
}

function handleOrientationEvent(frontToBack, leftToRight, rotateDegrees) {
    IO_obj.moBeta = frontToBack;
    IO_obj.moGamma = leftToRight;
    IO_obj.moAlpha = rotateDegrees;
};