const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzD-MxPzu7sZPS7eLn9PQnmOMU_glqa8UA0OpR7OmzZzGSix9gyuW9n4cQG3CMkqCIe/exec";

document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('responseMessage');
    btn.disabled = true;
    btn.innerText = "Mengirim Data...";

    // Convert file to Base64
    const fileTransfer = document.getElementById('buktiTransfer').files[0];
    const fileIG = document.getElementById('buktiIG').files[0];

    Promise.all([toBase64(fileTransfer), toBase64(fileIG)]).then(([transferData, igData]) => {
        const payload = {
            asalSekolah: document.getElementById('asalSekolah').value,
            namaPeserta1: document.getElementById('namaPeserta1').value,
            waPeserta1: document.getElementById('waPeserta1').value,
            namaPeserta2: document.getElementById('namaPeserta2').value,
            waPeserta2: document.getElementById('waPeserta2').value,
            namaPembina: document.getElementById('namaPembina').value,
            waPembina: document.getElementById('waPembina').value,
            transferBase64: transferData.base64,
            transferMimeType: transferData.mimeType,
            transferName: fileTransfer.name,
            igBase64: igData.base64,
            igMimeType: igData.mimeType,
            igName: fileIG.name
        };

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === "success") {
                alert("Pendaftaran Berhasil! ID Peserta Anda: " + data.id);
                location.reload();
            } else {
                alert("Gagal: " + data.message);
                btn.disabled = false;
                btn.innerText = "Kirim Pendaftaran";
            }
        })
        .catch(err => {
            console.error(err);
            alert("Terjadi kesalahan koneksi.");
            btn.disabled = false;
            btn.innerText = "Kirim Pendaftaran";
        });
    });
});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result;
            const mimeType = result.substring(result.indexOf(":") + 1, result.indexOf(";"));
            const base64 = result.split(",")[1];
            resolve({ base64, mimeType });
        };
        reader.onerror = error => reject(error);
    });
}
// Mengambil jumlah kuota otomatis saat website dibuka
window.addEventListener('DOMContentLoaded', () => {
    fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
        const quotaText = document.getElementById('quota-text');
        if (data.total !== undefined) {
            quotaText.innerText = `${data.total} / 24 TEAMS REGISTERED`;
            
            // Jika sudah 24 tim, tombol pendaftaran otomatis berubah
            if (data.total >= 24) {
                const submitBtn = document.getElementById('submitBtn');
                submitBtn.disabled = true;
                submitBtn.innerText = "REGISTRATION CLOSED";
                submitBtn.style.background = "#555";
            }
        }
    })
    .catch(err => {
        console.error("Gagal memuat kuota", err);
        document.getElementById('quota-text').innerText = "0 / 24 TEAMS REGISTERED";
    });
});

