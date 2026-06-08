// Cấu hình – thay username và repo name của bạn
const GITHUB_USER = "accxemtoptopd8-tech";
const REPO_NAME = "daily-news-podcast";
const JSON_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/main/news_today.json`;
const AUDIO_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/main/audio.mp3`;

// Telegram handle (của bạn hoặc kỹ sư)
const TELEGRAM_HANDLE = "YourUsername";  // không có @

async function fetchNews() {
    const newsContainer = document.getElementById('news-list');
    newsContainer.innerHTML = '<div class="loading">📡 Đang tải tin tức...</div>';
    
    try {
        // Thêm cache buster để tránh cache trình duyệt
        const response = await fetch(`${JSON_URL}?t=${Date.now()}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        // Hiển thị thời gian cập nhật
        if (data.last_updated) {
            const updateTime = new Date(data.last_updated).toLocaleString('vi-VN');
            document.getElementById('update-time').innerHTML = `📅 Cập nhật: ${updateTime}`;
        }
        
        // Render danh sách chủ đề
        if (data.topics && data.topics.length) {
            newsContainer.innerHTML = data.topics.map(topic => `
                <div class="news-card">
                    <h2>📌 ${escapeHtml(topic.title)}</h2>
                    <p>${escapeHtml(topic.content)}</p>
                </div>
            `).join('');
        } else {
            newsContainer.innerHTML = '<div class="error">⚠️ Không có tin tức hôm nay. Vui lòng quay lại sau.</div>';
        }
        
        // Set audio source
        const audio = document.getElementById('audio');
        audio.src = `${AUDIO_URL}?t=${Date.now()}`;
        audio.load();
        
    } catch (error) {
        console.error(error);
        newsContainer.innerHTML = `<div class="error">❌ Lỗi tải dữ liệu: ${error.message}<br>Kiểm tra kết nối hoặc thử lại sau.</div>`;
    }
}

// Helper tránh XSS đơn giản
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Nút góp ý mở Telegram với tin nhắn soạn sẵn
function setupFeedback() {
    const btn = document.getElementById('feedback-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            const message = encodeURIComponent("Góp ý về ứng dụng Báo nói: ");
            const url = `https://t.me/${TELEGRAM_HANDLE}?text=${message}`;
            window.open(url, '_blank');
        });
    }
}

// Khởi động
fetchNews();
setupFeedback();
