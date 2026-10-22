# Hướng dẫn up dự án lên GitHub (cho người mới)

Làm lần lượt theo từng bước. Chỉ **1 người** (nên là Công – SV3) làm Phần A để tạo repo,
sau đó 2 bạn còn lại làm Phần B để clone về máy mình.

---

## Phần 0 – Chuẩn bị (làm 1 lần duy nhất trên mỗi máy)

### 0.1. Tạo tài khoản GitHub
- Vào https://github.com → **Sign up** → dùng email trường (nếu có).
- Cả 3 thành viên đều phải có tài khoản (để review PR).

### 0.2. Cài Git
- Tải Git tại https://git-scm.com/download/win → cài đặt, cứ bấm **Next** để mặc định.
- Kiểm tra: mở **Git Bash** (chuột phải vào thư mục dự án → *Open Git Bash here*), gõ:
  ```bash
  git --version
  ```
  Hiện số phiên bản là thành công.

### 0.3. Khai báo tên + email cho Git (trên máy ai người đó làm)
```bash
git config --global user.name "Ten Cua Ban"
git config --global user.email "email-cua-ban@ex.com"
```
> Email nên trùng email tài khoản GitHub để commit hiện đúng avatar.

---

## Phần A – Người đầu tiên up toàn bộ dự án lên GitHub

### A.1. Tạo repo trên GitHub
1. Đăng nhập GitHub → nút **+** góc phải → **New repository**.
2. Đặt tên: `cse122-linewatch-teamXX` (XX = số nhóm thật của bạn).
3. Chọn **Public**.
4. **KHÔNG tick** "Add a README" (vì mình đã có sẵn file).
5. Bấm **Create repository**. GitHub sẽ hiện trang hướng dẫn — để nguyên đó.

### A.2. Đưa mã nguồn lên
Mở Git Bash **trong thư mục dự án** (chuột phải vào `cse122-linewatch-teamXX` → *Open Git Bash here*), gõ lần lượt:

```bash
# 1. Khởi tạo git cho thư mục này
git init

# 2. Thêm tất cả file vào "vùng chờ"
git add .

# 3. Commit đầu tiên
git commit -m "feat: initial project structure with 17 screens"

# 4. Đổi tên nhánh chính thành main (nếu git báo nhánh là master)
git branch -M main

# 5. Nối repo local với repo GitHub (THAY tên-user và tên-repo cho đúng!)
git remote add origin https://github.com/ten-user/cse122-linewatch-teamXX.git

# 6. Đẩy mã lên GitHub
git push -u origin main
```

Lần push đầu Git hỏi đăng nhập → bấm **Sign in with your browser** → đăng nhập GitHub → Allow.

Xong! Vào trang repo sẽ thấy toàn bộ file.

### A.3. Tạo nhánh dev (nhánh tích hợp bắt buộc theo hướng dẫn)
```bash
git checkout -b dev
git push -u origin dev
```

### A.4. Mời 2 bạn còn lại vào repo
Trang repo → **Settings** → mục **Collaborators** → **Add people** → nhập username GitHub
của 2 bạn → 2 bạn vào email/GitHub bấm **Accept**.

---

## Phần B – 2 thành viên còn lại lấy code về máy

```bash
# Vào thư mục muốn chứa dự án, ví dụ:
cd /d/Website/BTL

# Clone repo (THAY link cho đúng repo của nhóm)
git clone https://github.com/ten-user/cse122-linewatch-teamXX.git

# Vào thư mục vừa clone
cd cse122-linewatch-teamXX
```

---

## Phần C – Quy trình làm việc hằng ngày (BẮT BUỘC theo đề bài)

Mỗi màn hình = 1 task Trello = 1 nhánh = 1 PR = 1 video OBS.

### C.1. Khi bắt đầu một task (ví dụ TASK-10 màn operator-line-status)
```bash
# Luôn bắt đầu từ nhánh dev mới nhất
git checkout dev
git pull

# Tạo nhánh tính năng (đúng tên trong docs/trello-tasks.md)
git checkout -b feature/operator-line-status
```

### C.2. Trong lúc code
- Commit **thường xuyên**, mỗi lần làm xong một phần nhỏ.
- Tên commit phải có tiền tố, KHÔNG dùng "update/done/final":
  ```bash
  git add .
  git commit -m "feat: add line status cards with machine badges"
  git commit -m "feat: add line and status filters"
  git commit -m "fix: correct empty state when filter returns nothing"
  ```
  Tiền tố: `feat:` (tính năng mới) · `fix:` (sửa lỗi) · `style:` (giao diện) ·
  `refactor:` (cấu trúc lại) · `docs:` (tài liệu)

### C.3. Đẩy nhánh lên GitHub
```bash
git push -u origin feature/operator-line-status
```

### C.4. Tạo Pull Request (PR)
1. Vào trang repo trên GitHub → sẽ thấy nút vàng **Compare & pull request** → bấm.
2. Base: **dev** ← Compare: **feature/operator-line-status**.
3. Tiêu đề: `feat: màn Line Status (TASK-10)`. Mô tả: thay đổi gì + link task Trello + ảnh chụp màn hình.
4. Mục **Reviewers**: chọn bạn review mình (xem bảng trong `docs/team-assignment.md`).
5. Bấm **Create pull request**.

### C.5. Người review
1. Tab **Pull requests** → mở PR → **Files changed** để xem code.
2. OK thì bấm **Approve** (Review changes → Approve → Submit review).
3. Có chỗ cần sửa thì **Comment** → người làm sửa tiếp → `git add . && git commit -m "fix: ..." && git push` (PR tự cập nhật).

### C.6. Merge
- Sau khi được Approve → người tạo PR bấm **Merge pull request** trên GitHub.
- Xóa nhánh thừa: `git branch -d feature/operator-line-status` (local) và nút *Delete branch* trên GitHub.

### C.7. Cuối đợt (hết tất cả task)
```bash
git checkout main
git pull
git merge dev
git push
```
(Hoặc tạo PR dev → main trên GitHub rồi merge — cách này "đúng quy trình" hơn, nên dùng.)

---

## Phần D – Lệnh cứu hộ hay dùng

| Tình huống | Lệnh |
|---|---|
| Xem đang ở nhánh nào, file nào đã sửa | `git status` |
| Xem lịch sử commit | `git log --oneline` |
| Lấy code mới nhất của nhánh hiện tại | `git pull` |
| Chuyển nhánh | `git checkout ten-nhanh` |
| Lưu tạm thay đổi khi đang làm dở để chuyển nhánh | `git stash` → quay lại thì `git stash pop` |
| Lỡ commit sai thông điệp (chưa push) | `git commit --amend -m "thong diep dung"` |
| Xem khác biệt trước khi commit | `git diff` |

> **Lưu ý quan trọng:** KHÔNG BAO GIỜ chạy `git push --force` lên nhánh `main`/`dev`.
> Nếu `git pull` báo conflict: mở file bị conflict trong VS Code, tìm các dòng
> `<<<<<<<`, `=======`, `>>>>>>>`, chọn phần code đúng, xóa các dòng dấu đó, rồi
> `git add .` và `git commit`.

---

## Phần E – Cách dễ hơn: GitHub Desktop (không bắt buộc)

Nếu gõ lệnh quá khó, cài **GitHub Desktop** (https://desktop.github.com):
1. Sign in bằng tài khoản GitHub → **Clone** repo của nhóm về.
2. Tạo nhánh: *Current branch → New branch* → gõ `feature/...`.
3. Sửa code xong: cột trái hiện thay đổi → gõ Summary (VD `feat: add login form`) → **Commit to feature/...** → **Push origin**.
4. **Create Pull Request** ngay trên thanh công cụ → các bước còn lại làm trên web như Phần C.

---

## Checklist trước khi nộp (Phần Git)

- [ ] Repo có đủ thành viên là Collaborator
- [ ] Có nhánh `main` + `dev`
- [ ] Mỗi màn hình có 1 nhánh `feature/...` + 1 PR đã merge vào `dev`
- [ ] Mỗi PR có ít nhất 1 review của thành viên khác
- [ ] Commit có tiền tố `feat/fix/docs...`, không có commit "update/done/final"
- [ ] `main` đã nhận merge cuối từ `dev`
- [ ] README dán đủ link: repo, Trello, Figma, Drive video OBS
