# Minh chứng OBS – Bảng theo dõi video

> **Thực tế nộp bài:** ĐK4 yêu cầu **3 video OBS** có mặt + giọng nói sinh viên. Nhóm nộp **3 video series "xây dựng từ 0%"** do SV1 (Đăng) quay, mỗi video đi xuyên nhiều màn hình (không phải 1 video / 1 màn hình).
> **Quy tắc đặt tên đã điều chỉnh:** giữ tiền tố `SV1-` (chỉ người quay) + số thứ tự video + nội dung chính, đuôi `.mkv` (định dạng gốc của OBS). Không dùng mẫu cũ `SV?-??-ten-man-hinh.mp4` vì mẫu đó sinh ra cho kế hoạch 17 video (mỗi video 1 màn hình), không khớp với video series nhiều màn hình.
> Up lên Drive/YouTube (chế độ "bất kỳ ai có link") rồi dán link vào cột **Link Drive**.

## 3 video chính (đủ ĐK4)

| # | File video | Nội dung chính | Màn hình chứng minh (mã SV) | Người quay | Link Drive | Trạng thái |
|---:|---|---|---|---|---|---|
| 1 | `SV1-Video-1-Khung-CSS-DuLieu.mkv` | Khung dự án, trang chủ, tầng CSS nền tảng, tầng dữ liệu LocalStorage | SV1-01 (index) | Đăng | ____ | ☑ đã quay |
| 2 | `SV1-Video-2-Login-Line-Status.mkv` | Đăng nhập phân quyền + validate, bảng trạng thái dây chuyền 2 bộ lọc | SV1-02 (login), SV1-05 (line-status) | Đăng | ____ | ☑ đã quay |
| 3 | `SV1-Video-3-SuCo-ThongBao-404.mkv` | Lát cắt dọc bảng sự cố (search/lọc/modal sửa/validate), thông báo, 404, responsive, commit git | SV1-06 (shift-incidents), SV1-07 (notifications), SV1-04 (404) | Đăng | ____ | ☑ đã quay |

## Ánh xạ màn hình ↔ video

| Mã màn hình | Màn hình | Nằm trong video |
|---|---|---|
| SV1-01 | index.html | Video 1 |
| SV1-02 | login.html | Video 2 |
| SV1-04 | 404.html | Video 3 |
| SV1-05 | operator-line-status.html | Video 2 |
| SV1-06 | operator-shift-incidents.html | Video 3 |
| SV1-07 | notifications.html | Video 3 |
| SV1-03 | profile.html | **chưa có video riêng** (xem ghi chú dưới) |

## Ghi chú

- Màn **SV1-03 (profile.html)** chưa xuất hiện trong video nào. Nếu cần minh chứng riêng, quay thêm 1 clip ngắn 2–3 phút; nếu không, chấp nhận vì ĐK4 chỉ yêu cầu 3 video và profile vẫn có trong code + bundle đi thi.
- Các màn của SV2 (Trưởng ca) và SV3 (Bảo trì / Quản trị) không nằm trong 3 video series này; nếu thầy yêu cầu minh chứng riêng từng thành viên, Trung và Công cần quay thêm clip ngắn cho màn của mình.
- Kế hoạch gốc 17 video (mỗi màn 1 video, tên `SV?-??-ten-man-hinh.mp4`) được giữ trong lịch sử tài liệu; bảng trên là thực tế đã quay và nộp.

## Mẫu liên kết video ↔ commit (Phụ lục D – copy cho mỗi video)

```text
Màn hình  :
Người làm :
Trello    : TASK-??
Nhánh     : feature/...
Commit    : ???????
Video     : SV1-Video-?.mkv
```

## Gợi ý OBS

1. Tải OBS Studio (miễn phí) → Settings → chọn quay màn hình + webcam + mic.
2. Trước khi quay: mở sẵn mockup, file mã trong VS Code, trình duyệt.
3. Quay theo trình tự: mặt SV → mockup → giải thích HTML/CSS/JS → sửa trực tiếp 1 chỗ
   → chạy thử trên trình duyệt → `git add` + `git commit` + `git push` → đọc to
   TASK / nhánh / mã commit.
4. Up Drive chế độ "bất kỳ ai có link".
