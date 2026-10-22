# Vai trò & Tính năng – LineWatch

## Sơ đồ vai trò ↔ màn hình ↔ tính năng

| Vai trò | Màn hình | Tính năng chính | AI |
|---|---|---|---|
| Công nhân vận hành | Line Status | Xem trạng thái máy theo dây chuyền, lọc line/trạng thái, đếm sự cố mở | – |
| | Incident Create | Form báo sự cố có validation, AI gợi ý loại + ưu tiên | AI-1 |
| | Shift Incidents | Tìm kiếm, lọc, xem chi tiết (modal), sửa khi còn "Mới", hủy báo nhầm | – |
| Trưởng ca | Shift Dashboard | Thống kê ca, danh sách sự cố mở xếp theo ưu tiên, máy đang dừng/cảnh báo, AI tóm tắt ca → lưu bàn giao | AI-2 |
| | Incident Board | Kanban 4 cột trạng thái, chuyển trạng thái 2 chiều, phân công bảo trì, lọc ưu tiên/line | – |
| | Handover Note | CRUD ghi chú bàn giao (form + modal sửa + confirm xóa), trạng thái rỗng | – |
| Kỹ thuật bảo trì | Maintenance Queue | 3 tab (việc của tôi / chưa phân công / đã hoàn thành), sắp xếp ưu tiên, nhận việc | – |
| | Incident Detail | Bối cảnh máy (đếm sự cố cũ, link lịch sử), cập nhật trạng thái, bắt buộc ghi nguyên nhân khi hoàn thành, tự tạo nhật ký bảo trì + khôi phục máy + gửi thông báo | – |
| | Machine History | Timeline gộp sự cố + nhật ký bảo trì, CRUD nhật ký, AI phát hiện lỗi lặp | AI-3 |
| Quản trị viên | Machine Management | Bảng máy: search, lọc line/trạng thái, thêm/sửa (modal, check trùng mã), lưu trữ/khôi phục | – |
| | Line Management | Card dây chuyền: thêm/sửa (modal + validation), lưu trữ/khôi phục, đếm số máy | – |
| | Downtime Report | Lọc theo kỳ, 4 số liệu tổng, biểu đồ cột theo line, top 5 máy, bảng chi tiết, xuất CSV | – |
| Dùng chung | index / login / profile / notifications / 404 | Giới thiệu, đăng nhập mô phỏng, hồ sơ + reset data, thông báo (đọc/xóa), trang lỗi | – |

## Cơ chế liên vai trò (dữ liệu chảy thế nào)

1. **Công nhân** báo sự cố (AI-1 gợi ý phân loại) → máy ưu tiên Cao tự chuyển `stopped`
   → **thông báo** sinh cho trưởng ca.
2. **Trưởng ca** thấy sự cố trong Dashboard/Board → phân công bảo trì → trạng thái `Đang chờ`
   → thông báo sinh cho bảo trì.
3. **Bảo trì** nhận việc (`Đang xử lý`) → xử lý trong Incident Detail, bắt buộc ghi nguyên nhân
   → hoàn thành: máy `running` trở lại, tự ghi nhật ký bảo trì, thông báo cho công nhân + trưởng ca.
4. **Quản trị** xem báo cáo downtime tổng hợp từ toàn bộ sự cố; dùng AI-3 (Machine History)
   để lên kế hoạch bảo trì phòng ngừa.

## Quyền truy cập

Mỗi trang gọi `requireRole([...])` trong `js/main.js` — sai vai trò sẽ bị báo và đẩy về trang chủ.
