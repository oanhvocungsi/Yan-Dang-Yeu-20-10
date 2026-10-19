# 🌸 Món Quà 20/10: Tiny & Falling Love 💕

Dự án kết hợp hoàn chỉnh giữa giao diện tương tác nhân vật **Tiny (20/10)** và hoạt ảnh **Falling Love 3D (Mưa tình yêu & Ngàn sao)**.

---

## ✨ Nội dung & Điểm đổi mới theo yêu cầu

1. **Khởi đầu cùng nhân vật Tiny**:
   - Tương tác qua 13 câu thoại ấm áp, chuyển động mắt sinh động, hiệu ứng âm thanh và cỏ 4 lá may mắn.
2. **Thay đổi đoạn câu hỏi**:
   - Từ: *"giúp tớ chia sẻ trang web này tới mọi người được không ?"*
   - Thành: **"Cậu có thể luôn vui vẻ, luôn giữ nụ cười xinh xắn được không ạ ☀️ ?"**
3. **Đoạn chúc tiếp nối khi nhấn "Đồng ý"**:
   - Hiển thị lời chúc:
     > **"... chúc cậu luôn may mắn và ngập tràn hạnh phúc nhé ! ❤️"**  
     > **"Chúc cậu ngày 20/10 thật tuyệt vời và rạng rỡ ! 🌸"**
   - Nút tiếp nhiên liệu đạt 100%, máy bay cất cánh bay vào bầu trời đêm rực rỡ sao băng, đôi mắt Tiny mỉm cười long lanh.
4. **Tiếp nối chuyển cảnh mượt mà sang hoạt ảnh Falling Love**:
   - Nhạc nền tình cảm dịu dàng cất lên (`Hngle - Tìm em ft`).
   - Hiệu ứng chữ hạt sao 3D (Three.js Particle Text) tụ hợp và bùng nổ:
     - *"... chúc cậu luôn may mắn và ngập tràn hạnh phúc nhé ! 💖"*
     - *"Chúc cậu ngày 20/10 thật tuyệt vời và rạng rỡ ! 🌸"*
     - *"Luôn giữ nụ cười xinh xắn trên môi nhé ☀️"*
   - Màn chuyển cảnh *"Đang chuẩn bị điều bất ngờ 💕"*.
   - Hoạt ảnh **Love Rain (Mưa tình yêu)** 3D đỉnh cao:
     - Bầu trời đêm ngàn sao với sao băng bay lượn.
     - Khối lập phương 3D xoay tròn chứa hình ảnh kỷ niệm rơi nhẹ nhàng.
     - Mưa trái tim hạt phát sáng rơi lấp lánh.
     - Chữ nghệ thuật 3D font Mali bay bổng.
5. **Mở khóa F12 / DevTools 100%**:
   - Đã gỡ bỏ toàn bộ mã chặn F12 và chuột phải để bạn tự do kiểm tra và tùy biến mã nguồn.

---

## 🚀 Hướng dẫn chạy thử trên máy (Local)

### Cách 1: Dùng Python (Khuyên dùng)
Mở Terminal / PowerShell tại thư mục dự án và chạy:
```bash
python -m http.server 3000
```
Sau đó mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

### Cách 2: Dùng Node.js / npx
```bash
npx serve -l 3000
```

---

## 📁 Cấu trúc thư mục

```
20-10-gift/
├── index.html            # Trang chính tích hợp toàn bộ hiệu ứng
├── assets/
│   ├── icons/            # Icon trái tim, favicon
│   ├── image/            # Các ảnh kỷ niệm 3D rơi trong Love Rain (anh2.jpg, doi2.jpg...)
│   ├── font/             # Font chữ Mali.ttf
│   └── music/loveMusic/  # Nhạc nền Falling Love (Hngle - Tìm em ft)
├── css/                  # main.css, app.css, loading.css
├── js/                   # Thư viện Three.js, Starry-sky, App.js, Particle-effects
└── lib/                  # app-config.js
```

---

## 🎨 Cách thay đổi ảnh & nhạc theo ý bạn

- **Thay đổi ảnh rơi**: Chỉ cần copy ảnh của bạn vào thư mục `assets/image/` với tên `anh2.jpg`, `anhDoi2.jpg`, `doi2.jpg`, `doi3.jpg`, `doi4.jpg`, `doi5.jpg` (hoặc định dạng `.jpg`, `.png`).
- **Thay đổi nhạc nền**: Đổi file nhạc MP3 trong `assets/music/loveMusic/`.

---

## 🌐 Hướng dẫn đưa lên mạng miễn phí (Deploy)

Bạn có thể tải toàn bộ thư mục này lên các dịch vụ lưu trữ miễn phí:
1. **GitHub Pages**: Đẩy lên GitHub repository -> Settings -> Pages -> Chọn nhánh `main` / root.
2. **Vercel / Netlify**: Kéo thả thư mục dự án vào trang điều khiển của Vercel hoặc Netlify là có link chia sẻ ngay.
3. **Cloudflare Pages**: Tạo dự án Pages và kéo thả thư mục vào.
