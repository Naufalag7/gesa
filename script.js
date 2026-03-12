const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vThK41-mH0cCLqg5AI3A3Ri83cHL2SNov6BNMJrKqme-DPGd9NlrP9OcBnsuUjs8xJ43lGePyClme9t/pub?gid=1764720513&single=true&output=csv"; 

let myChart;

// --- Mouse Sparkle Trail ---
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.15) return;
    const s = document.createElement('div');
    s.className = 'sparkle-trail';
    s.innerHTML = '✨';
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1000);
});

// --- Love Counter ---
function updateLoveCounter() {
    const startDate = new Date("2025-09-09");
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('days-count').innerText = diffDays;
}

async function fetchData() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvText = await response.text();
        const rows = csvText.split(/\r?\n/).filter(row => row.trim() !== "");
        const dataRows = rows.slice(1); 

        const tableBody = document.getElementById('transaction-table');
        tableBody.innerHTML = "";
        let totalMasuk = 0, totalKeluar = 0;

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
                    <td style="color: #999;">${tanggal.substring(0, 6)}</td>
                    <td style="color: ${isMasuk ? '#6B8E23' : '#CD5C5C'}; font-weight: bold;">${isMasuk ? 'Pem' : 'Pen'}</td>
                    <td>Rp ${num.toLocaleString('id-ID')}</td>
                    <td style="font-size: 10px;">${keterangan || "✨"}</td>
                `;
                tableBody.appendChild(tr);
            }
        });

        document.getElementById('total-masuk').innerText = `Rp ${totalMasuk.toLocaleString('id-ID')}`;
        document.getElementById('total-keluar').innerText = `Rp ${totalKeluar.toLocaleString('id-ID')}`;
        document.getElementById('sisa-saldo').innerText = `Rp ${(totalMasuk - totalKeluar).toLocaleString('id-ID')}`;

        renderChart(totalMasuk - totalKeluar, totalKeluar);
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
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
}

function heartBurst() {
    fetchData();
    for(let i=0; i<15; i++){
        const h = document.createElement('div');
        h.innerHTML = '💖'; h.style.position='fixed'; h.style.bottom='50px'; h.style.right='50px';
        h.style.transition='all 0.8s ease-out'; h.style.zIndex='2000';
        document.body.appendChild(h);
        setTimeout(()=> { 
            h.style.transform = `translate(${(Math.random()-0.5)*400}px, -400px) scale(0)`; 
            h.style.opacity='0'; 
        }, 10);
        setTimeout(()=> h.remove(), 800);
    }
}

window.onload = () => { fetchData(); updateLoveCounter(); };

const sweetQuotes = [
    "Semangat kerjanya sayaang! ✨",
    "Jangan lupa makann cantik 🌸",
    "I'm so lucky to have you 💖",
    "Haii cantikku sayaang 😊"
];

function showRandomQuote() {
    const random = sweetQuotes[Math.floor(Math.random() * sweetQuotes.length)];
    alert(random); // Kamu bisa ganti ini dengan custom modal yang lebih cantik
}

// Panggil ini saat tombol FAB Heart diklik
function heartBurst() {
    // ... kode lama kamu ...
    if (Math.random() > 0.7) showRandomQuote(); // Sesekali munculkan pesan
}