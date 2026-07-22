const fs = require('fs');

// Cấu hình mã sự kiện điểm danh
const ACTIVITY_IDS = [3419, 3430];

// Hàm lấy danh sách UID từ file uids.txt
function getUids() {
    try {
        if (fs.existsSync('uids.txt')) {
            const data = fs.readFileSync('uids.txt', 'utf8');
            return data.split('\n').map(u => u.trim()).filter(u => u);
        }
    } catch (e) {
        console.error("Lỗi đọc file uids.txt:", e.message);
    }
    return [];
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
        console.error("Lỗi đăng nhập:", e.message);
        return null;
    }
}

function log(msg) {
    const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    console.log(`[${time}] ${msg}`);
}

async function claimDailyRewards(uid, token) {
    for (const actId of ACTIVITY_IDS) {
        try {
            log(`Đang kiểm tra sự kiện điểm danh (ID: ${actId})...`);
            const listUrl = `https://topheroes.store.kopglobal.com/api/v2/store/sale/biz/sign-in-list?page_size=365&site_id=1028526&page_no=1&activity_id=${actId}`;
            const listResponse = await fetch(listUrl, {
                method: 'GET',
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'authorization': token,
                }
            });
            
            if (!listResponse.ok) continue;
            
            const listData = await listResponse.json();
            
            if (listData.code === 1 && listData.data && listData.data.sign_in_list) {
                const list = listData.data.sign_in_list;
                const availableDay = list.find(day => day.is_available_sign_in);
                
                if (availableDay) {
                    const receiveUrl = 'https://topheroes.store.kopglobal.com/api/v2/store/sale/biz/sign-in/gift/receive';
                    const receiveResponse = await fetch(receiveUrl, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            'accept': 'application/json, text/plain, */*',
                            'authorization': token,
                        },
                        body: JSON.stringify({
                            sign_in_type: 1,
                            site_id: 1028526,
                            activity_id: actId
                        })
                    });
                    
                    const receiveData = await receiveResponse.json();
                    if (receiveData.code === 1) {
                        log(`=> THÀNH CÔNG: Đã nhận quà ngày ${availableDay.day_no}!`);
                    } else {
                        const msg = receiveData.message || 'Lỗi không xác định';
                        log(`=> THẤT BẠI: Không thể nhận quà ngày ${availableDay.day_no} - ${msg}`);
                    }
                } else {
                    log(`=> Đã nhận hoặc không có phần thưởng cho hôm nay.`);
                }
            } else {
                log(`=> Không tìm thấy sự kiện hoặc đã hết hạn.`);
            }
        } catch (e) {
            log(`=> LỖI KẾT NỐI: ${e.message}`);
        }
        // Nghỉ 1 giây để tránh request quá nhanh
        await new Promise(r => setTimeout(r, 1000));
    }
}

async function startJob() {
    log("=== BẮT ĐẦU CHẠY JOB ĐIỂM DANH HÀNG NGÀY ===");
    const uids = getUids();
    if (uids.length === 0) {
        log("Không tìm thấy UID nào trong uids.txt. Vui lòng thêm UID (mỗi dòng 1 UID) vào file uids.txt.");
        return;
    }

    log(`Tìm thấy ${uids.length} UIDs để xử lý...`);
    
    for (const uid of uids) {
        log(`\n--- Đang xử lý UID: ${uid} ---`);
        const token = await loginUser(uid);
        if (!token) {
            log(`=> Đăng nhập thất bại. Bỏ qua UID này.`);
            continue;
        }
        log(`=> Đăng nhập thành công!`);
        await claimDailyRewards(uid, token);
    }
    log("\n=== JOB HOÀN TẤT ===");
}

startJob();
