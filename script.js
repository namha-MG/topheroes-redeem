const translations = {
    vi: {
        subtitle: "AUTO REDEEM <span>SYSTEM</span>",
        uids_label: "PLAYER UIDS",
        uids_placeholder: "Nhập mỗi UID một dòng...\nVí dụ:\n996388907184",
        codes_label: "GIFT CODES",
        codes_placeholder: "Nhập mỗi Code một dòng...\nVí dụ:\nNEWYEAR2026",
        btn_start: "INITIALIZE REDEEM",
        sys_logs: "SYSTEM.LOGS",
        clear_btn: "[ CLEAR ]",
        sys_ready: "Terminal Ready. Chờ lệnh từ người dùng...",
        err_no_uid: "Lỗi: Vui lòng nhập ít nhất 1 UID.",
        err_no_code: "Lỗi: Vui lòng nhập ít nhất 1 Giftcode.",
        progress_start: "Bắt đầu tiến trình. Tổng cộng: {u} UIDs, {c} Codes.",
        uid_processing: "\n--- Bắt đầu xử lý UID: {u} ---",
        char_found: "Tìm thấy nhân vật: {n} (Server: {s})",
        char_not_found: "Cảnh báo: Không thể lấy thông tin nhân vật cho UID {u}. Vẫn tiếp tục thử đăng nhập...",
        login_failed: "Đăng nhập thất bại cho UID {u}. Bỏ qua UID này.",
        login_success: "Đăng nhập thành công! Đang tiến hành nhập code...",
        code_trying: "Đang thử Code: [{c}]...",
        code_success: "=> THÀNH CÔNG: Code [{c}] đã được nhập!",
        code_failed: "=> THẤT BẠI: Code [{c}] - {m}",
        code_error: "=> LỖI: Lỗi kết nối khi nhập code [{c}]",
        all_done: "\n=== Hoàn thành toàn bộ tiến trình! ===",
        processing: "PROCESSING..."
    },
    en: {
        subtitle: "AUTO REDEEM <span>SYSTEM</span>",
        uids_label: "PLAYER UIDS",
        uids_placeholder: "Enter one UID per line...\nExample:\n996388907184",
        codes_label: "GIFT CODES",
        codes_placeholder: "Enter one Code per line...\nExample:\nNEWYEAR2026",
        btn_start: "INITIALIZE REDEEM",
        sys_logs: "SYSTEM.LOGS",
        clear_btn: "[ CLEAR ]",
        sys_ready: "Terminal Ready. Waiting for user input...",
        err_no_uid: "Error: Please enter at least 1 UID.",
        err_no_code: "Error: Please enter at least 1 Giftcode.",
        progress_start: "Process started. Total: {u} UIDs, {c} Codes.",
        uid_processing: "\n--- Processing UID: {u} ---",
        char_found: "Character found: {n} (Server: {s})",
        char_not_found: "Warning: Could not fetch character info for UID {u}. Proceeding to login...",
        login_failed: "Login failed for UID {u}. Skipping this UID.",
        login_success: "Login successful! Proceeding to redeem codes...",
        code_trying: "Trying Code: [{c}]...",
        code_success: "=> SUCCESS: Code [{c}] redeemed!",
        code_failed: "=> FAILED: Code [{c}] - {m}",
        code_error: "=> ERROR: Connection error while redeeming code [{c}]",
        all_done: "\n=== All tasks completed successfully! ===",
        processing: "PROCESSING..."
    },
    ko: {
        subtitle: "AUTO REDEEM <span>SYSTEM</span>",
        uids_label: "플레이어 UID",
        uids_placeholder: "한 줄에 하나의 UID를 입력하세요...\n예:\n996388907184",
        codes_label: "기프트 코드",
        codes_placeholder: "한 줄에 하나의 코드를 입력하세요...\n예:\nNEWYEAR2026",
        btn_start: "코드 교환 시작",
        sys_logs: "시스템 로그",
        clear_btn: "[ 지우기 ]",
        sys_ready: "터미널 준비 완료. 사용자 입력 대기 중...",
        err_no_uid: "오류: 최소 1개의 UID를 입력하세요.",
        err_no_code: "오류: 최소 1개의 기프트 코드를 입력하세요.",
        progress_start: "프로세스 시작됨. 총: {u} UIDs, {c} 코드.",
        uid_processing: "\n--- UID 처리 중: {u} ---",
        char_found: "캐릭터 찾음: {n} (서버: {s})",
        char_not_found: "경고: UID {u}의 캐릭터 정보를 가져올 수 없습니다. 로그인을 계속합니다...",
        login_failed: "UID {u} 로그인 실패. 이 UID를 건너뜁니다.",
        login_success: "로그인 성공! 코드 교환을 진행합니다...",
        code_trying: "코드 시도 중: [{c}]...",
        code_success: "=> 성공: 코드 [{c}] 교환 완료!",
        code_failed: "=> 실패: 코드 [{c}] - {m}",
        code_error: "=> 오류: 코드 [{c}] 교환 중 연결 오류",
        all_done: "\n=== 모든 작업이 성공적으로 완료되었습니다! ===",
        processing: "처리 중..."
    }
};

let currentLang = 'vi';

document.addEventListener('DOMContentLoaded', () => {
    const uidsInput = document.getElementById('uids');
    const codesInput = document.getElementById('codes');
    const langSwitch = document.getElementById('langSwitch');

    // Load saved data
    if (localStorage.getItem('saved_uids')) uidsInput.value = localStorage.getItem('saved_uids');
    if (localStorage.getItem('saved_codes')) codesInput.value = localStorage.getItem('saved_codes');
    
    // Load saved language
    if (localStorage.getItem('saved_lang')) {
        currentLang = localStorage.getItem('saved_lang');
        langSwitch.value = currentLang;
    }
    
    applyLanguage(currentLang);

    // Auto save inputs
    uidsInput.addEventListener('input', () => localStorage.setItem('saved_uids', uidsInput.value));
    codesInput.addEventListener('input', () => localStorage.setItem('saved_codes', codesInput.value));
});

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('saved_lang', lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    const t = translations[lang];
    document.getElementById('subtitle').innerHTML = t.subtitle;
    document.getElementById('uids_label').innerText = t.uids_label;
    document.getElementById('uids').placeholder = t.uids_placeholder;
    document.getElementById('codes_label').innerText = t.codes_label;
    document.getElementById('codes').placeholder = t.codes_placeholder;
    document.getElementById('btn_start').innerText = t.btn_start;
    document.getElementById('sys_logs').innerText = t.sys_logs;
    document.getElementById('clear_btn').innerText = t.clear_btn;
    document.getElementById('sys_ready').innerText = t.sys_ready;
}

function getTranslation(key, params = {}) {
    let text = translations[currentLang][key] || key;
    for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

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
        logMessage(getTranslation('err_no_uid'), 'error');
        return;
    }
    if (codes.length === 0) {
        logMessage(getTranslation('err_no_code'), 'error');
        return;
    }

    const startBtn = document.getElementById('startBtn');
    startBtn.disabled = true;
    startBtn.querySelector('.btn-text').innerText = getTranslation('processing');

    logMessage(getTranslation('progress_start', { u: uids.length, c: codes.length }), 'info');

    for (let i = 0; i < uids.length; i++) {
        const uid = uids[i];
        logMessage(getTranslation('uid_processing', { u: uid }), 'info');

        const playerInfo = await getPlayerInfo(uid);
        if (playerInfo && playerInfo.name) {
            logMessage(getTranslation('char_found', { n: playerInfo.name, s: playerInfo.server }), 'success');
        } else {
            logMessage(getTranslation('char_not_found', { u: uid }), 'warning');
        }

        const token = await loginUser(uid);
        if (!token) {
            logMessage(getTranslation('login_failed', { u: uid }), 'error');
            continue;
        }
        
        logMessage(getTranslation('login_success'), 'success');

        for (let j = 0; j < codes.length; j++) {
            const code = codes[j];
            await redeemCode(uid, code, token);
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    logMessage(getTranslation('all_done'), 'success');
    startBtn.disabled = false;
    startBtn.querySelector('.btn-text').innerText = getTranslation('btn_start');
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

        const token = response.headers.get('authorization');
        if (token) return token;

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
        logMessage(getTranslation('code_trying', { c: code }), 'info');
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
            logMessage(getTranslation('code_success', { c: code }), 'success');
        } else {
            const errorMsg = data.message ? data.message : 'Unknown Error';
            logMessage(getTranslation('code_failed', { c: code, m: errorMsg }), 'warning');
        }
    } catch (e) {
        logMessage(getTranslation('code_error', { c: code }), 'error');
    }
}
