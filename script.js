document.addEventListener('DOMContentLoaded', () => {
    const statusIndicator = document.getElementById('statusIndicator');
    const messageDiv = document.getElementById('message');

    const showMessage = (text, type) => {
        messageDiv.textContent = text; messageDiv.className = `message ${type}`;
        setTimeout(() => { messageDiv.className = 'message'; messageDiv.textContent = ''; }, 5000);
    };

    const checkBackendStatus = async () => {
        try {
            const response = await fetch('/api/status');
            const data = await response.json();
            if (data.status === 'online') statusIndicator.classList.add('online');
            else statusIndicator.classList.remove('online');
        } catch (error) { statusIndicator.classList.remove('online'); }
    };
    setInterval(checkBackendStatus, 3000); checkBackendStatus();

    const loginForm = document.getElementById('loginForm');
    const codeForm = document.getElementById('codeForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phoneNumber = document.getElementById('phoneNumber').value;
            const btn = document.getElementById('sendCodeBtn'); btn.disabled = true; btn.textContent = 'Mengirim...';
            try {
                const response = await fetch('/api/send-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phoneNumber }) });
                const data = await response.json();
                if (response.ok) { showMessage(data.message, 'success'); codeForm.style.display = 'block'; }
                else { showMessage(data.error, 'error'); }
            } catch (error) { showMessage('Gagal terhubung ke server.', 'error'); }
            finally { btn.disabled = false; btn.textContent = 'Kirim Kode'; }
        });
        codeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const code = document.getElementById('code').value;
            const btn = document.getElementById('signInBtn'); btn.disabled = true; btn.textContent = 'Memproses...';
            try {
                const response = await fetch('/api/sign-in', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
                const data = await response.json();
                if (response.ok) { showMessage(data.message, 'success'); setTimeout(() => window.location.href = 'broadcast.html', 1500); }
                else { showMessage(data.error, 'error'); }
            } catch (error) { showMessage('Gagal terhubung ke server.', 'error'); }
            finally { btn.disabled = false; btn.textContent = 'Masuk'; }
        });
    }

    const broadcastForm = document.getElementById('broadcastForm');
    const logoutBtn = document.getElementById('logoutBtn');
    if (broadcastForm) {
        broadcastForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = document.getElementById('message').value;
            const buttonText = document.getElementById('buttonText').value;
            const buttonLink = document.getElementById('buttonLink').value;
            const btn = document.getElementById('broadcastBtn'); btn.disabled = true; btn.textContent = 'Mengirim...';
            try {
                const response = await fetch('/api/broadcast', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, buttonText, buttonLink }) });
                const data = await response.json();
                if (response.ok) { showMessage(data.message, 'success'); broadcastForm.reset(); }
                else { showMessage(data.error, 'error'); }
            } catch (error) { showMessage('Gagal terhubung ke server.', 'error'); }
            finally { btn.disabled = false; btn.textContent = 'Kirim Broadcast'; }
        });
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await fetch('/api/logout', { method: 'POST' });
                window.location.href = 'index.html';
            });
        }
    }
});
