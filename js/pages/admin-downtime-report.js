/* Bao cao downtime: loc theo khoang thoi gian, bieu do cot, xuat CSV */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["admin", "supervisor"])) { /* sai vai tro */ }

initPage();

var lastReport = []; /* ket qua bao cao lan gan nhat, dung de xuat CSV */

/* Mac dinh: 30 ngay gan nhat */
document.getElementById("date-to").value = todayStr();
var d = new Date();
d.setDate(d.getDate() - 30);
document.getElementById("date-from").value =
  d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());

/* Lay danh sach su co trong khoang thoi gian */
function getIncidentsInRange() {
  var from = document.getElementById("date-from").value;
  var to = document.getElementById("date-to").value;
  var all = DB.all("incidents");
  var list = [];
  for (var i = 0; i < all.length; i++) {
    var day = all[i].createdAt.slice(0, 10); /* "2026-10-22" */
    if (from !== "" && day < from) { continue; }
    if (to !== "" && day > to) { continue; }
    list.push(all[i]);
  }
  return list;
}

function buildReport() {
  var from = document.getElementById("date-from").value;
  var to = document.getElementById("date-to").value;

  if (from !== "" && to !== "" && from > to) {
    showToast("Ngày bắt đầu phải trước ngày kết thúc.", "error");
    return;
  }

  var incidents = getIncidentsInRange();
  lastReport = incidents;
  renderStats(incidents);
  renderChart(incidents);
  renderTopMachines(incidents);
  renderDetailTable(incidents);
}

/* ---------- Thong ke tong ---------- */

function renderStats(incidents) {
  var totalDown = 0;
  var highCount = 0;
  for (var i = 0; i < incidents.length; i++) {
    totalDown += incidents[i].downtimeMin || 0;
    if (incidents[i].priority === "Cao") { highCount++; }
  }
  document.getElementById("report-stats").innerHTML =
    '<div class="stat"><div class="stat-value">' + incidents.length + '</div><div class="stat-label">Sự cố trong kỳ</div></div>' +
    '<div class="stat stat-danger"><div class="stat-value">' + totalDown + '</div><div class="stat-label">Tổng phút downtime</div></div>' +
    '<div class="stat stat-warn"><div class="stat-value">' + highCount + '</div><div class="stat-label">Sự cố ưu tiên cao</div></div>' +
    '<div class="stat stat-info"><div class="stat-value">' +
    (incidents.length > 0 ? Math.round(totalDown / incidents.length) : 0) +
    '</div><div class="stat-label">Downtime TB / sự cố (phút)</div></div>';
}

/* ---------- Bieu do cot theo day chuyen ---------- */

function renderChart(incidents) {
  var box = document.getElementById("chart-area");
  var lines = DB.all("lines");

  /* Tinh downtime cua tung line */
  var totals = [];
  var max = 0;
  for (var i = 0; i < lines.length; i++) {
    var sum = 0;
    for (var j = 0; j < incidents.length; j++) {
      if (incidents[j].lineId === lines[i].id) {
        sum += incidents[j].downtimeMin || 0;
      }
    }
    totals.push(sum);
    if (sum > max) { max = sum; }
  }

  if (max === 0) {
    box.innerHTML = '<div class="empty-state"><span class="empty-icon">📈</span>Không có downtime nào trong kỳ báo cáo.</div>';
    return;
  }

  var html = '<div class="bar-chart">';
  for (var k = 0; k < lines.length; k++) {
    var heightPct = Math.round((totals[k] / max) * 100);
    html +=
      '<div class="bar-col">' +
      '<span style="font-size:12px;">' + totals[k] + "</span>" +
      '<div class="bar" style="height:' + Math.max(heightPct, 2) + '%;" title="' + totals[k] + ' phút"></div>' +
      '<span class="bar-label">' + escapeHtml(lines[k].name) + "</span>" +
      "</div>";
  }
  html += "</div>";
  box.innerHTML = html;
}

/* ---------- Top may downtime nhieu ---------- */

function renderTopMachines(incidents) {
  var box = document.getElementById("top-machines");
  var byMachine = {};
  for (var i = 0; i < incidents.length; i++) {
    var mid = incidents[i].machineId;
    if (byMachine[mid] === undefined) { byMachine[mid] = 0; }
    byMachine[mid] += incidents[i].downtimeMin || 0;
  }

  var arr = [];
  for (var key in byMachine) {
    arr.push({ machineId: Number(key), downtime: byMachine[key] });
  }
  arr.sort(function (a, b) { return b.downtime - a.downtime; });
  arr = arr.slice(0, 5);

  if (arr.length === 0) {
    box.innerHTML = '<div class="empty-state">Không có dữ liệu.</div>';
    return;
  }

  var html = "<table class='table'><tr><th>#</th><th>Máy</th><th>Downtime (phút)</th></tr>";
  for (var j = 0; j < arr.length; j++) {
    html +=
      "<tr><td>" + (j + 1) + "</td><td>" + escapeHtml(machineName(arr[j].machineId)) +
      "</td><td><strong>" + arr[j].downtime + "</strong></td></tr>";
  }
  html += "</table>";
  box.innerHTML = html;
}

/* ---------- Bang chi tiet ---------- */

function renderDetailTable(incidents) {
  var box = document.getElementById("detail-table");
  if (incidents.length === 0) {
    box.innerHTML = '<div class="empty-state"><span class="empty-icon">📭</span>Không có sự cố nào trong khoảng thời gian đã chọn.</div>';
    return;
  }

  var html =
    "<table class='table'>" +
    "<tr><th>Ngày</th><th>Sự cố</th><th>Máy</th><th>Dây chuyền</th><th>Ưu tiên</th><th>Trạng thái</th><th>Downtime</th></tr>";
  for (var i = 0; i < incidents.length; i++) {
    var inc = incidents[i];
    html +=
      "<tr>" +
      "<td>" + formatDate(inc.createdAt) + "</td>" +
      "<td>" + escapeHtml(inc.title) + "</td>" +
      "<td>" + escapeHtml(machineName(inc.machineId)) + "</td>" +
      "<td>" + escapeHtml(lineName(inc.lineId)) + "</td>" +
      "<td>" + priorityBadge(inc.priority) + "</td>" +
      "<td>" + statusBadge(inc.status) + "</td>" +
      "<td>" + (inc.downtimeMin || 0) + " phút</td>" +
      "</tr>";
  }
  html += "</table>";
  box.innerHTML = html;
}

/* ---------- Xuat CSV ---------- */

document.getElementById("btn-export").addEventListener("click", function () {
  if (lastReport.length === 0) {
    showToast("Không có dữ liệu để xuất. Hãy tạo báo cáo trước.", "error");
    return;
  }

  var rows = ["Ngay,Su co,May,Day chuyen,Uu tien,Trang thai,Downtime (phut)"];
  for (var i = 0; i < lastReport.length; i++) {
    var inc = lastReport[i];
    rows.push([
      formatDate(inc.createdAt),
      '"' + inc.title.replace(/"/g, '""') + '"',
      '"' + machineName(inc.machineId) + '"',
      '"' + lineName(inc.lineId) + '"',
      inc.priority,
      inc.status,
      inc.downtimeMin || 0
    ].join(","));
  }

  var blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "bao-cao-downtime-" + todayStr() + ".csv";
  link.click();
  showToast("Đã tải file CSV báo cáo.", "success");
});

/* ---------- Khoi chay ---------- */

document.getElementById("btn-report").addEventListener("click", buildReport);

fakeLoading("detail-table", buildReport);
