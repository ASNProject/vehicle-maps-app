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

// Contoh data
const historyData = [
    { ban: "FL", status: "BAGUS", tekanan: 32, time: "10:30 01-12-2025" },
    { ban: "FR", status: "PERLU CEK", tekanan: 28, time: "10:31 01-12-2025" },
    { ban: "RL", status: "BAGUS", tekanan: 33, time: "10:32 01-12-2025" },
    { ban: "RR", status: "RUSAK", tekanan: 25, time: "10:33 01-12-2025" },
    { ban: "FL", status: "BAGUS", tekanan: 31, time: "11:00 01-12-2025" },
    { ban: "FR", status: "BAGUS", tekanan: 30, time: "11:01 01-12-2025" },
    { ban: "RL", status: "PERLU CEK", tekanan: 29, time: "11:02 01-12-2025" },
    { ban: "RR", status: "BAGUS", tekanan: 32, time: "11:03 01-12-2025" },
];

let currentPage = 1;
const rowsPerPage = 10;

function renderTable() {
    const tbody = document.querySelector("#history-table tbody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = historyData.slice(start, end);

    pageData.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.ban}</td>
            <td>${item.status}</td>
            <td>${item.tekanan}</td>
            <td>${item.time}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("page-info").textContent = `${currentPage} / ${Math.ceil(historyData.length / rowsPerPage)}`;
}

// Pagination
document.getElementById("prev-page").addEventListener("click", () => {
    if(currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById("next-page").addEventListener("click", () => {
    if(currentPage < Math.ceil(historyData.length / rowsPerPage)) {
        currentPage++;
        renderTable();
    }
});

// Export ke Excel (CSV)
document.getElementById("export-btn").addEventListener("click", () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Ban,Status,Tekanan,Waktu\n";
    historyData.forEach(item => {
        csvContent += `${item.ban},${item.status},${item.tekanan},${item.time}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "history_tekanan_ban.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Render awal
renderTable();