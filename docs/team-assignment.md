# Phân công nhóm – LineWatch (BTL-14)

## Thành viên

| SV | Họ tên | Vai trò phụ trách chính | Trách nhiệm chéo (xuyên suốt) |
|---|---|---|---|
| SV1 | Đinh Minh Đăng | Công nhân vận hành (3 màn) + trang chung: index, login, profile, 404 | Hệ thống thiết kế / Điều hướng / Khả năng tiếp cận |
| SV2 | Tạ Việt Trung | Trưởng ca (3 màn) + trang chung: notifications | JavaScript / Dữ liệu mock / Tương tác AI |
| SV3 | Nguyễn Thành Công | Kỹ thuật bảo trì (3 màn) + Quản trị viên (3 màn) | Responsive / Tích hợp / Phát hành / QA |

## Lát cắt dọc của từng thành viên (bắt buộc, mỗi người ≥ 1 luồng end-to-end)

- **SV1 Đăng:** luồng *Báo sự cố chuẩn* — Figma → `operator-incident-create.html` → CSS → JS validation
  → lưu LocalStorage → responsive → nhánh `feature/operator-incident-create` → commit → PR → OBS.
- **SV2 Trung:** luồng *Điều phối sự cố* — Figma → `supervisor-incident-board.html` → kanban CSS → JS chuyển
  trạng thái/phân công → dữ liệu incidents → responsive → nhánh `feature/supervisor-incident-board` → commit → PR → OBS.
- **SV3 Công:** luồng *Xử lý & phòng ngừa* — Figma → `maintenance-incident-detail.html` + `maintenance-machine-history.html`
  → CSS timeline → JS cập nhật trạng thái/CRUD nhật ký → dữ liệu maintenanceTasks → responsive
  → nhánh `feature/maintenance-incident-detail` → commit → PR → OBS.

## Khối lượng màn hình

| SV | Số màn hình | Danh sách |
|---|---:|---|
| SV1 Đăng | 7 | index, login, profile, 404, operator-line-status, operator-incident-create, operator-shift-incidents |
| SV2 Trung | 4 | notifications, supervisor-shift-dashboard, supervisor-incident-board, supervisor-handover-note |
| SV3 Công | 6 | maintenance-queue, maintenance-incident-detail, maintenance-machine-history, admin-machine-management, admin-line-management, admin-downtime-report |

> SV2 ít màn hình hơn nhưng gánh trách nhiệm chéo nặng nhất: `js/data.js`, `js/main.js`, `js/ai.js`
> (toàn bộ hạ tầng dữ liệu + 3 luồng AI) và review PR của cả nhóm.

## Quy tắc review chéo (PR)

| Người tạo PR | Người review |
|---|---|
| SV1 Đăng | SV2 Trung |
| SV2 Trung | SV3 Công |
| SV3 Công | SV1 Đăng |

PR chỉ được merge vào `dev` khi có ít nhất 1 review duyệt.
