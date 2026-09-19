let map;
let marker;

let watchID;
let timer;

let running = false;

let distance = 0;
let lastPosition = null;
let startTime;


// Create the map
map = L.map("map").setView([20.5937, 78.9629], 5);


// Add OpenStreetMap
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap"
    }
).addTo(map);


// Calculate distance between two locations
function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}


// Start Run
function startRun() {

    running = true;

    distance = 0;
    lastPosition = null;

    document.getElementById("distance").innerText = "0.00";

    startTime = Date.now();


    // Start timer
    timer = setInterval(function() {

        let seconds =
            Math.floor((Date.now() - startTime) / 1000);

        let minutes = Math.floor(seconds / 60);

        seconds = seconds % 60;

        document.getElementById("time").innerText =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

    }, 1000);


    // Start GPS
    watchID = navigator.geolocation.watchPosition(

        function(position) {

            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            // Move map to current location
            map.setView([lat, lon], 18);


            // Create marker
            if (marker == null) {

                marker = L.marker([lat, lon])
                    .addTo(map);

            }
            else {

                marker.setLatLng([lat, lon]);

            }


            // Calculate distance
            if (lastPosition != null) {

                let newDistance = calculateDistance(
                    lastPosition[0],
                    lastPosition[1],
                    lat,
                    lon
                );

                distance = distance + newDistance;

                document.getElementById("distance").innerText =
                    distance.toFixed(2);
            }


            // Save current location
            lastPosition = [lat, lon];

        }

    );
}

function stopRun() {
    running = false;
    navigator.geolocation.clearWatch(watchID);
    clearInterval(timer);
    alert(
        "Run completed!\nDistance: " +
        distance.toFixed(2) +
        " km"
    );
}