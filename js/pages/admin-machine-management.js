/* Quan ly may: tim kiem, loc, them, sua, luu tr archive */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["admin"])) { /* sai vai tro */ }

initPage();


function fillFilters() {
  var select = document.getElementById("filter-line");
  var lines = DB.all("lines");
  for (var i = 0; i < lines.length; i++) {
    var opt = document.createElement("option");
    opt.value = lines[i].id;
    opt.textContent = lines[i].name;
    select.appendChild(opt);
  }
}

function renderTable() {
  var box = document.getElementById("machine-table-box");
  var keyword = document.getElementById("search-box").value.toLowerCase().trim();
  var lineFilter = document.getElementById("filter-line").value;
  var statusFilter = document.getElementById("filter-status").value;

  var machines = DB.all("machines");
  var list = [];
  for (var i = 0; i < machines.length; i++) {
    var m = machines[i];
    if (lineFilter !== "all" && m.lineId !== Number(lineFilter)) { continue; }
    if (statusFilter === "archived") {
      if (!m.archived) { continue; }
    } else if (statusFilter !== "all") {
      if (m.archived || m.status !== statusFilter) { continue; }
    }
    var text = (m.name + " " + m.code).toLowerCase();
    if (keyword !== "" && text.indexOf(keyword) === -1) { continue; }
    list.push(m);
  }

  if (list.length === 0) {
    box.innerHTML =
      '<div class="empty-state"><span class="empty-icon">🔍</span>Không có máy nào khớp bộ lọc.' +
      '<br><button class="btn btn-primary btn-sm mt-8" onclick="openAdd()">+ Thêm máy mới</button></div>';
    return;
  }

  var html =
    "<table class='table'>" +
    "<tr><th>Mã</th><th>Tên máy</th><th>Dây chuyền</th><th>Trạng thái</th><th>Hành động</th></tr>";
  for (var j = 0; j < list.length; j++) {
    var mc = list[j];
    html +=
      "<tr" + (mc.archived ? " style='opacity:0.5;'" : "") + ">" +
      "<td>" + escapeHtml(mc.code) + "</td>" +
      "<td>" + escapeHtml(mc.name) + (mc.archived ? ' <span class="badge badge-muted">Lưu trữ</span>' : "") + "</td>" +
      "<td>" + escapeHtml(lineName(mc.lineId)) + "</td>" +
      "<td>" + (mc.archived ? '<span class="badge badge-muted">Đã lưu trữ</span>' : machineStatusBadge(mc.status)) + "</td>" +
      "<td>" +
      '<button class="btn btn-outline btn-sm" onclick="openEdit(' + mc.id + ')">Sửa</button> ' +
      (mc.archived
        ? '<button class="btn btn-ok btn-sm" onclick="toggleArchive(' + mc.id + ', false)">Khôi phục</button>'
        : '<button class="btn btn-danger btn-sm" onclick="toggleArchive(' + mc.id + ', true)">Lưu trữ</button>') +
      "</td>" +
      "</tr>";
  }
  html += "</table>";
  box.innerHTML = html;
}


function fillLineSelect() {
  var select = document.getElementById("machine-line");
  select.innerHTML = "";
  var lines = DB.all("lines");
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].archived) { continue; }
    var opt = document.createElement("option");
    opt.value = lines[i].id;
    opt.textContent = lines[i].name;
    select.appendChild(opt);
  }
}

function hideErrors() {
  document.getElementById("err-name").classList.remove("show");
  document.getElementById("err-code").classList.remove("show");
}

function openAdd() {
  document.getElementById("modal-machine-title").textContent = "Thêm máy";
  document.getElementById("machine-form").reset();
  document.getElementById("machine-id").value = "";
  fillLineSelect();
  hideErrors();
  openModal("modal-machine");
}

function openEdit(id) {
  var m = DB.find("machines", id);
  if (m === null) { return; }
  document.getElementById("modal-machine-title").textContent = "Sửa máy";
  fillLineSelect();
  document.getElementById("machine-id").value = m.id;
  document.getElementById("machine-name").value = m.name;
  document.getElementById("machine-code").value = m.code;
  document.getElementById("machine-line").value = m.lineId;
  document.getElementById("machine-status").value = m.status;
  hideErrors();
  openModal("modal-machine");
}

document.getElementById("btn-add").addEventListener("click", openAdd);

document.getElementById("machine-form").addEventListener("submit", function (event) {
  event.preventDefault();
  hideErrors();

  var id = document.getElementById("machine-id").value;
  var name = document.getElementById("machine-name").value.trim();
  var code = document.getElementById("machine-code").value.trim();
  var lineId = Number(document.getElementById("machine-line").value);
  var status = document.getElementById("machine-status").value;

  var hasError = false;
  if (name.length < 3) {
    document.getElementById("err-name").classList.add("show");
    hasError = true;
  }
  if (code === "") {
    document.getElementById("err-code").classList.add("show");
    hasError = true;
  } else {
    /* Kiem tra trung ma may */
    var machines = DB.all("machines");
    for (var i = 0; i < machines.length; i++) {
      if (machines[i].code.toLowerCase() === code.toLowerCase() && String(machines[i].id) !== id) {
        document.getElementById("err-code").classList.add("show");
        hasError = true;
      }
    }
  }
  if (hasError) { return; }

  if (id === "") {
    DB.add("machines", {
      lineId: lineId,
      name: name,
      code: code,
      status: status,
      archived: false
    });
    showToast("Đã thêm máy mới!", "success");
  } else {
    DB.update("machines", id, {
      lineId: lineId,
      name: name,
      code: code,
      status: status
    });
    showToast("Đã cập nhật thông tin máy.", "success");
  }

  closeModal("modal-machine");
  renderTable();
});


function toggleArchive(id, archived) {
  var msg = archived ? "Lưu trữ máy này? Máy sẽ ẩn khỏi các trang vận hành." : "Khôi phục máy này?";
  if (!confirm(msg)) { return; }
  DB.update("machines", id, { archived: archived });
  renderTable();
  showToast(archived ? "Đã lưu trữ máy." : "Đã khôi phục máy.", "info");
}


fillFilters();
document.getElementById("search-box").addEventListener("input", renderTable);
document.getElementById("filter-line").addEventListener("change", renderTable);
document.getElementById("filter-status").addEventListener("change", renderTable);

fakeLoading("machine-table-box", renderTable);
