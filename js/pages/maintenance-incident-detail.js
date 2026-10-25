/* Chi tiet su co: hien thong tin, cap nhat trang thai, ghi nguyen nhan */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["maintenance"])) { /* sai vai tro */ }

initPage();

var user = getCurrentUser();

/* Lay id tu duong dan: maintenance-incident-detail.html?id=3 */
function getIdFromUrl() {
  var params = new URLSearchParams(location.search);
  return params.get("id");
}


function fillIncidentSelect() {
  var select = document.getElementById("incident-select");
  var incidents = DB.all("incidents");
  for (var i = 0; i < incidents.length; i++) {
    var inc = incidents[i];
    if (inc.status === "Đã xử lý" || inc.status === "Đã hủy") { continue; }
    var opt = document.createElement("option");
    opt.value = inc.id;
    opt.textContent = inc.title + " (" + machineName(inc.machineId) + ") – " + inc.priority;
    select.appendChild(opt);
  }
}


function renderDetail(id) {
  var box = document.getElementById("detail-area");

  if (!id) {
    box.innerHTML =
      '<div class="card empty-state"><span class="empty-icon">👈</span>Chọn một sự cố ở danh sách trên để xem chi tiết.</div>';
    return;
  }

  var inc = DB.find("incidents", id);
  if (inc === null) {
    box.innerHTML =
      '<div class="card error-state">Không tìm thấy sự cố này. <a href="maintenance-queue.html">Về hàng chờ</a></div>';
    return;
  }

  /* Dem lich su su co cua cung cai may (boi canh cho bao tri) */
  var incidents = DB.all("incidents");
  var sameCount = 0;
  for (var i = 0; i < incidents.length; i++) {
    if (incidents[i].machineId === inc.machineId && incidents[i].id !== inc.id) {
      sameCount++;
    }
  }

  var isDone = inc.status === "Đã xử lý";

  box.innerHTML =
    '<div class="grid-2">' +
      '<div class="card">' +
        "<h3 class='card-title'>Thông tin sự cố</h3>" +
        "<p><strong>" + escapeHtml(inc.title) + "</strong></p>" +
        "<p>" + statusBadge(inc.status) + " " + priorityBadge(inc.priority) +
        ' <span class="badge badge-muted">' + escapeHtml(inc.category) + "</span></p>" +
        "<p class='mt-8'>" + escapeHtml(inc.description) + "</p>" +
        "<hr style='margin:12px 0; border:none; border-top:1px solid var(--border);'>" +
        "<p style='font-size:14px;'>Máy: <strong>" + escapeHtml(machineName(inc.machineId)) + "</strong> · " + escapeHtml(lineName(inc.lineId)) + "</p>" +
        "<p style='font-size:14px;'>Người báo: " + escapeHtml(inc.reporter) + " · " + formatDateTime(inc.createdAt) + "</p>" +
        "<p style='font-size:14px;'>Người xử lý: " + escapeHtml(inc.assignee || "(chưa phân công)") + "</p>" +
        '<p style="font-size:14px;" class="text-muted">ℹ Máy này từng có ' + sameCount + " sự cố khác được ghi nhận. " +
        (sameCount >= 2 ? '<a href="maintenance-machine-history.html?machineId=' + inc.machineId + '">Xem lịch sử & phân tích AI →</a>' : "") + "</p>" +
      "</div>" +
      '<div class="card">' +
        "<h3 class='card-title'>Cập nhật xử lý</h3>" +
        (isDone
          ? '<div class="empty-state"><span class="empty-icon">✅</span>Sự cố đã hoàn thành xử lý.<br>' +
            (inc.rootCause ? "Nguyên nhân: " + escapeHtml(inc.rootCause) : "") + "</div>"
          : '<form id="handle-form">' +
            '<div class="form-group">' +
              '<label for="input-status">Trạng thái</label>' +
              '<select id="input-status" class="select">' +
                '<option' + (inc.status === "Mới" ? " selected" : "") + ">Mới</option>" +
                '<option' + (inc.status === "Đang chờ" ? " selected" : "") + ">Đang chờ</option>" +
                '<option' + (inc.status === "Đang xử lý" ? " selected" : "") + ">Đang xử lý</option>" +
                "<option>Đã xử lý</option>" +
              "</select>" +
            "</div>" +
            '<div class="form-group">' +
              '<label for="input-rootcause">Nguyên nhân *</label>' +
              '<textarea id="input-rootcause" class="textarea" placeholder="Nguyên nhân kỹ thuật tìm được...">' + escapeHtml(inc.rootCause || "") + "</textarea>" +
              '<div class="error-msg" id="err-rootcause">Phải ghi nguyên nhân (tối thiểu 10 ký tự) trước khi đánh dấu Đã xử lý.</div>' +
            "</div>" +
            '<div class="form-group">' +
              '<label for="input-action">Biện pháp xử lý</label>' +
              '<textarea id="input-action" class="textarea" style="min-height:60px;" placeholder="Đã làm gì để khắc phục...">' + escapeHtml(inc.actionNote || "") + "</textarea>" +
            "</div>" +
            '<div class="form-group">' +
              '<label for="input-downtime">Thời gian dừng máy (phút)</label>' +
              '<input type="number" id="input-downtime" class="input" min="0" value="' + (inc.downtimeMin || 0) + '">' +
              '<div class="error-msg" id="err-downtime">Thời gian phải là số không âm.</div>' +
            "</div>" +
            '<button type="submit" class="btn btn-primary">💾 Lưu cập nhật</button>' +
            (inc.assignee !== user.name && inc.assignee !== ""
              ? ' <button type="button" class="btn btn-ok" onclick="takeJob(' + inc.id + ')">Nhận việc này</button>'
              : "") +
          "</form>") +
      "</div>" +
    "</div>";

  /* Gan su kien cho form xu ly */
  var form = document.getElementById("handle-form");
  if (form !== null) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      saveHandling(inc.id);
    });
  }
}


function saveHandling(id) {
  var status = document.getElementById("input-status").value;
  var rootCause = document.getElementById("input-rootcause").value.trim();
  var actionNote = document.getElementById("input-action").value.trim();
  var downtimeRaw = document.getElementById("input-downtime").value;
  var downtime = Number(downtimeRaw);

  document.getElementById("err-rootcause").classList.remove("show");
  document.getElementById("err-downtime").classList.remove("show");

  var hasError = false;
  if (status === "Đã xử lý" && rootCause.length < 10) {
    document.getElementById("err-rootcause").classList.add("show");
    hasError = true;
  }
  if (downtimeRaw === "" || isNaN(downtime) || downtime < 0) {
    document.getElementById("err-downtime").classList.add("show");
    hasError = true;
  }
  if (hasError) { return; }

  var inc = DB.find("incidents", id);
  DB.update("incidents", id, {
    status: status,
    rootCause: rootCause,
    actionNote: actionNote,
    downtimeMin: downtime,
    assignee: inc.assignee === "" ? user.name : inc.assignee
  });

  if (status === "Đã xử lý") {
    /* May chay tro lai */
    DB.update("machines", inc.machineId, { status: "running" });
    /* Ghi nhat ky bao tri */
    DB.add("maintenanceTasks", {
      machineId: inc.machineId,
      taskDate: todayStr(),
      type: "Sửa chữa",
      note: inc.title + ". Nguyên nhân: " + rootCause + (actionNote ? ". Biện pháp: " + actionNote : ""),
      technician: user.name,
      createdAt: nowISO()
    });
    addNotification(1, "Sự cố '" + inc.title + "' đã được xử lý xong.");
    addNotification(2, "Bảo trì hoàn thành: " + inc.title + " (downtime " + downtime + " phút).");
    showToast("Hoàn thành! Máy đã chạy trở lại.", "success");
  } else {
    showToast("Đã lưu cập nhật.", "success");
  }

  renderDetail(id);
}

/* Nhan viec tu trang chi tiet */
function takeJob(id) {
  DB.update("incidents", id, { assignee: user.name, status: "Đang xử lý" });
  renderDetail(id);
  showToast("Bạn đã nhận việc này.", "success");
}


fillIncidentSelect();

document.getElementById("incident-select").addEventListener("change", function () {
  renderDetail(this.value);
});

var urlId = getIdFromUrl();
if (urlId !== null) {
  document.getElementById("incident-select").value = urlId;
}
fakeLoading("detail-area", function () {
  renderDetail(urlId || document.getElementById("incident-select").value);
});
