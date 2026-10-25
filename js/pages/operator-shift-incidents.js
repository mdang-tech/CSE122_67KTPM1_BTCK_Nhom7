/* Trang su co ca cua toi: tim kiem, loc, xem, sua, huy su co */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["operator"])) { /* sai vai tro */ }

initPage();

var user = getCurrentUser();

/* ---------- Render bang su co ---------- */

function getFilteredIncidents() {
  var keyword = document.getElementById("search-box").value.toLowerCase().trim();
  var status = document.getElementById("filter-status").value;
  var priority = document.getElementById("filter-priority").value;

  var all = DB.all("incidents");
  var result = [];
  for (var i = 0; i < all.length; i++) {
    var inc = all[i];
    /* Chi hien su co do minh bao */
    if (inc.reporter !== user.name) { continue; }
    if (status !== "all" && inc.status !== status) { continue; }
    if (priority !== "all" && inc.priority !== priority) { continue; }
    var text = (inc.title + " " + machineName(inc.machineId)).toLowerCase();
    if (keyword !== "" && text.indexOf(keyword) === -1) { continue; }
    result.push(inc);
  }
  /* Moi nhat len dau */
  result.sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
  return result;
}

function renderTable() {
  var box = document.getElementById("incident-table-box");
  var list = getFilteredIncidents();

  /* Bao cho nguoi dung biet dang loc duoc bao nhieu su co */
  document.getElementById("result-count").textContent =
    "Đang hiện " + list.length + " kết quả.";

  /* Trang thai rong */
  if (list.length === 0) {
    box.innerHTML =
      '<div class="empty-state">' +
      '<span class="empty-icon">📭</span>' +
      "Không có sự cố nào khớp bộ lọc.<br>" +
      '<a href="operator-incident-create.html" class="btn btn-danger mt-8">+ Báo sự cố mới</a>' +
      "</div>";
    return;
  }

  var html =
    "<table class='table'>" +
    "<tr><th>Thời điểm</th><th>Tiêu đề</th><th>Máy</th><th>Loại</th><th>Ưu tiên</th><th>Trạng thái</th><th>Hành động</th></tr>";

  for (var i = 0; i < list.length; i++) {
    var inc = list[i];
    var canEdit = inc.status === "Mới";
    html +=
      "<tr>" +
      "<td>" + formatDateTime(inc.createdAt) + "</td>" +
      "<td><a href='#' onclick='showDetail(" + inc.id + "); return false;'>" + escapeHtml(inc.title) + "</a></td>" +
      "<td>" + escapeHtml(machineName(inc.machineId)) + "</td>" +
      "<td>" + escapeHtml(inc.category) + "</td>" +
      "<td>" + priorityBadge(inc.priority) + "</td>" +
      "<td>" + statusBadge(inc.status) + "</td>" +
      "<td>" +
      (canEdit
        ? '<button class="btn btn-outline btn-sm" onclick="openEdit(' + inc.id + ')">Sửa</button> ' +
          '<button class="btn btn-danger btn-sm" onclick="cancelIncident(' + inc.id + ')">Hủy</button>'
        : '<span class="text-muted">—</span>') +
      "</td>" +
      "</tr>";
  }
  html += "</table>";
  box.innerHTML = html;
}

/* ---------- Xem chi tiet ---------- */

function showDetail(id) {
  var inc = DB.find("incidents", id);
  if (inc === null) { return; }
  var body = document.getElementById("modal-detail-body");
  body.innerHTML =
    "<p><strong>" + escapeHtml(inc.title) + "</strong></p>" +
    "<p>" + statusBadge(inc.status) + " " + priorityBadge(inc.priority) + "</p>" +
    "<p class='text-muted mt-8'>" + escapeHtml(inc.description) + "</p>" +
    "<hr style='margin:12px 0; border:none; border-top:1px solid var(--border);'>" +
    "<p style='font-size:14px;'>Máy: <strong>" + escapeHtml(machineName(inc.machineId)) + "</strong> · Line: " + escapeHtml(lineName(inc.lineId)) + "</p>" +
    "<p style='font-size:14px;'>Loại sự cố: " + escapeHtml(inc.category) + " · Người báo: " + escapeHtml(inc.reporter) + "</p>" +
    "<p style='font-size:14px;'>Thời điểm: " + formatDateTime(inc.createdAt) + " · Downtime: " + (inc.downtimeMin || 0) + " phút</p>" +
    "<p style='font-size:14px;'>Người xử lý: " + escapeHtml(inc.assignee || "(chưa phân công)") + "</p>" +
    (inc.rootCause ? "<p style='font-size:14px;'>Nguyên nhân: " + escapeHtml(inc.rootCause) + "</p>" : "") +
    (inc.actionNote ? "<p style='font-size:14px;'>Ghi chú xử lý: " + escapeHtml(inc.actionNote) + "</p>" : "");
  openModal("modal-detail");
}

/* ---------- Sua su co (chi khi con o trang thai Moi) ---------- */

function fillEditSelects() {
  var cat = document.getElementById("edit-category");
  var pri = document.getElementById("edit-priority");
  cat.innerHTML = "";
  pri.innerHTML = "";
  for (var i = 0; i < CATEGORIES.length; i++) {
    cat.innerHTML += "<option>" + CATEGORIES[i] + "</option>";
  }
  for (var j = 0; j < PRIORITIES.length; j++) {
    pri.innerHTML += "<option>" + PRIORITIES[j] + "</option>";
  }
}

function openEdit(id) {
  var inc = DB.find("incidents", id);
  if (inc === null) { return; }
  fillEditSelects();
  document.getElementById("edit-id").value = inc.id;
  document.getElementById("edit-title").value = inc.title;
  document.getElementById("edit-desc").value = inc.description;
  document.getElementById("edit-category").value = inc.category;
  document.getElementById("edit-priority").value = inc.priority;
  document.getElementById("err-edit").classList.remove("show");
  openModal("modal-edit");
}

document.getElementById("edit-form").addEventListener("submit", function (event) {
  event.preventDefault();
  var id = document.getElementById("edit-id").value;
  var title = document.getElementById("edit-title").value.trim();
  var desc = document.getElementById("edit-desc").value.trim();

  if (title.length < 5 || desc.length < 15) {
    document.getElementById("err-edit").classList.add("show");
    return;
  }

  DB.update("incidents", id, {
    title: title,
    description: desc,
    category: document.getElementById("edit-category").value,
    priority: document.getElementById("edit-priority").value
  });
  closeModal("modal-edit");
  renderTable();
  showToast("Đã lưu thay đổi sự cố.", "success");
});

/* ---------- Huy su co (bao cao sai) ---------- */

function cancelIncident(id) {
  if (!confirm("Hủy báo cáo sự cố này? Chỉ dùng khi bạn báo nhầm.")) { return; }
  DB.update("incidents", id, { status: "Đã hủy" });
  renderTable();
  showToast("Đã hủy sự cố.", "info");
}

/* ---------- Gan su kien ---------- */

document.getElementById("search-box").addEventListener("input", renderTable);
document.getElementById("filter-status").addEventListener("change", renderTable);
document.getElementById("filter-priority").addEventListener("change", renderTable);

/* Nut xoa bo loc: tra 3 o ve mac dinh roi ve lai bang */
document.getElementById("btn-reset").addEventListener("click", function () {
  document.getElementById("search-box").value = "";
  document.getElementById("filter-status").value = "all";
  document.getElementById("filter-priority").value = "all";
  renderTable();
});

fakeLoading("incident-table-box", renderTable);
