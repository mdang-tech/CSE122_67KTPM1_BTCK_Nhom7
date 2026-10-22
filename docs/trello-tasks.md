# Danh sách task Trello – copy & dán

Hướng dẫn dùng:
1. Tạo bảng Trello với 5 cột: `TỒN ĐỌNG` → `CẦN LÀM` → `ĐANG LÀM` → `CHỜ DUYỆT` → `HOÀN THÀNH`.
2. Mỗi khối dưới đây = 1 card. Copy nguyên khối, dán vào Trello (Trello tự tách tiêu đề/mô tả nếu dán dòng đầu làm tên card).
3. Khi làm xong mỗi card, dán link PR/commit và link video OBS vào card.

---

## Nhóm 0 – Khởi động (cả nhóm, làm trước tiên)

```
TASK-01 – Phân tích đề tài + bảng kiểm kê màn hình
Người làm: Cả nhóm (Đăng tổng hợp)
Mô tả: Đọc đề BTL-14, viết ngữ cảnh/vấn đề/mục tiêu, lập bảng kiểm kê 17 màn hình (docs/screen-inventory.md), vẽ luồng người dùng, trình giảng viên duyệt.
Hạn: ____
Nhánh: docs/proposal
Trạng thái: CẦN LÀM
```

```
TASK-02 – Thiết kế Figma/Canva toàn bộ màn hình
Người làm: Cả nhóm (Đăng chính)
Mô tả: Sơ đồ trang, wireframe, mockup desktop + responsive, component guide, trạng thái loading/rỗng/lỗi, mockup 3 luồng AI. Lưu link vào design/figma-link.txt, xuất ảnh vào design/mockups/.
Hạn: ____
Nhánh: docs/figma-mockups
Trạng thái: CẦN LÀM
```

```
TASK-03 – Khởi tạo repo + khung dự án
Người làm: Công
Mô tả: Tạo repo GitHub cse122-linewatch-teamXX, tạo nhánh dev, dựng cấu trúc thư mục (pages/, css/, js/, docs/, design/), README khung.
Hạn: ____
Nhánh: dev
Trạng thái: CẦN LÀM
```

```
TASK-04 – Hệ thống thiết kế: css/style.css + responsive.css
Người làm: Đăng
Mô tả: Token màu, topbar/nav, card, btn, badge, form, table, modal, toast, skeleton, kanban, timeline, bar-chart, AI box; media query tablet (900px) + mobile (640px).
Hạn: ____
Nhánh: feature/design-system
Reviewer: Công
Trạng thái: CẦN LÀM
```

```
TASK-05 – Hạ tầng dữ liệu: js/data.js + js/main.js
Người làm: Trung
Mô tả: Mock data 7 collection (users, lines, machines, incidents, shiftNotes, maintenanceTasks, notifications), DB helper LocalStorage (all/find/add/update/remove), seed + reset; main.js: đăng nhập/phân quyền requireRole, renderNav theo vai trò, toast, modal, escapeHtml, format ngày, badge, fakeLoading.
Hạn: ____
Nhánh: feature/core-data
Reviewer: Đăng
Trạng thái: CẦN LÀM
```

---

## Nhóm 1 – SV1 Đinh Minh Đăng (Công nhân vận hành + trang chung)

```
TASK-06 – Trang chủ index.html
Người làm: Đăng
Màn hình: index.html
Mô tả: Hero giới thiệu, 4 card vai trò, khối thống kê (skeleton → số liệu từ DB), 3 tính năng AI, nút đăng nhập đổi thành "Vào khu vực làm việc" nếu đã login.
Hạn: ____
Nhánh: feature/common-index
Reviewer: Trung
OBS: SV1-01-index.mp4
Trạng thái: CẦN LÀM
```

```
TASK-07 – Đăng nhập login.html
Người làm: Đăng
Màn hình: login.html
Mô tả: Form chọn 1 trong 4 vai trò + mật khẩu, validation (chưa chọn vai trò / sai mật khẩu → thông báo đỏ), lưu user vào LocalStorage, chuyển về trang mặc định của vai trò.
Hạn: ____
Nhánh: feature/common-login
Reviewer: Trung
OBS: SV1-02-login.mp4
Trạng thái: CẦN LÀM
```

```
TASK-08 – Hồ sơ profile.html
Người làm: Đăng
Màn hình: profile.html
Mô tả: Hiện avatar/tên/vai trò, form đổi tên có validation, nút đặt lại dữ liệu demo (confirm), cập nhật topbar sau khi lưu.
Hạn: ____
Nhánh: feature/common-profile
Reviewer: Công
OBS: SV1-03-profile.mp4
Trạng thái: CẦN LÀM
```

```
TASK-09 – Trang 404.html
Người làm: Đăng
Màn hình: 404.html
Mô tả: Trang báo lỗi địa chỉ không tồn tại + nút về trang chủ.
Hạn: ____
Nhánh: feature/common-404
Reviewer: Công
OBS: SV1-04-404.mp4
Trạng thái: CẦN LÀM
```

```
TASK-10 – Line Status operator-line-status.html
Người làm: Đăng
Màn hình: operator-line-status.html
Mô tả: Card theo từng dây chuyền, mỗi máy có chấm trạng thái + badge + số sự cố mở; lọc theo line và trạng thái; skeleton loading; trạng thái rỗng khi lọc không ra; nút Báo sự cố.
Hạn: ____
Nhánh: feature/operator-line-status
Reviewer: Trung
OBS: SV1-05-operator-line-status.mp4
Trạng thái: CẦN LÀM
```

```
TASK-11 – Báo sự cố operator-incident-create.html (AI-1)
Người làm: Đăng
Màn hình: operator-incident-create.html
Mô tả: Form máy (optgroup theo line)/tiêu đề/mô tả/loại/ưu tiên + validation; khối AI-1: loading → kết quả (loại, ưu tiên, độ tin cậy) → giải thích → Chấp nhận (điền vào form) / Sửa / Tạo lại / Từ chối; trạng thái AI thất bại khi mô tả < 15 ký tự; lưu incident + thông báo cho trưởng ca + máy ưu tiên Cao chuyển stopped.
Hạn: ____
Nhánh: feature/operator-incident-create
Reviewer: Trung
OBS: SV1-06-operator-incident-create.mp4
Trạng thái: CẦN LÀM
```

```
TASK-12 – Sự cố ca của tôi operator-shift-incidents.html
Người làm: Đăng
Màn hình: operator-shift-incidents.html
Mô tả: Bảng sự cố của chính mình; search realtime + lọc trạng thái/ưu tiên; modal chi tiết; modal sửa (chỉ khi status = Mới) có validation; hủy báo nhầm (confirm); trạng thái rỗng.
Hạn: ____
Nhánh: feature/operator-shift-incidents
Reviewer: Công
OBS: SV1-07-operator-shift-incidents.mp4
Trạng thái: CẦN LÀM
```

---

## Nhóm 2 – SV2 Tạ Việt Trung (Trưởng ca + JS/AI)

```
TASK-13 – Hạ tầng AI: js/ai.js
Người làm: Trung
Mô tả: 3 hàm mô phỏng AI theo luật: aiClassifyIncident (từ khóa → loại + ưu tiên + độ tin cậy), aiSummarizeShift (đếm sự cố/downtime/việc tồn), aiFindRepeatFailures (tần suất loại lỗi theo máy); mỗi hàm có nhánh thất bại "Không đủ dữ liệu"/"AI chưa chắc chắn"; helper aiShowLoading/aiShowResult.
Hạn: ____
Nhánh: feature/ai-engine
Reviewer: Công
Trạng thái: CẦN LÀM
```

```
TASK-14 – Thông báo notifications.html
Người làm: Trung
Màn hình: notifications.html
Mô tả: Danh sách thông báo của user hiện tại (mới nhất trước), badge "Mới", nút đánh dấu đã đọc từng cái / tất cả, xóa tất cả (confirm), trạng thái rỗng.
Hạn: ____
Nhánh: feature/common-notifications
Reviewer: Đăng
OBS: SV2-01-notifications.mp4
Trạng thái: CẦN LÀM
```

```
TASK-15 – Shift Dashboard supervisor-shift-dashboard.html (AI-2)
Người làm: Trung
Màn hình: supervisor-shift-dashboard.html
Mô tả: 4 số liệu thống kê (skeleton loading), danh sách sự cố mở xếp theo ưu tiên, danh sách máy dừng/cảnh báo; khối AI-2: loading → tóm tắt ca → giải thích → Chấp nhận (lưu thành ghi chú bàn giao) / Sửa (prompt) / Tạo lại / Từ chối; thất bại khi không có dữ liệu.
Hạn: ____
Nhánh: feature/supervisor-shift-dashboard
Reviewer: Công
OBS: SV2-02-supervisor-shift-dashboard.mp4
Trạng thái: CẦN LÀM
```

```
TASK-16 – Incident Board supervisor-incident-board.html
Người làm: Trung
Màn hình: supervisor-incident-board.html
Mô tả: Kanban 4 cột (Mới/Đang chờ/Đang xử lý/Đã xử lý); mỗi card: ưu tiên, máy, người báo; nút chuyển trạng thái ← →; modal phân công bảo trì (chỉ user role maintenance); lọc ưu tiên/line; cột rỗng có thông báo; sinh thông báo khi đổi trạng thái/phân công.
Hạn: ____
Nhánh: feature/supervisor-incident-board
Reviewer: Đăng
OBS: SV2-03-supervisor-incident-board.mp4
Trạng thái: CẦN LÀM
```

```
TASK-17 – Handover Note supervisor-handover-note.html
Người làm: Trung
Màn hình: supervisor-handover-note.html
Mô tả: Form tạo ghi chú (ca/ngày/nội dung ≥ 20 ký tự/việc tồn) + validation; danh sách lịch sử bàn giao mới nhất trước; modal sửa; xóa có confirm; trạng thái rỗng có gợi ý dùng AI-2.
Hạn: ____
Nhánh: feature/supervisor-handover-note
Reviewer: Đăng
OBS: SV2-04-supervisor-handover-note.mp4
Trạng thái: CẦN LÀM
```

---

## Nhóm 3 – SV3 Nguyễn Thành Công (Bảo trì + Quản trị)

```
TASK-18 – Maintenance Queue maintenance-queue.html
Người làm: Công
Màn hình: maintenance-queue.html
Mô tả: 3 tab (Việc của tôi / Chưa phân công / Đã hoàn thành); card sự cố sắp xếp ưu tiên Cao → Thấp; nút Nhận việc (gán mình + Đang xử lý + thông báo trưởng ca); link sang trang chi tiết kèm ?id=; trạng thái rỗng từng tab.
Hạn: ____
Nhánh: feature/maintenance-queue
Reviewer: Đăng
OBS: SV3-01-maintenance-queue.mp4
Trạng thái: CẦN LÀM
```

```
TASK-19 – Incident Detail maintenance-incident-detail.html
Người làm: Công
Màn hình: maintenance-incident-detail.html
Mô tả: Đọc ?id= từ URL hoặc chọn từ select; panel thông tin + bối cảnh máy (đếm sự cố cũ, link lịch sử khi ≥ 2); form cập nhật: trạng thái, nguyên nhân (bắt buộc ≥ 10 ký tự khi chọn Đã xử lý), biện pháp, downtime (validation số ≥ 0); khi hoàn thành: máy running lại, tự ghi maintenanceTask, thông báo công nhân + trưởng ca.
Hạn: ____
Nhánh: feature/maintenance-incident-detail
Reviewer: Trung
OBS: SV3-02-maintenance-incident-detail.mp4
Trạng thái: CẦN LÀM
```

```
TASK-20 – Machine History maintenance-machine-history.html (AI-3)
Người làm: Công
Màn hình: maintenance-machine-history.html
Mô tả: Select máy (optgroup, hỗ trợ ?machineId=); timeline gộp sự cố + nhật ký bảo trì (mới trước); form thêm/sửa/xóa nhật ký (confirm) có validation; khối AI-3: loading → mẫu lỗi lặp (loại, số lần, tổng downtime, đề xuất) → giải thích → Chấp nhận (tạo nhật ký "Kiểm tra" từ đề xuất) / Thử lại / Bỏ qua; thất bại khi < 2 sự cố.
Hạn: ____
Nhánh: feature/maintenance-machine-history
Reviewer: Trung
OBS: SV3-03-maintenance-machine-history.mp4
Trạng thái: CẦN LÀM
```

```
TASK-21 – Machine Management admin-machine-management.html
Người làm: Công
Màn hình: admin-machine-management.html
Mô tả: Bảng máy + search realtime + lọc line/trạng thái (gồm "Đã lưu trữ"); modal thêm/sửa (validation tên ≥ 3 ký tự, mã không trùng); lưu trữ/khôi phục (confirm); hàng đã lưu trữ hiển thị mờ.
Hạn: ____
Nhánh: feature/admin-machine-management
Reviewer: Đăng
OBS: SV3-04-admin-machine-management.mp4
Trạng thái: CẦN LÀM
```

```
TASK-22 – Line Management admin-line-management.html
Người làm: Công
Màn hình: admin-line-management.html
Mô tả: Grid card dây chuyền (tên, sản phẩm, công suất, số máy); modal thêm/sửa có validation (tên ≥ 3, sản phẩm bắt buộc, công suất > 0); lưu trữ/khôi phục; trạng thái rỗng.
Hạn: ____
Nhánh: feature/admin-line-management
Reviewer: Trung
OBS: SV3-05-admin-line-management.mp4
Trạng thái: CẦN LÀM
```

```
TASK-23 – Downtime Report admin-downtime-report.html
Người làm: Công
Màn hình: admin-downtime-report.html
Mô tả: Bộ lọc từ/ngày–đến/ngày (mặc định 30 ngày, validation from ≤ to); 4 stat tổng; biểu đồ cột CSS downtime theo line; top 5 máy downtime; bảng chi tiết sự cố trong kỳ; xuất CSV (Blob + \uFEFF cho tiếng Việt); trạng thái rỗng khi kỳ không có sự cố.
Hạn: ____
Nhánh: feature/admin-downtime-report
Reviewer: Trung
OBS: SV3-06-admin-downtime-report.mp4
Trạng thái: CẦN LÀM
```

---

## Nhóm 4 – Hoàn thiện (cả nhóm)

```
TASK-24 – Kiểm thử tích hợp đa trình duyệt + responsive
Người làm: Công (chính), cả nhóm hỗ trợ
Mô tả: Test toàn bộ luồng liên vai trò (báo → điều phối → xử lý → báo cáo) trên Chrome/Edge, Desktop/Tablet/Mobile (DevTools Device Toolbar); sửa lỗi phát hiện.
Hạn: ____
Nhánh: fix/integration-round-1
Trạng thái: CẦN LÀM
```

```
TASK-25 – Hoàn thiện tài liệu: README + docs + khai báo AI
Người làm: Đăng (chính), Trung bổ sung phần AI
Mô tả: README đủ 16 mục theo mẫu Phụ lục E; docs/project-proposal.md, roles-and-features.md, screen-inventory.md cập nhật link OBS/PR; docs/ai-usage-report.md theo Phụ lục F; docs/obs-evidence.md.
Hạn: ____
Nhánh: docs/final-docs
Trạng thái: CẦN LÀM
```

```
TASK-26 – Merge dev → main + gắn tag + nộp bài
Người làm: Công
Mô tả: Sau khi test tích hợp đạt, merge dev vào main, kiểm tra lại toàn bộ link, dán link repo/Trello/Drive OBS vào bài nộp.
Hạn: ____
Nhánh: main
Trạng thái: CẦN LÀM
```

```
TASK-27 – Quay 17 video OBS
Người làm: Từng SV quay màn hình của mình (xem docs/obs-evidence.md)
Mô tả: Mỗi video đủ 12 ý: có mặt SV, giọng nói, mockup Figma, mở file mã, giải thích layout/HTML/CSS/JS, sửa trực tiếp 1 chỗ, chạy thử, commit, nói rõ task/nhánh/commit.
Hạn: ____
Trạng thái: CẦN LÀM
```
