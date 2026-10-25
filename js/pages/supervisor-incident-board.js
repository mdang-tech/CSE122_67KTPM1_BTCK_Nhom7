/* Bang su co kieu kanban: chuyen trang thai, phan cong bao tri */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["supervisor"])) { /* sai vai tro */ }

initPage();

var BOARD_COLUMNS = ["Mới", "Đang chờ", "Đang xử lý", "Đã xử lý"];


function fillLineFilter() {
  var select = document.getElementById("filter-line");
  var lines = DB.all("lines");
  for (var i = 0; i < lines.length; i++) {
    var opt = document.createElement("option");
    opt.value = lines[i].id;
    opt.textContent = lines[i].name;
    select.appendChild(opt);
  }
}

function renderBoard() {
  var board = document.getElementById("kanban-board");
  var priority = document.getElementById("filter-priority").value;
  var lineFilter = document.getElementById("filter-line").value;

  var incidents = DB.all("incidents");
  var html = "";

  for (var c = 0; c < BOARD_COLUMNS.length; c++) {
    var col = BOARD_COLUMNS[c];
    html += '<div class="kanban-col"><h3>' + col + "</h3>";

    var count = 0;
    for (var i = 0; i < incidents.length; i++) {
      var inc = incidents[i];
      if (inc.status !== col) { continue; }
      if (priority !== "all" && inc.priority !== priority) { continue; }
      if (lineFilter !== "all" && inc.lineId !== Number(lineFilter)) { continue; }
      count++;
      html += renderCard(inc, col);
    }

    if (count === 0) {
      html += '<p class="text-muted" style="font-size:13px;">Không có sự cố.</p>';
    }
    html += "</div>";
  }

  board.innerHTML = html;
}

function renderCard(inc, col) {
  var buttons = "";
  var colIndex = BOARD_COLUMNS.indexOf(col);

  /* Nut chuyen trang thai: sang trai / sang phai */
  if (colIndex > 0 && col !== "Đã xử lý") {
    buttons += '<button class="btn btn-outline btn-sm" onclick="moveStatus(' + inc.id + ", '" + BOARD_COLUMNS[colIndex - 1] + "'" + ')">← ' + BOARD_COLUMNS[colIndex - 1] + "</button> ";
  }
  if (colIndex < BOARD_COLUMNS.length - 1) {
    buttons += '<button class="btn btn-outline btn-sm" onclick="moveStatus(' + inc.id + ", '" + BOARD_COLUMNS[colIndex + 1] + "'" + ')">' + BOARD_COLUMNS[colIndex + 1] + " →</button>";
  }

  return (
    '<div class="kanban-card">' +
    "<strong>" + escapeHtml(inc.title) + "</strong><br>" +
    '<span class="text-muted">' + escapeHtml(machineName(inc.machineId)) + "</span><br>" +
    priorityBadge(inc.priority) + "<br>" +
    '<span class="text-muted" style="font-size:12px;">Người báo: ' + escapeHtml(inc.reporter) + "</span><br>" +
    (inc.assignee
      ? '<span class="badge badge-info">🔧 ' + escapeHtml(inc.assignee) + "</span><br>"
      : '<button class="btn btn-sm btn-outline mt-8" onclick="openAssign(' + inc.id + ')">Phân công</button><br>') +
    '<div class="mt-8">' + buttons + "</div>" +
    "</div>"
  );
}

function moveStatus(id, newStatus) {
  DB.update("incidents", id, { status: newStatus });
  var inc = DB.find("incidents", id);
  addNotification(1, "Sự cố '" + inc.title + "' chuyển sang " + newStatus);
  renderBoard();
  showToast("Đã chuyển trạng thái sang: " + newStatus, "success");
}


function openAssign(id) {
  var inc = DB.find("incidents", id);
  document.getElementById("assign-id").value = inc.id;
  document.getElementById("assign-title").textContent = inc.title;

  /* Lay danh sach user vai tro bao tri */
  var users = DB.all("users");
  var select = document.getElementById("assign-user");
  select.innerHTML = "";
  for (var i = 0; i < users.length; i++) {
    if (users[i].role !== "maintenance") { continue; }
    var opt = document.createElement("option");
    opt.value = users[i].name;
    opt.textContent = users[i].name;
    select.appendChild(opt);
  }
  openModal("modal-assign");
}

document.getElementById("assign-form").addEventListener("submit", function (event) {
  event.preventDefault();
  var id = document.getElementById("assign-id").value;
  var assignee = document.getElementById("assign-user").value;

  if (assignee === "") {
    showToast("Chưa có kỹ thuật bảo trì nào để phân công.", "error");
    return;
  }

  DB.update("incidents", id, { assignee: assignee, status: "Đang chờ" });
  var inc = DB.find("incidents", id);
  addNotification(3, "Bạn được giao xử lý sự cố: " + inc.title);
  closeModal("modal-assign");
  renderBoard();
  showToast("Đã phân công cho " + assignee + ".", "success");
});


fillLineFilter();
document.getElementById("filter-priority").addEventListener("change", renderBoard);
document.getElementById("filter-line").addEventListener("change", renderBoard);

fakeLoading("kanban-board", renderBoard);
