# Báo cáo đề tài – LineWatch (BTL-14)

## 1. Ngữ cảnh

Trong các xưởng sản xuất, thông tin sự cố thường được ghi trên giấy hoặc nhắn qua chat nhóm.
Khi có nhiều sự cố cùng lúc, trưởng ca khó biết cái nào cần ưu tiên, bảo trì thiếu bối cảnh
(lịch sử máy, ai báo, hiện tượng gì), còn quản lý thì không tổng hợp được downtime để cải tiến.

## 2. Phát biểu vấn đề

- **P1.** Sự cố thiếu biểu mẫu chuẩn → thông tin không đủ để xử lý.
- **P2.** Trạng thái máy/công đoạn khó theo dõi → không biết line nào đang dừng.
- **P3.** Bảo trì thiếu bối cảnh → xử lý chậm, dễ bỏ sót lỗi lặp lại.
- **P4.** Quản lý khó tổng hợp downtime → không có số liệu ra quyết định.

## 3. Mục tiêu

O1–O7 như trong README. Trọng tâm: biến quy trình giấy/chat thành một sản phẩm Frontend
mô phỏng đầy đủ: báo sự cố chuẩn hóa → điều phối theo trạng thái → xử lý có ghi nguyên nhân
→ tổng hợp downtime + AI hỗ trợ cả 3 khâu.

## 4. Vai trò & phân tích (10 câu hỏi cho mỗi vai trò – tóm tắt)

### Công nhân vận hành
1. Người trực tiếp vận hành máy trên line.
2. Mục tiêu: báo sự cố nhanh, đúng thông tin; biết máy nào đang chạy/dừng.
3. Xem: trạng thái line, máy, sự cố mình đã báo.
4. Tạo: báo cáo sự cố (form chuẩn).
5. Sửa: sự cố còn ở trạng thái "Mới" do mình báo.
6. Hủy: báo cáo sai (chuyển trạng thái "Đã hủy").
7. Tìm/lọc: theo tiêu đề, máy, trạng thái, ưu tiên.
8. Dashboard: không cần, chỉ cần màn Line Status.
9. AI: AI-1 gợi ý loại sự cố + mức ưu tiên khi báo.
10. Tương tác: sự cố báo lên sẽ được trưởng ca điều phối, bảo trì xử lý.

### Trưởng ca
1. Người điều phối cả ca sản xuất.
2. Mục tiêu: không sót sự cố, phân công đúng người, bàn giao rõ ràng.
3. Xem: thống kê ca, sự cố đang mở, máy dừng/cảnh báo.
4. Tạo: ghi chú bàn giao ca (thủ công hoặc từ AI-2).
5. Sửa: trạng thái sự cố, người xử lý, ghi chú bàn giao.
6. Xóa: ghi chú bàn giao sai.
7. Tìm/lọc: lọc sự cố theo ưu tiên, dây chuyền.
8. Dashboard: Shift Dashboard + Incident Board dạng kanban.
9. AI: AI-2 tóm tắt ca phục vụ bàn giao.
10. Tương tác: nhận sự cố từ công nhân → phân công bảo trì → nhận kết quả.

### Kỹ thuật bảo trì
1. Kỹ thuật viên xử lý sự cố máy.
2. Mục tiêu: xử lý đúng thứ tự ưu tiên, ghi lại nguyên nhân.
3. Xem: hàng chờ việc, chi tiết sự cố, lịch sử máy.
4. Tạo: nhật ký bảo trì, ghi nguyên nhân/biện pháp.
5. Sửa: trạng thái sự cố, downtime, nhật ký bảo trì.
6. Xóa: nhật ký bảo trì ghi sai.
7. Tìm/lọc: tab Việc của tôi / Chưa phân công / Đã hoàn thành.
8. Dashboard: hàng chờ xếp theo ưu tiên.
9. AI: AI-3 phát hiện mẫu lỗi lặp → đề xuất bảo trì phòng ngừa.
10. Tương tác: nhận việc từ trưởng ca → báo hoàn thành → máy chạy lại.

### Quản trị viên
1. Người quản lý danh mục máy, dây chuyền.
2. Mục tiêu: dữ liệu tài sản đúng, có báo cáo downtime.
3. Xem: danh sách máy, dây chuyền, báo cáo.
4. Tạo: máy mới, dây chuyền mới.
5. Sửa: thông tin máy/dây chuyền.
6. Xóa: dùng **Lưu trữ / Khôi phục** (không xóa cứng dữ liệu nghiệp vụ).
7. Tìm/lọc: theo tên, mã máy, line, trạng thái.
8. Dashboard: báo cáo downtime (thống kê + biểu đồ cột + top máy).
9. AI: xem AI-3 (được cấp quyền) khi cần phân tích.
10. Tương tác: cung cấp dữ liệu nền cho cả 3 vai trò kia.

## 5. Thực thể & CRUD

| Thực thể | C | R | U | D/Archive | Ghi chú |
|---|:-:|:-:|:-:|:-:|---|
| `lines` | ✓ | ✓ | ✓ | Archive | admin-line-management |
| `machines` | ✓ | ✓ | ✓ | Archive | admin-machine-management |
| `incidents` | ✓ | ✓ | ✓ | Hủy (Đã hủy) | vòng đời trạng thái, không xóa cứng |
| `maintenanceTasks` | ✓ | ✓ | ✓ | ✓ | nhật ký bảo trì (machine-history) |
| `shiftNotes` | ✓ | ✓ | ✓ | ✓ | ghi chú bàn giao (handover-note) |
| `reports` | – | ✓ | – | – | báo cáo tính từ incidents + xuất CSV |
| `notifications` | ✓(hệ thống) | ✓ | ✓ (đọc) | ✓ | sinh tự động khi có sự kiện |

## 6. Vòng đời trạng thái sự cố

```text
Mới ──→ Đang chờ ──→ Đang xử lý ──→ Đã xử lý
  │                                   (máy chạy lại,
  └────────→ Đã hủy (báo nhầm)         ghi nhật ký bảo trì)
```

## 7. Tính năng AI

Xem chi tiết trong README và `docs/ai-usage-report.md`. Nguyên tắc chung:
AI mô phỏng bằng luật JavaScript trên dữ liệu LocalStorage, có giải thích,
có độ tin cậy, có trạng thái thất bại/không chắc chắn, và người dùng luôn
có quyền Chấp nhận / Sửa / Từ chối / Tạo lại.

## 8. Giới hạn phạm vi

- Không backend thật, không database thật (đúng yêu cầu môn học: frontend prototype).
- Đăng nhập chỉ mô phỏng (chọn vai trò + mật khẩu demo), không dùng cho môi trường thật.
- AI là mô phỏng theo luật (rule-based), không gọi LLM API thật.
