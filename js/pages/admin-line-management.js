/* Quan ly day chuyen: CRUD + luu tru */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["admin"])) { /* sai vai tro */ }

initPage();

/* ---------- Render danh sach ---------- */

function renderLines() {
  var box = document.getElementById("line-cards");
  var lines = DB.all("lines");
  var machines = DB.all("machines");

  if (lines.length === 0) {
    box.innerHTML = '<div class="card empty-state"><span class="empty-icon">🏭</span>Chưa có dây chuyền nào.</div>';
    return;
  }

  var html = '<div class="grid">';
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    /* Dem so may dang hoat dong */
    var machineCount = 0;
    for (var j = 0; j < machines.length; j++) {
      if (machines[j].lineId === line.id && !machines[j].archived) { machineCount++; }
    }

    html +=
      '<div class="card"' + (line.archived ? ' style="opacity:0.5;"' : "") + ">" +
      "<strong>🏭 " + escapeHtml(line.name) + "</strong>" +
      (line.archived ? ' <span class="badge badge-muted">Lưu trữ</span>' : "") +
      '<div class="text-muted" style="font-size:14px;">Sản phẩm: ' + escapeHtml(line.product) + "</div>" +
      '<div class="text-muted" style="font-size:14px;">Công suất: ' + line.capacity + " sản phẩm/giờ</div>" +
      '<div class="text-muted" style="font-size:14px;">Số máy: ' + machineCount + "</div>" +
      '<div class="mt-8">' +
      '<button class="btn btn-outline btn-sm" onclick="openEdit(' + line.id + ')">Sửa</button> ' +
      (line.archived
        ? '<button class="btn btn-ok btn-sm" onclick="toggleArchive(' + line.id + ', false)">Khôi phục</button>'
        : '<button class="btn btn-danger btn-sm" onclick="toggleArchive(' + line.id + ', true)">Lưu trữ</button>') +
      "</div>" +
      "</div>";
  }
  html += "</div>";
  box.innerHTML = html;
}

/* ---------- Modal them / sua ---------- */

function hideErrors() {
  document.getElementById("err-name").classList.remove("show");
  document.getElementById("err-product").classList.remove("show");
  document.getElementById("err-capacity").classList.remove("show");
}

function openAdd() {
  document.getElementById("modal-line-title").textContent = "Thêm dây chuyền";
  document.getElementById("line-form").reset();
  document.getElementById("line-id").value = "";
  hideErrors();
  openModal("modal-line");
}

function openEdit(id) {
  var line = DB.find("lines", id);
  if (line === null) { return; }
  document.getElementById("modal-line-title").textContent = "Sửa dây chuyền";
  document.getElementById("line-id").value = line.id;
  document.getElementById("line-name").value = line.name;
  document.getElementById("line-product").value = line.product;
  document.getElementById("line-capacity").value = line.capacity;
  hideErrors();
  openModal("modal-line");
}

document.getElementById("btn-add").addEventListener("click", openAdd);

document.getElementById("line-form").addEventListener("submit", function (event) {
  event.preventDefault();
  hideErrors();

  var id = document.getElementById("line-id").value;
  var name = document.getElementById("line-name").value.trim();
  var product = document.getElementById("line-product").value.trim();
  var capacity = Number(document.getElementById("line-capacity").value);

  var hasError = false;
  if (name.length < 3) {
    document.getElementById("err-name").classList.add("show");
    hasError = true;
  }
  if (product === "") {
    document.getElementById("err-product").classList.add("show");
    hasError = true;
  }
  if (isNaN(capacity) || capacity <= 0) {
    document.getElementById("err-capacity").classList.add("show");
    hasError = true;
  }
  if (hasError) { return; }

  if (id === "") {
    DB.add("lines", {
      name: name,
      product: product,
      capacity: capacity,
      status: "running",
      archived: false
    });
    showToast("Đã thêm dây chuyền mới!", "success");
  } else {
    DB.update("lines", id, {
      name: name,
      product: product,
      capacity: capacity
    });
    showToast("Đã cập nhật dây chuyền.", "success");
  }

  closeModal("modal-line");
  renderLines();
});

/* ---------- Luu tru / khoi phuc ---------- */

function toggleArchive(id, archived) {
  var msg = archived
    ? "Lưu trữ dây chuyền này? Các máy thuộc dây chuyền sẽ không hiển thị ở trang vận hành."
    : "Khôi phục dây chuyền này?";
  if (!confirm(msg)) { return; }
  DB.update("lines", id, { archived: archived });
  renderLines();
  showToast(archived ? "Đã lưu trữ dây chuyền." : "Đã khôi phục dây chuyền.", "info");
}

/* ---------- Khoi chay ---------- */

fakeLoading("line-cards", renderLines);
