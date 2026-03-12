const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vThK41-mH0cCLqg5AI3A3Ri83cHL2SNov6BNMJrKqme-DPGd9NlrP9OcBnsuUjs8xJ43lGePyClme9t/pub?gid=1764720513&single=true&output=csv"; 

let myChart;

// Heart trail on move
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.15) return;
    const h = document.createElement('div');
    h.style.position = 'fixed';
    h.innerHTML = '💖';
    h.style.left = e.clientX + 'px';
    h.style.top = e.clientY + 'px';
    h.style.fontSize = '15px';
    h.style.pointerEvents = 'none';
    h.style.animation = 'fadeUp 1s forwards';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1000);
});

async function fetchData() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvText = await response.text();
        const rows = csvText.split(/\r?\n/).filter(row => row.trim() !== "");
        const dataRows = rows.slice(1); 

        const tableBody = document.getElementById('transaction-table');
        tableBody.innerHTML = "";
        let totalMasuk = 0;
        let totalKeluar = 0;

        dataRows.forEach(row => {
            const cols = row.split(',').map(c => c.replace(/"/g, '').trim());
            const [tanggal, kategori, nominalRaw, keterangan] = [cols[5], cols[6], cols[7], cols[8]];

            if (!tanggal || tanggal === "Tanggal" || !kategori) return;

            const num = parseInt(nominalRaw.replace(/[^0-9]/g, '')) || 0;

            if (num > 0) {
                const isMasuk = kategori.toLowerCase().includes("masuk");
                isMasuk ? totalMasuk += num : totalKeluar += num;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${tanggal.substring(0, 6)}</td>
                    <td style="color: ${isMasuk ? '#6B8E23' : '#CD5C5C'}; font-weight: bold;">${kategori.substring(0, 3)}</td>
                    <td>Rp ${num.toLocaleString('id-ID')}</td>
                    <td>${keterangan || "✨🦋"}</td>
                `;
                tableBody.appendChild(tr);
            }
        });

        const sisa = totalMasuk - totalKeluar;
        document.getElementById('total-masuk').innerText = `Rp ${totalMasuk.toLocaleString('id-ID')}`;
        document.getElementById('total-keluar').innerText = `Rp ${totalKeluar.toLocaleString('id-ID')}`;
        document.getElementById('sisa-saldo').innerText = `Rp ${sisa.toLocaleString('id-ID')}`;

        renderChart(sisa, totalKeluar);
    } catch (e) { console.error(e); }
}

function renderChart(sisa, keluar) {
    const ctx = document.getElementById('financeChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Sisa', 'Keluar'],
            datasets: [{
                data: [sisa, keluar],
                backgroundColor: ['#FCF4A3', '#B8D1E6'],
                borderColor: '#FFFFFF',
                borderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { family: 'Quicksand', weight: 'bold' } } } }
        }
    });
}

window.onload = fetchData;