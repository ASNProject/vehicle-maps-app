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

const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let maker = null;

// const API_URL = 'https://api.tirepressure.my.id/api/tire-pressure';

// Update vehicle location + UI pressure info
function updateLocation() {
    fetch(API_URL)
        .then(response => response.json())
        .then(json => {
            const list = json.data.data;

            if (!Array.isArray(list) || list.length === 0) {
                console.warn("Tidak ada data kendaraan. Tunggu data masuk...");
                return;
            }

            const v = list[0]; // Ambil data pertama

            console.log("API result:", v);

            // ========================
            // UPDATE MAP
            // ========================

            if (!v.latitude || !v.longitude) {
                console.error("Data kendaraan tidak punya lat/lon:", v);
                return;
            }

            const lat = v.latitude;
            const lon = v.longitude;

            if (maker) {
                maker.setLatLng([lat, lon]);
            } else {
                maker = L.marker([lat, lon]).addTo(map);
                map.setView([lat, lon], 16);
            }

            // ========================
            // UPDATE TEKANAN BAN
            // ========================

            document.querySelector(".pressure-box.fl span").textContent = v.front_left + " PSI";
            document.querySelector(".pressure-box.rl span").textContent = v.rear_left + " PSI";
            document.querySelector(".pressure-box.rr span").textContent = v.rear_right + " PSI";

            // Kelas FR kamu salah, diganti jadi pressure-box fr
            const frBox = document.querySelector(".pressure-box.fr-text-mismatch span");
            if (frBox) frBox.textContent = v.front_right + " PSI";

            // ========================
            // UPDATE STATUS BAN
            // ========================

            document.querySelector(".fl-status span").textContent = v.status_front_left;
            document.querySelector(".fr-status span").textContent = v.status_front_right;
            document.querySelector(".rl-status span").textContent = v.status_rear_left;
            document.querySelector(".rr-status span").textContent = v.status_rear_right;

            // ========================
            // UPDATE SPEED
            // ========================

            document.querySelector(".speed-number").textContent = v.speed;

        })
        .catch(error => console.error('Error fetching vehicle data:', error));
}

setInterval(updateLocation, 1000);
updateLocation();
