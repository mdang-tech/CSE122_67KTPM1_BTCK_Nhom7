/* Hang cho bao tri: tab viec cua toi / chua phan cong / da hoan thanh */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["maintenance"])) { /* sai vai tro */ }

initPage();

var user = getCurrentUser();
var currentTab = "mine";

function isOpen(status) {
  return status !== "Đã xử lý" && status !== "Đã hủy";
}

function getQueue() {
  var incidents = DB.all("incidents");
  var list = [];
  for (var i = 0; i < incidents.length; i++) {
    var inc = incidents[i];
    if (currentTab === "mine") {
      if (inc.assignee !== user.name || !isOpen(inc.status)) { continue; }
    } else if (currentTab === "unassigned") {
      if (inc.assignee !== "" || !isOpen(inc.status)) { continue; }
    } else {
      if (inc.status !== "Đã xử lý") { continue; }
    }
    list.push(inc);
  }
  /* Uu tien Cao len truoc, roi den thoi diem */
  var order = { "Cao": 0, "Trung bình": 1, "Thấp": 2 };
  list.sort(function (a, b) {
    if (order[a.priority] !== order[b.priority]) {
      return order[a.priority] - order[b.priority];
    }
    return a.createdAt < b.createdAt ? 1 : -1;
  });
  return list;
}

function renderQueue() {
  var box = document.getElementById("queue-list");
  var list = getQueue();

  if (list.length === 0) {
    var msg = "Không có việc nào trong mục này.";
    if (currentTab === "mine") { msg = "Bạn chưa có việc nào được giao. 🎉"; }
    box.innerHTML = '<div class="card empty-state"><span class="empty-icon">🔧</span>' + msg + "</div>";
    return;
  }

  var html = "";
  for (var i = 0; i < list.length; i++) {
    var inc = list[i];
    html +=
      '<div class="card">' +
      "<div style='display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;'>" +
      "<div>" +
      "<strong>" + escapeHtml(inc.title) + "</strong><br>" +
      '<span class="text-muted" style="font-size:13px;">' +
      escapeHtml(machineName(inc.machineId)) + " · " + escapeHtml(lineName(inc.lineId)) +
      " · " + formatDateTime(inc.createdAt) + "</span><br>" +
      '<span style="font-size:13px;">' + escapeHtml(inc.description) + "</span><br>" +
      '<div class="mt-8">' + priorityBadge(inc.priority) + " " + statusBadge(inc.status) +
      ' <span class="badge badge-muted">' + escapeHtml(inc.category) + "</span></div>" +
      "</div>" +
      "<div>" +
      '<a class="btn btn-primary btn-sm" href="maintenance-incident-detail.html?id=' + inc.id + '">Xem & xử lý →</a>' +
      (currentTab === "unassigned"
        ? '<br><button class="btn btn-ok btn-sm mt-8" onclick="takeJob(' + inc.id + ')">Nhận việc</button>'
        : "") +
      "</div>" +
      "</div>" +
      "</div>";
  }
  box.innerHTML = html;
}

/* Nhan viec: tu gan minh + chuyen sang Dang xu ly */
function takeJob(id) {
  DB.update("incidents", id, { assignee: user.name, status: "Đang xử lý" });
  var inc = DB.find("incidents", id);
  addNotification(2, "Bảo trì " + user.name + " đã nhận việc: " + inc.title);
  renderQueue();
  showToast("Đã nhận việc. Chúc bạn xử lý tốt!", "success");
}

/* Doi tab */
var tabButtons = document.querySelectorAll("#queue-tabs button");
for (var t = 0; t < tabButtons.length; t++) {
  tabButtons[t].addEventListener("click", function () {
    for (var k = 0; k < tabButtons.length; k++) {
      tabButtons[k].classList.remove("active");
    }
    this.classList.add("active");
    currentTab = this.getAttribute("data-tab");
    renderQueue();
  });
}

fakeLoading("queue-list", renderQueue);
