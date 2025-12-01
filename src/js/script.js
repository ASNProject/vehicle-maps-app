// Copyright 2025 ariefsetyonugroho
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     https://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Initialize the map
const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let maker = null;

// TODO = Delete this function when using real API ==
// Dummy JSON object (simulasi API)
let vehicleJSON = {
    "latitude": -6.2002,
    "longitude": 106.8166
};

function fetchDummyJSON() {
    // Simulate movement: acak kecil setiap detik
    vehicleJSON.latitude += (Math.random() - 0.5) * 0.0005;
    vehicleJSON.longitude += (Math.random() - 0.5) * 0.0005;

    // Kembalikan "JSON" seperti API
    return Promise.resolve(vehicleJSON);
}
// ====================================================

const API_URL = 'dummy.json';

// Update vehicle location
function updateLocation() {
    // TODO: Replace with actual API endpoint (fetch)
    // fetch(API_URL)
    fetchDummyJSON()
    // TODO: Uncomment the line below when using real API
        // .then(response => response.json())
        .then(data => {
            const lat = data.latitude;
            const lon = data.longitude;

            if (maker) {
                maker.setLatLng([lat, lon]);
            } else {
                maker = L.marker([lat, lon]).addTo(map);
                map.setView([lat, lon], 16);
            }
        })
        .catch(error => console.error('Error fetching vehicle data:', error));
}

setInterval(updateLocation, 1000);
updateLocation();