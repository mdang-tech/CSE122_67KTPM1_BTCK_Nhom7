/* Trang thong bao: liet ke, danh dau da doc, xoa tat ca */

if (!requireLogin()) { /* da chuyen ve login.html */ }

initPage();

var user = getCurrentUser();

// lay danh sach thong bao cua user hien tai
function myNotifications() {
  var all = DB.all("notifications");
  var mine = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].userId === user.id) { mine.push(all[i]); }
  }
  /* Sap xep: moi nhat len dau */
  mine.sort(function (a, b) {
    return a.time < b.time ? 1 : -1;
  });
  return mine;
}

function renderNotifications() {
  var box = document.getElementById("notification-list");
  var list = myNotifications();

  /* Trang thai rong */
  if (list.length === 0) {
    box.innerHTML =
      '<div class="card empty-state">' +
      '<span class="empty-icon">🔔</span>' +
      "Bạn chưa có thông báo nào." +
      "</div>";
    return;
  }

  var html = "";
  for (var i = 0; i < list.length; i++) {
    var n = list[i];
    html +=
      '<div class="card" style="' + (n.read ? "opacity:0.6;" : "border-left:4px solid var(--primary);") + '">' +
      "<div>" + escapeHtml(n.message) + "</div>" +
      '<div class="text-muted" style="font-size:12px;">' + formatDateTime(n.time) +
      (n.read ? " · Đã đọc" : " · <strong>Mới</strong>") + "</div>" +
      (n.read ? "" : '<button class="btn btn-outline btn-sm mt-8" onclick="markRead(' + n.id + ')">Đánh dấu đã đọc</button> ') +
      '<button class="btn btn-danger btn-sm mt-8" onclick="deleteOne(' + n.id + ')">Xóa</button>' +
      "</div>";
  }
  box.innerHTML = html;
}

function markRead(id) {
  DB.update("notifications", id, { read: true });
  renderNotifications();
}

/* Xoa 1 thong bao khoi danh sach */
function deleteOne(id) {
  DB.remove("notifications", id);
  renderNotifications();
  showToast("Đã xóa thông báo.", "info");
}

document.getElementById("btn-read-all").addEventListener("click", function () {
  var list = myNotifications();
  for (var i = 0; i < list.length; i++) {
    DB.update("notifications", list[i].id, { read: true });
  }
  renderNotifications();
  showToast("Đã đánh dấu tất cả đã đọc.", "success");
});

document.getElementById("btn-clear").addEventListener("click", function () {
  if (!confirm("Xóa tất cả thông báo của bạn?")) { return; }
  var all = DB.all("notifications");
  var kept = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].userId !== user.id) { kept.push(all[i]); }
  }
  DB.save("notifications", kept);
  renderNotifications();
  showToast("Đã xóa tất cả thông báo.", "info");
});

fakeLoading("notification-list", renderNotifications);
