# Bảng kiểm kê màn hình – LineWatch (BTL-14)

Tổng: **17 màn hình** = 5 trang dùng chung + 12 trang theo vai trò (4 vai × 3 trang).
Mỗi màn hình = 1 video OBS.

## Màn hình dùng chung

| # | Vai trò | Mục tiêu người dùng | Nhiệm vụ | Màn hình | Tệp | CRUD/Trạng thái | AI | Phụ trách | Nhánh | OBS |
|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | Tất cả | Biết sản phẩm là gì | Xem giới thiệu, vai trò, số liệu | Trang chủ | `index.html` | R | – | SV1 Đăng | `feature/common-index` | SV1-01-index.mp4 |
| 2 | Tất cả | Vào hệ thống đúng vai trò | Chọn vai trò + mật khẩu, validation | Đăng nhập | `login.html` | R (auth mô phỏng) | – | SV1 Đăng | `feature/common-login` | SV1-02-login.mp4 |
| 3 | Tất cả | Quản lý tài khoản cá nhân | Xem/sửa tên, đặt lại data demo | Hồ sơ cá nhân | `profile.html` | R/U | – | SV1 Đăng | `feature/common-profile` | SV1-03-profile.mp4 |
| 4 | Tất cả | Nắm thông tin mới | Xem/đánh dấu đã đọc/xóa thông báo | Thông báo | `notifications.html` | R/U/D | – | SV2 Trung | `feature/common-notifications` | SV2-01-notifications.mp4 |
| 5 | Tất cả | Xử lý khi vào sai địa chỉ | Điều hướng về trang chủ | 404 | `404.html` | – | – | SV1 Đăng | `feature/common-404` | SV1-04-404.mp4 |

## Công nhân vận hành (SV1 – Đinh Minh Đăng)

| # | Vai trò | Mục tiêu | Nhiệm vụ | Màn hình | Tệp | CRUD/Trạng thái | AI | Nhánh | OBS |
|---:|---|---|---|---|---|---|---|---|---|
| 6 | Công nhân | Thấy tình trạng line | Xem máy theo line, lọc trạng thái | Line Status | `operator-line-status.html` | R | – | `feature/operator-line-status` | SV1-05-operator-line-status.mp4 |
| 7 | Công nhân | Báo sự cố chuẩn | Điền form + AI phân loại, validation | Incident Create | `operator-incident-create.html` | C | **AI-1** | `feature/operator-incident-create` | SV1-06-operator-incident-create.mp4 |
| 8 | Công nhân | Theo dõi sự cố đã báo | Tìm kiếm/lọc/sửa/hủy sự cố của mình | Shift Incidents | `operator-shift-incidents.html` | C/R/U/D(hủy) | – | `feature/operator-shift-incidents` | SV1-07-operator-shift-incidents.mp4 |

## Trưởng ca (SV2 – Tạ Việt Trung)

| # | Vai trò | Mục tiêu | Nhiệm vụ | Màn hình | Tệp | CRUD/Trạng thái | AI | Nhánh | OBS |
|---:|---|---|---|---|---|---|---|---|---|
| 9 | Trưởng ca | Nắm toàn cảnh ca | Xem thống kê, sự cố mở, máy lỗi; AI tóm tắt ca | Shift Dashboard | `supervisor-shift-dashboard.html` | R | **AI-2** | `feature/supervisor-shift-dashboard` | SV2-02-supervisor-shift-dashboard.mp4 |
| 10 | Trưởng ca | Điều phối sự cố | Kanban chuyển trạng thái, phân công bảo trì | Incident Board | `supervisor-incident-board.html` | R/U | – | `feature/supervisor-incident-board` | SV2-03-supervisor-incident-board.mp4 |
| 11 | Trưởng ca | Bàn giao ca | Tạo/sửa/xóa ghi chú bàn giao | Handover Note | `supervisor-handover-note.html` | C/R/U/D | – | `feature/supervisor-handover-note` | SV2-04-supervisor-handover-note.mp4 |

## Kỹ thuật bảo trì (SV3 – Nguyễn Thành Công)

| # | Vai trò | Mục tiêu | Nhiệm vụ | Màn hình | Tệp | CRUD/Trạng thái | AI | Nhánh | OBS |
|---:|---|---|---|---|---|---|---|---|---|
| 12 | Bảo trì | Biết việc cần làm | Xem hàng chờ theo tab, nhận việc | Maintenance Queue | `maintenance-queue.html` | R/U | – | `feature/maintenance-queue` | SV3-01-maintenance-queue.mp4 |
| 13 | Bảo trì | Xử lý sự cố | Xem bối cảnh máy, ghi nguyên nhân, hoàn thành | Incident Detail | `maintenance-incident-detail.html` | R/U | – | `feature/maintenance-incident-detail` | SV3-02-maintenance-incident-detail.mp4 |
| 14 | Bảo trì | Phòng ngừa lỗi lặp | Timeline lịch sử máy, CRUD nhật ký bảo trì, AI phân tích | Machine History | `maintenance-machine-history.html` | C/R/U/D | **AI-3** | `feature/maintenance-machine-history` | SV3-03-maintenance-machine-history.mp4 |

## Quản trị viên (SV3 – Nguyễn Thành Công)

| # | Vai trò | Mục tiêu | Nhiệm vụ | Màn hình | Tệp | CRUD/Trạng thái | AI | Nhánh | OBS |
|---:|---|---|---|---|---|---|---|---|---|
| 15 | Quản trị | Quản lý tài sản máy | Thêm/sửa/lưu trữ máy, tìm kiếm lọc | Machine Management | `admin-machine-management.html` | C/R/U/Archive | – | `feature/admin-machine-management` | SV3-04-admin-machine-management.mp4 |
| 16 | Quản trị | Quản lý dây chuyền | Thêm/sửa/lưu trữ dây chuyền | Line Management | `admin-line-management.html` | C/R/U/Archive | – | `feature/admin-line-management` | SV3-05-admin-line-management.mp4 |
| 17 | Quản trị | Thấy điểm nóng downtime | Báo cáo theo kỳ, biểu đồ, xuất CSV | Downtime Report | `admin-downtime-report.html` | R + Export | – | `feature/admin-downtime-report` | SV3-06-admin-downtime-report.mp4 |

## Bao phủ trạng thái (đã phân tích)

| Trạng thái | Áp dụng ở đâu |
|---|---|
| Đang tải | Skeleton ở mọi trang danh sách (`fakeLoading` trong `main.js`) |
| Rỗng | Danh sách sự cố trống, hàng chờ trống, chưa có ghi chú, tìm không ra kết quả |
| Thành công | Toast xanh sau khi lưu/đăng nhập/phân công |
| Lỗi | Đăng nhập sai, export CSV không có dữ liệu, validation đỏ |
| Vô hiệu hóa | Nút AI bị disable khi đang xử lý, ô username ở profile |
| Nghiệp vụ | Sự cố: Mới → Đang chờ → Đang xử lý → Đã xử lý / Đã hủy; Máy: Lưu trữ/Khôi phục; Thông báo: Mới/Đã đọc |
