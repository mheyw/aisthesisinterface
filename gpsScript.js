 function geoFindMe() {
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        let crd = pos.coords;

        IO_obj.gpsLat = crd.latitude;
        IO_obj.gpsLong = crd.longitude;
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        if(err.code = 1){
            document.getElementById("location--access").style.display = "none";
            IO_obj.gpsLat = 0;
            IO_obj.gpsLong = 0;
        }
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

document.querySelector('#location--access').addEventListener('click', geoFindMe);