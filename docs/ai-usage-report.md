# Khai báo sử dụng AI – LineWatch (Phụ lục F)

> Cả nhóm điền thêm sau mỗi lần dùng AI. Dưới đây là khai báo cho phần code đã dựng
> bằng AI Agent (Qoder) và cách nhóm kiểm chứng.

## Lần 1 – Dựng khung toàn bộ dự án

- **Công cụ:** Qoder AI Agent (Claude)
- **Câu lệnh (prompt):** "Đọc đề BTL-14 LineWatch + hướng dẫn CSE122, dựng dự án frontend
  thuần HTML/CSS/JS cho sinh viên năm 2 yếu JS: dùng thẻ div và thẻ cơ bản, hàm JS đơn giản,
  tách riêng file html/css/js, mock data + LocalStorage, 17 màn hình, 3 AI mô phỏng."
- **AI sinh ra:** cấu trúc thư mục, `css/style.css`, `css/responsive.css`, `js/data.js`,
  `js/main.js`, `js/ai.js`, 17 trang HTML + 16 file `js/pages/*.js`, tài liệu docs/.
- **Sinh viên chỉnh sửa:** (điền khi các bạn tinh chỉnh: đổi màu, đổi text, sửa layout,
  thêm bộ lọc theo yêu cầu giảng viên...)
- **Cách kiểm chứng:** mở từng trang trên Chrome, bấm thử toàn bộ luồng
  (đăng nhập 4 vai trò → báo sự cố → điều phối → xử lý → báo cáo); mở DevTools Console
  kiểm tra không có lỗi; test responsive bằng Device Toolbar.
- **Điều học được:** cách tổ chức file js/data + LocalStorage thay cho backend; cách viết
  hàm render + event listener; luồng AI Nhập → Xử lý → Kết quả → Giải thích → Điều khiển.
- **Mock hay API thật:** cả 3 tính năng AI đều là **mock rule-based trong `js/ai.js`**,
  không gọi API LLM thật.

## Mẫu trắng cho các lần dùng AI tiếp theo (copy khi cần)

```text
Công cụ:
Câu lệnh:
AI sinh ra:
Sinh viên chỉnh sửa:
Cách kiểm chứng:
Điều học được:
Mock hay API thật:
```

## Cam kết

Mỗi thành viên phải giải thích được mã trong phần mình phụ trách (video OBS + bảo vệ
chỉnh sửa ngẫu nhiên). Phần nào chưa hiểu, hỏi lại AI để giải thích chứ không nộp mù.
