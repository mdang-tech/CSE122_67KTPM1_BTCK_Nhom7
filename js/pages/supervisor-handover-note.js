/* Ban giao ca: CRUD ghi chu ban giao (shiftNotes) */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["supervisor"])) { /* sai vai tro */ }

initPage();

var user = getCurrentUser();

/* Mac dinh ngay hom nay */
document.getElementById("input-date").value = todayStr();

/* ---------- Render danh sach ---------- */

function renderNotes() {
  var box = document.getElementById("note-list");
  var notes = DB.all("shiftNotes");

  /* Moi nhat len dau */
  notes.sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });

  /* Trang thai rong */
  if (notes.length === 0) {
    box.innerHTML =
      '<div class="empty-state"><span class="empty-icon">📝</span>Chưa có ghi chú bàn giao nào.<br>' +
      "Tạo ghi chú đầu tiên ở biểu mẫu bên trái, hoặc dùng AI tóm tắt ca trong Bảng điều khiển.</div>";
    return;
  }

  var html = "";
  for (var i = 0; i < notes.length; i++) {
    var n = notes[i];
    html +=
      '<div class="card" style="margin-bottom:10px;">' +
      "<strong>" + escapeHtml(n.shift) + " – " + escapeHtml(n.workDate) + "</strong> " +
      '<span class="badge badge-muted">' + escapeHtml(n.author) + "</span><br>" +
      '<span style="white-space:pre-line; font-size:14px;">' + escapeHtml(n.content) + "</span>" +
      (n.pendingTasks
        ? '<div class="mt-8" style="font-size:14px;"><strong>Việc tồn:</strong> ' + escapeHtml(n.pendingTasks) + "</div>"
        : "") +
      '<div class="mt-8">' +
      '<button class="btn btn-outline btn-sm" onclick="openEdit(' + n.id + ')">Sửa</button> ' +
      '<button class="btn btn-danger btn-sm" onclick="deleteNote(' + n.id + ')">Xóa</button>' +
      "</div>" +
      "</div>";
  }
  box.innerHTML = html;
}

/* ---------- Tao moi ---------- */

document.getElementById("note-form").addEventListener("submit", function (event) {
  event.preventDefault();

  var shift = document.getElementById("input-shift").value;
  var workDate = document.getElementById("input-date").value;
  var content = document.getElementById("input-content").value.trim();
  var pending = document.getElementById("input-pending").value.trim();

  var errs = document.querySelectorAll("#note-form .error-msg");
  for (var i = 0; i < errs.length; i++) { errs[i].classList.remove("show"); }

  var hasError = false;
  if (shift === "") {
    document.getElementById("err-shift").classList.add("show");
    hasError = true;
  }
  if (workDate === "") {
    document.getElementById("err-date").classList.add("show");
    hasError = true;
  }
  if (content.length < 20) {
    document.getElementById("err-content").classList.add("show");
    hasError = true;
  }
  if (hasError) { return; }

  DB.add("shiftNotes", {
    shift: shift,
    workDate: workDate,
    author: user.name,
    content: content,
    pendingTasks: pending,
    createdAt: nowISO()
  });

  this.reset();
  document.getElementById("input-date").value = todayStr();
  renderNotes();
  showToast("Đã lưu ghi chú bàn giao!", "success");
});

/* ---------- Sua ---------- */

function openEdit(id) {
  var n = DB.find("shiftNotes", id);
  if (n === null) { return; }
  document.getElementById("edit-id").value = n.id;
  document.getElementById("edit-shift").value = n.shift;
  document.getElementById("edit-date").value = n.workDate;
  document.getElementById("edit-content").value = n.content;
  document.getElementById("edit-pending").value = n.pendingTasks || "";
  document.getElementById("err-edit").classList.remove("show");
  openModal("modal-edit");
}

document.getElementById("edit-form").addEventListener("submit", function (event) {
  event.preventDefault();
  var id = document.getElementById("edit-id").value;
  var content = document.getElementById("edit-content").value.trim();

  if (content.length < 20) {
    document.getElementById("err-edit").classList.add("show");
    return;
  }

  DB.update("shiftNotes", id, {
    shift: document.getElementById("edit-shift").value,
    workDate: document.getElementById("edit-date").value,
    content: content,
    pendingTasks: document.getElementById("edit-pending").value.trim()
  });
  closeModal("modal-edit");
  renderNotes();
  showToast("Đã cập nhật ghi chú.", "success");
});

/* ---------- Xoa ---------- */

function deleteNote(id) {
  if (!confirm("Xóa ghi chú bàn giao này? Hành động không thể hoàn tác.")) { return; }
  DB.remove("shiftNotes", id);
  renderNotes();
  showToast("Đã xóa ghi chú.", "info");
}

/* ---------- Khoi chay ---------- */

fakeLoading("note-list", renderNotes);
