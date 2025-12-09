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

// const API_URL = "https://api.tirepressure.my.id/api/tire-pressure";

let lastVehicleData = null; // simpan data API terakhir

async function loadTable() {
    try {
        const response = await fetch(`${API_URL}/tire-pressure`);
        const json = await response.json();

        const vehicle = json.data.data[0]; 
        lastVehicleData = vehicle; // simpan untuk export

        const tbody = document.querySelector("#history-table tbody");
        tbody.innerHTML = "";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${vehicle.front_left}</td>
            <td>${vehicle.status_front_left}</td>

            <td>${vehicle.front_right}</td>
            <td>${vehicle.status_front_right}</td>

            <td>${vehicle.rear_left}</td>
            <td>${vehicle.status_rear_left}</td>

            <td>${vehicle.rear_right}</td>
            <td>${vehicle.status_rear_right}</td>

            <td>${vehicle.speed} Km/h</td>
            <td>${formatTime(vehicle.created_at)}</td>
        `;

        tbody.appendChild(tr);

    } catch (error) {
        console.error("Gagal load data:", error);
    }
}

function formatTime(time) {
    const d = new Date(time);
    return `${d.toLocaleTimeString()} - ${d.toLocaleDateString()}`;
}

loadTable();


// =========================
// EXPORT CSV PERBAIKAN
// =========================
document.getElementById("export-btn").addEventListener("click", () => {
    if (!lastVehicleData) {
        alert("Data belum dimuat, coba beberapa detik lagi...");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Ban,Status,Tekanan,Speed,Waktu\n";

    csvContent += `FL,${lastVehicleData.status_front_left},${lastVehicleData.front_left},${lastVehicleData.speed},${formatTime(lastVehicleData.created_at)}\n`;
    csvContent += `FR,${lastVehicleData.status_front_right},${lastVehicleData.front_right},${lastVehicleData.speed},${formatTime(lastVehicleData.created_at)}\n`;
    csvContent += `RL,${lastVehicleData.status_rear_left},${lastVehicleData.rear_left},${lastVehicleData.speed},${formatTime(lastVehicleData.created_at)}\n`;
    csvContent += `RR,${lastVehicleData.status_rear_right},${lastVehicleData.rear_right},${lastVehicleData.speed},${formatTime(lastVehicleData.created_at)}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "history_tekanan_ban.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById("delete-all-btn").addEventListener("click", async () => {
    if (!confirm("Yakin ingin menghapus semua data history?")) return;

    try {
        const response = await fetch(API_URL + "/history/truncate", {
            method: "DELETE"
        });

        const result = await response.json();

        if (result.success) {
            alert("Semua data berhasil dihapus!");
            loadHistory(); // refresh tabel
        } else {
            alert("Gagal menghapus data!");
        }
    } catch (err) {
        console.error(err);
        alert("Terjadi error saat menghapus data.");
    }
});


