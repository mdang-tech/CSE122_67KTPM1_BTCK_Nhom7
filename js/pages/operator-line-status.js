/* Trang trang thai line: hien may theo day chuyen + loc */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["operator", "supervisor", "maintenance", "admin"])) { /* sai vai tro */ }

initPage();

/* Dien cac lua chon day chuyen vao select */
function fillLineFilter() {
  var select = document.getElementById("filter-line");
  var lines = DB.all("lines");
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].archived) { continue; }
    var opt = document.createElement("option");
    opt.value = lines[i].id;
    opt.textContent = lines[i].name;
    select.appendChild(opt);
  }
}

/* Dem so su co dang mo cua 1 may */
function countOpenIncidents(machineId) {
  var incidents = DB.all("incidents");
  var count = 0;
  for (var i = 0; i < incidents.length; i++) {
    var s = incidents[i].status;
    if (incidents[i].machineId === machineId && s !== "Đã xử lý" && s !== "Đã hủy") {
      count++;
    }
  }
  return count;
}

function renderLines() {
  var box = document.getElementById("line-list");
  var lineFilter = document.getElementById("filter-line").value;
  var statusFilter = document.getElementById("filter-status").value;

  var lines = DB.all("lines");
  var machines = DB.all("machines");

  var html = "";
  var shown = 0;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.archived) { continue; }
    if (lineFilter !== "all" && line.id !== Number(lineFilter)) { continue; }

    /* Loc may cua line nay */
    var lineMachines = [];
    for (var j = 0; j < machines.length; j++) {
      if (machines[j].lineId !== line.id || machines[j].archived) { continue; }
      if (statusFilter !== "all" && machines[j].status !== statusFilter) { continue; }
      lineMachines.push(machines[j]);
    }

    shown++;
    html += '<div class="card">';
    html += '<h3 class="card-title">🏭 ' + escapeHtml(line.name) +
            ' <span class="text-muted" style="font-weight:normal;">– ' + escapeHtml(line.product) + "</span></h3>";

    if (lineMachines.length === 0) {
      html += '<p class="text-muted">Không có máy nào khớp bộ lọc trong dây chuyền này.</p>';
    } else {
      html += '<div class="grid">';
      for (var k = 0; k < lineMachines.length; k++) {
        var m = lineMachines[k];
        var open = countOpenIncidents(m.id);
        html +=
          '<div class="card machine-card" style="margin-bottom:0;">' +
          "<div>" +
          '<span class="status-dot dot-' + m.status + '"></span>' +
          "<strong>" + escapeHtml(m.name) + "</strong>" +
          '<div class="text-muted" style="font-size:12px;">' + escapeHtml(m.code) + "</div>" +
          "</div>" +
          "<div>" + machineStatusBadge(m.status) +
          (open > 0 ? ' <span class="badge badge-danger">' + open + " sự cố mở</span>" : "") +
          "</div>" +
          "</div>";
      }
      html += "</div>";
    }
    html += "</div>";
  }

  /* Trang thai rong */
  if (shown === 0) {
    html =
      '<div class="card empty-state">' +
      '<span class="empty-icon">🔍</span>' +
      "Không tìm thấy dây chuyền nào khớp bộ lọc." +
      "</div>";
  }

  box.innerHTML = html;
}

fillLineFilter();
document.getElementById("filter-line").addEventListener("change", renderLines);
document.getElementById("filter-status").addEventListener("change", renderLines);

/* Gia lap trang thai dang tai truoc khi hien du lieu */
fakeLoading("line-list", renderLines);
