# LineWatch – Theo dõi ca sản xuất và sự cố dây chuyền

> Bài tập lớn học phần **Phát triển ứng dụng web cơ bản – CSE122**
> Đề tài: **BTL-14** · Lĩnh vực: Sản xuất / Manufacturing
> Nhóm: **Đinh Minh Đăng · Tạ Việt Trung · Nguyễn Thành Công**

## Ngữ cảnh

Thông tin sự cố trong xưởng thường nằm ở giấy hoặc chat, gây khó cho trưởng ca và bảo trì khi cần ưu tiên xử lý.

## Phát biểu vấn đề

- **P1.** Sự cố thiếu biểu mẫu chuẩn.
- **P2.** Trạng thái máy/công đoạn khó theo dõi.
- **P3.** Bảo trì thiếu bối cảnh.
- **P4.** Quản lý khó tổng hợp downtime.

## Mục tiêu

- O1. Biến bài toán thực tế thành sản phẩm Frontend có hành trình người dùng rõ ràng.
- O2. Thiết kế đầy đủ giao diện cho từng vai trò (4 vai trò, 17 màn hình).
- O3. CRUD / trạng thái nghiệp vụ có ý nghĩa (không hình thức).
- O4. JavaScript/DOM: tìm kiếm, lọc, validation, modal, toast, kết xuất dữ liệu.
- O5. Dữ liệu giả lập bằng JS module + LocalStorage.
- O6. 3 trải nghiệm AI mô phỏng được ở Frontend.
- O7. Làm việc nhóm bằng Trello + Git/GitHub (nhánh + PR).

## Các vai trò

| Vai trò | Tài khoản demo | Mật khẩu | Trách nhiệm chính |
|---|---|---|---|
| Công nhân vận hành | `operator1` | `123456` | Báo sự cố và xem trạng thái line |
| Trưởng ca | `supervisor1` | `123456` | Điều phối sự cố và bàn giao ca |
| Kỹ thuật bảo trì | `maintenance1` | `123456` | Xử lý sự cố và ghi nguyên nhân |
| Quản trị viên | `admin1` | `123456` | Quản lý máy, dây chuyền và báo cáo |

## Luồng người dùng

```text
Đăng nhập (chọn vai trò)
→ Nghiệp vụ theo vai trò (báo sự cố / điều phối / xử lý / quản lý)
→ Xem trạng thái, dữ liệu, phản hồi
→ AI hỗ trợ (phân loại / tóm tắt / phát hiện lỗi lặp)
→ Người dùng Chấp nhận / Sửa / Từ chối / Tạo lại
→ Vai trò khác duyệt / xử lý tiếp
→ Bảng điều khiển / báo cáo / hoàn tất
```

Vòng đời sự cố: `Mới → Đang chờ → Đang xử lý → Đã xử lý` (hoặc `Đã hủy`).

## Bảng kiểm kê màn hình

Xem chi tiết tại [docs/screen-inventory.md](docs/screen-inventory.md). Tổng: **17 màn hình** (5 trang chung + 12 trang theo vai trò).

## Tính năng AI

| AI | Tên | Trang | Chức năng |
|---|---|---|---|
| AI-1 | Incident Classifier | `operator-incident-create.html` | Phân loại lỗi + gợi ý mức ưu tiên theo từ khóa |
| AI-2 | Shift Summary | `supervisor-shift-dashboard.html` | Tóm tắt ca: sự cố, downtime, việc tồn → lưu thành ghi chú bàn giao |
| AI-3 | Repeat Failure Insight | `maintenance-machine-history.html` | Đếm tần suất loại lỗi của máy → phát hiện mẫu lỗi lặp + đề xuất bảo trì |

Cả 3 đều theo luồng: **Nhập → Đang xử lý → Kết quả → Giải thích → Chấp nhận / Sửa / Từ chối / Tạo lại**, và đều có **trạng thái thất bại** ("Không đủ dữ liệu…", "AI chưa chắc chắn…").

## Công nghệ

- HTML5 + CSS thuần (Flexbox, Grid, CSS variables) + JavaScript vanilla
- Dữ liệu: mock data trong `js/data.js` + LocalStorage (không cần server)
- Chạy trực tiếp: mở `pages/index.html` bằng trình duyệt (không cần cài gì thêm)

## Thành viên nhóm

| SV | Họ tên | Vai trò chính | Trách nhiệm chéo |
|---|---|---|---|
| SV1 | Đinh Minh Đăng | Công nhân vận hành + trang chung | Hệ thống thiết kế / Điều hướng / Accessibility |
| SV2 | Tạ Việt Trung | Trưởng ca | JavaScript / Dữ liệu / Tương tác AI |
| SV3 | Nguyễn Thành Công | Kỹ thuật bảo trì + Quản trị viên | Responsive / Tích hợp / Phát hành / QA |

Chi tiết: [docs/team-assignment.md](docs/team-assignment.md)

## Phân công công việc

Bảng task Trello (copy-paste): [docs/trello-tasks.md](docs/trello-tasks.md)

## Quy trình Git

```text
main          # nhánh ổn định (chỉ merge từ dev)
dev           # nhánh tích hợp
feature/...   # mỗi màn hình 1 nhánh
```

Quy trình: Trello task → tạo nhánh → code → commit (`feat:`/`fix:`/`docs:`) → push → PR → review chéo → merge vào `dev` → merge `main`.
Hướng dẫn chi tiết từng lệnh: [HUONG-DAN-GITHUB.md](HUONG-DAN-GITHUB.md)

## Figma / Canva

Link lưu tại [design/figma-link.txt](design/figma-link.txt), ảnh mockup xuất vào `design/mockups/`.

## Demo

1. Mở thư mục dự án.
2. Chạy file `pages/index.html` bằng trình duyệt (Chrome/Edge).
3. Bấm **Đăng nhập**, chọn vai trò, mật khẩu `123456`.
4. Muốn đưa dữ liệu về ban đầu: Hồ sơ → **Đặt lại dữ liệu demo**.

## Minh chứng OBS

Mỗi màn hình = 1 video OBS. Bảng theo dõi: [docs/obs-evidence.md](docs/obs-evidence.md)

## Khai báo sử dụng AI

Xem [docs/ai-usage-report.md](docs/ai-usage-report.md)

## Cấu trúc thư mục

```text
cse122-linewatch-teamXX/
├── README.md
├── HUONG-DAN-GITHUB.md
├── docs/                 # tài liệu dự án
├── design/               # link Figma + mockups
├── pages/                # 17 trang HTML
├── css/
│   ├── style.css         # giao diện chung
│   └── responsive.css    # media queries tablet/mobile
└── js/
    ├── data.js           # mock data + DB LocalStorage
    ├── main.js           # nav, đăng nhập, toast, modal, tiện ích
    ├── ai.js             # 3 tính năng AI mô phỏng
    └── pages/            # mỗi trang 1 file JS riêng
```
