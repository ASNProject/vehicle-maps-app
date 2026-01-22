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

        const vehicles = json.data.data; 
        lastVehicleData = vehicles; // simpan untuk export

        const tbody = document.querySelector("#history-table tbody");
        tbody.innerHTML = "";

       vehicles.forEach(vehicle => {
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
        });

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
    if (!lastVehicleData || lastVehicleData.length === 0) {
        alert("Data belum dimuat atau kosong!");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "FL,Status FL,FR,Status FR,RL,Status RL,RR,Status RR,Speed,Waktu\n";

    lastVehicleData.forEach(vehicle => {
        csvContent += `
${vehicle.front_left},${vehicle.status_front_left},
${vehicle.front_right},${vehicle.status_front_right},
${vehicle.rear_left},${vehicle.status_rear_left},
${vehicle.rear_right},${vehicle.status_rear_right},
${vehicle.speed},
${formatTime(vehicle.created_at)}
`.replace(/\n/g, "");
        csvContent += "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "history_tekanan_ban.csv";
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


