# Minh chứng OBS – Bảng theo dõi video

Quy tắc: **mỗi màn hình = 1 video OBS có mặt + giọng nói sinh viên**.
Nội dung tối thiểu 12 ý mỗi video (xem file hướng dẫn, Phần 8).
Đặt tên file: `SV?-??-ten-man-hinh.mp4`, up lên Drive/YouTube rồi dán link vào bảng.

## Checklist 17 video

| # | Video | Màn hình | Người quay | Nội dung sửa trực tiếp gợi ý | Link Drive | Trạng thái |
|---:|---|---|---|---|---|---|
| 1 | SV1-01-index.mp4 | index.html | Đăng | Đổi text nút hero | ____ | ☐ |
| 2 | SV1-02-login.mp4 | login.html | Đăng | Thêm thông báo lỗi khi sai mật khẩu | ____ | ☐ |
| 3 | SV1-03-profile.mp4 | profile.html | Đăng | Đổi validation tên tối thiểu 3 ký tự | ____ | ☐ |
| 4 | SV1-04-404.mp4 | 404.html | Đăng | Đổi icon/emoji trang 404 | ____ | ☐ |
| 5 | SV1-05-operator-line-status.mp4 | operator-line-status.html | Đăng | Thêm filter theo trạng thái máy | ____ | ☐ |
| 6 | SV1-06-operator-incident-create.mp4 | operator-incident-create.html | Đăng | Thêm 1 từ khóa vào AI_KEYWORDS | ____ | ☐ |
| 7 | SV1-07-operator-shift-incidents.mp4 | operator-shift-incidents.html | Đăng | Thêm cột "Thời gian" vào bảng | ____ | ☐ |
| 8 | SV2-01-notifications.mp4 | notifications.html | Trung | Thêm nút xóa từng thông báo | ____ | ☐ |
| 9 | SV2-02-supervisor-shift-dashboard.mp4 | supervisor-shift-dashboard.html | Trung | Thêm 1 stat card mới | ____ | ☐ |
| 10 | SV2-03-supervisor-incident-board.mp4 | supervisor-incident-board.html | Trung | Thêm filter theo người xử lý | ____ | ☐ |
| 11 | SV2-04-supervisor-handover-note.mp4 | supervisor-handover-note.html | Trung | Thêm field "Sản lượng ca" + validation | ____ | ☐ |
| 12 | SV3-01-maintenance-queue.mp4 | maintenance-queue.html | Công | Đổi sắp xếp theo thời gian thay vì ưu tiên | ____ | ☐ |
| 13 | SV3-02-maintenance-incident-detail.mp4 | maintenance-incident-detail.html | Công | Bắt buộc nhập downtime > 0 khi hoàn thành | ____ | ☐ |
| 14 | SV3-03-maintenance-machine-history.mp4 | maintenance-machine-history.html | Công | Thêm loại công việc mới vào select | ____ | ☐ |
| 15 | SV3-04-admin-machine-management.mp4 | admin-machine-management.html | Công | Thêm cột "Số sự cố" vào bảng máy | ____ | ☐ |
| 16 | SV3-05-admin-line-management.mp4 | admin-line-management.html | Công | Đổi grid card thành bảng table | ____ | ☐ |
| 17 | SV3-06-admin-downtime-report.mp4 | admin-downtime-report.html | Công | Xử lý khi API/data trả về rỗng | ____ | ☐ |

## Mẫu liên kết video ↔ commit (Phụ lục D – copy cho mỗi video)

```text
Màn hình  :
Người làm :
Trello    : TASK-??
Nhánh     : feature/...
Commit    : ???????
Video     : SV?-??-....mp4
```

## Gợi ý OBS

1. Tải OBS Studio (miễn phí) → Settings → chọn quay màn hình + webcam + mic.
2. Trước khi quay: mở sẵn Figma mockup, file mã trong VS Code, trình duyệt.
3. Quay theo trình tự: mặt SV → mockup → giải thích HTML/CSS/JS → sửa trực tiếp 1 chỗ
   → chạy thử trên trình duyệt → `git add . && git commit && git push` → đọc to
   TASK / nhánh / mã commit.
4. Mỗi video 5–10 phút là đủ. Up Drive chế độ "bất kỳ ai có link".
