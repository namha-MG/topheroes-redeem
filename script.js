document.addEventListener('DOMContentLoaded', () => {
    const uidsInput = document.getElementById('uids');
    const codesInput = document.getElementById('codes');

    // Tải dữ liệu đã lưu
    if (localStorage.getItem('saved_uids')) {
        uidsInput.value = localStorage.getItem('saved_uids');
    }
    if (localStorage.getItem('saved_codes')) {
        codesInput.value = localStorage.getItem('saved_codes');
    }

    // Tự động lưu khi người dùng nhập liệu
    uidsInput.addEventListener('input', () => {
        localStorage.setItem('saved_uids', uidsInput.value);
    });
    codesInput.addEventListener('input', () => {
        localStorage.setItem('saved_codes', codesInput.value);
    });
});

function getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', { hour12: false });
}

function logMessage(msg, type = 'info') {
    const logBox = document.getElementById('logBox');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'time';
    timeSpan.textContent = `[${getTimestamp()}]`;
    
    const textNode = document.createTextNode(` ${msg}`);
    
    entry.appendChild(timeSpan);
    entry.appendChild(textNode);
    logBox.appendChild(entry);
    
    // Auto scroll to bottom
    logBox.scrollTop = logBox.scrollHeight;
}

function clearLogs() {
    document.getElementById('logBox').innerHTML = '';
}

async function startRedeem() {
    const uidsInput = document.getElementById('uids').value;
    const codesInput = document.getElementById('codes').value;

    const uids = uidsInput.split('\n').map(u => u.trim()).filter(u => u);
    const codes = codesInput.split('\n').map(c => c.trim()).filter(c => c);

    if (uids.length === 0) {
        logMessage("Lỗi: Vui lòng nhập ít nhất 1 UID.", 'error');
        return;
    }
    if (codes.length === 0) {
        logMessage("Lỗi: Vui lòng nhập ít nhất 1 Giftcode.", 'error');
        return;
    }

    const startBtn = document.getElementById('startBtn');
    startBtn.disabled = true;
    startBtn.querySelector('.btn-text').innerText = 'PROCESSING...';

    logMessage(`Bắt đầu tiến trình. Tổng cộng: ${uids.length} UIDs, ${codes.length} Codes.`, 'info');

    for (let i = 0; i < uids.length; i++) {
        const uid = uids[i];
        logMessage(`\n--- Bắt đầu xử lý UID: ${uid} ---`, 'info');

        // Bước 1: Lấy thông tin player (Tùy chọn, để check UID hợp lệ và lấy tên)
        const playerInfo = await getPlayerInfo(uid);
        if (playerInfo && playerInfo.name) {
            logMessage(`Tìm thấy nhân vật: ${playerInfo.name} (Server: ${playerInfo.server})`, 'success');
        } else {
            logMessage(`Cảnh báo: Không thể lấy thông tin nhân vật cho UID ${uid}. Vẫn tiếp tục thử đăng nhập...`, 'warning');
        }

        // Bước 2: Đăng nhập
        const token = await loginUser(uid);
        if (!token) {
            logMessage(`Đăng nhập thất bại cho UID ${uid}. Bỏ qua UID này.`, 'error');
            continue;
        }
        
        logMessage(`Đăng nhập thành công! Đang tiến hành nhập code...`, 'success');

        // Bước 3: Nhập codes
        for (let j = 0; j < codes.length; j++) {
            const code = codes[j];
            await redeemCode(uid, code, token);
            // Delay nhỏ để tránh bị block do spam request
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    logMessage(`\n=== Hoàn thành toàn bộ tiến trình! ===`, 'success');
    startBtn.disabled = false;
    startBtn.querySelector('.btn-text').innerText = 'INITIALIZE REDEEM';
}

async function getPlayerInfo(uid) {
    try {
        const url = `https://topheroes.store.kopglobal.com/api/v2/store/player-info?project_id=1028637&player_id=${uid}&site_id=1028526`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'vi-VN,vi;q=0.9',
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.code === 1 && data.data && data.data.user) {
                return data.data.user;
            }
        }
    } catch (e) {
        console.error("Player info error:", e);
    }
    return null;
}

async function loginUser(uid) {
    try {
        const response = await fetch('https://topheroes.store.kopglobal.com/api/v2/store/login/player', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'vi-VN,vi;q=0.9',
            },
            body: JSON.stringify({
                site_id: 1028526,
                player_id: uid,
                server_id: "",
                device: "pc"
            })
        });

        if (!response.ok) return null;

        // Lấy token từ header Authorization
        const token = response.headers.get('authorization');
        if (token) return token;

        // Nếu không có trong header, thử check trong JSON response (dự phòng)
        const data = await response.json();
        if (data.data && data.data.token) {
             return `Bearer ${data.data.token}`;
        }

        return null;
    } catch (e) {
        console.error("Login error:", e);
        return null;
    }
}

async function redeemCode(uid, code, token) {
    try {
        logMessage(`Đang thử Code: [${code}]...`, 'info');
        const response = await fetch('https://topheroes.store.kopglobal.com/api/v2/store/redemption/redeem', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json, text/plain, */*',
                'authorization': token,
            },
            body: JSON.stringify({
                project_id: 1028637,
                redemption_code: code
            })
        });

        const data = await response.json();
        
        if (data.code === 1) {
            logMessage(`=> THÀNH CÔNG: Code [${code}] đã được nhập!`, 'success');
        } else {
            // Hiển thị thông báo lỗi từ server nếu có (VD: Code đã nhập, hết hạn,...)
            const errorMsg = data.message ? data.message : 'Lỗi không xác định';
            logMessage(`=> THẤT BẠI: Code [${code}] - ${errorMsg}`, 'warning');
        }
    } catch (e) {
        logMessage(`=> LỖI: Lỗi kết nối khi nhập code [${code}]`, 'error');
    }
}
