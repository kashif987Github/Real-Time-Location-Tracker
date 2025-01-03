const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude }); // Send location to the server
        },
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 3000, // Corrected option name
            maximumAge: 0, // No caching
        }
    );
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

const marker = {};
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);

    if (marker[id]) { // Corrected conditional: Check if marker exists
        marker[id].setLatLng([latitude, longitude]);
    } else {
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => { // Corrected event name
    if (marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id]; // Remove marker reference to avoid memory leaks
    }
});
