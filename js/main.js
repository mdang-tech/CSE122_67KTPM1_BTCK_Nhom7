/* 
   LineWatch - main.js
   Ham dung chung: dang nhap, nav, toast, modal,
   dinh dang ngay, escapeHtml...
    */

/* Goi khi trang bat dau: seed du lieu + ve nav + ve user */
function initPage() {
  seedDataIfEmpty();
  renderNav();
  renderTopbarUser();
}

/*  Dang nhap / phan quyen */

function getCurrentUser() {
  var raw = localStorage.getItem("lw_user");
  if (raw === null) { return null; }
  return JSON.parse(raw);
}

function saveCurrentUser(user) {
  localStorage.setItem("lw_user", JSON.stringify(user));
}

/* Trang nao can dang nhap thi goi ham nay o dau file JS cua trang */
function requireLogin() {
  if (getCurrentUser() === null) {
    location.href = "login.html";
    return false;
  }
  return true;
}

/* Kiem tra dung vai tro, khong dung thi bao loi va day ve trang chu */
function requireRole(roles) {
  var user = getCurrentUser();
  if (user === null) {
    location.href = "login.html";
    return false;
  }
  if (roles.indexOf(user.role) === -1) {
    alert("Bạn không có quyền truy cập trang này!");
    location.href = "index.html";
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem("lw_user");
  location.href = "login.html";
}

/* Trang mac dinh cua tung vai tro */
function homePageOfRole(role) {
  if (role === "operator") { return "operator-line-status.html"; }
  if (role === "supervisor") { return "supervisor-shift-dashboard.html"; }
  if (role === "maintenance") { return "maintenance-queue.html"; }
  if (role === "admin") { return "admin-machine-management.html"; }
  return "index.html";
}

/* Ve thanh nav theo vai tro */

var NAV_LINKS = {
  operator: [
    { href: "operator-line-status.html", label: "Trạng thái line" },
    { href: "operator-incident-create.html", label: "Báo sự cố" },
    { href: "operator-shift-incidents.html", label: "Sự cố ca của tôi" }
  ],
  supervisor: [
    { href: "supervisor-shift-dashboard.html", label: "Bảng điều khiển ca" },
    { href: "supervisor-incident-board.html", label: "Bảng sự cố" },
    { href: "supervisor-handover-note.html", label: "Bàn giao ca" }
  ],
  maintenance: [
    { href: "maintenance-queue.html", label: "Hàng chờ bảo trì" },
    { href: "maintenance-incident-detail.html", label: "Chi tiết sự cố" },
    { href: "maintenance-machine-history.html", label: "Lịch sử máy" }
  ],
  admin: [
    { href: "admin-machine-management.html", label: "Quản lý máy" },
    { href: "admin-line-management.html", label: "Quản lý dây chuyền" },
    { href: "admin-downtime-report.html", label: "Báo cáo downtime" }
  ]
};

function renderNav() {
  var nav = document.getElementById("main-nav");
  if (nav === null) { return; }

  var user = getCurrentUser();
  var currentFile = location.pathname.split("/").pop();
  if (currentFile === "") { currentFile = "index.html"; }

  var links = [];
  links.push({ href: "index.html", label: "Trang chủ" });
  if (user !== null && NAV_LINKS[user.role]) {
    links = links.concat(NAV_LINKS[user.role]);
    links.push({ href: "notifications.html", label: "Thông báo" });
  }

  var html = "";
  for (var i = 0; i < links.length; i++) {
    var active = links[i].href === currentFile ? ' class="active"' : "";
    html += '<a href="' + links[i].href + '"' + active + ">" + links[i].label + "</a>";
  }
  nav.innerHTML = html;
}

function renderTopbarUser() {
  var box = document.getElementById("topbar-user");
  if (box === null) { return; }

  var user = getCurrentUser();
  if (user === null) {
    box.innerHTML = '<a class="btn btn-primary btn-sm" href="login.html">Đăng nhập</a>';
    return;
  }

  var initial = user.name.charAt(0).toUpperCase();
  box.innerHTML =
    '<span class="avatar">' + escapeHtml(initial) + "</span>" +
    "<span>" + escapeHtml(user.name) + "</span>" +
    '<a href="profile.html" class="btn btn-outline btn-sm">Hồ sơ</a>' +
    '<button class="btn btn-outline btn-sm" onclick="logout()">Đăng xuất</button>';
}

/* Toast (thong bao noi) */

function showToast(message, type) {
  var box = document.getElementById("toast-box");
  if (box === null) {
    box = document.createElement("div");
    box.id = "toast-box";
    document.body.appendChild(box);
  }
  var toast = document.createElement("div");
  toast.className = "toast toast-" + (type || "info");
  toast.textContent = message;
  box.appendChild(toast);
  setTimeout(function () {
    toast.remove();
  }, 3000);
}

/* Modal (cua so bat) */

function openModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal !== null) { modal.classList.add("open"); }
}

function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal !== null) { modal.classList.remove("open"); }
}

/* Ham tien ich khac */

/* Chong loi XSS khi noi chuoi HTML */
function escapeHtml(str) {
  if (str === null || str === undefined) { return ""; }
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDateTime(iso) {
  if (!iso) { return ""; }
  var d = new Date(iso);
  return (
    pad2(d.getHours()) + ":" + pad2(d.getMinutes()) +
    " " + pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1) + "/" + d.getFullYear()
  );
}

function formatDate(iso) {
  if (!iso) { return ""; }
  var d = new Date(iso);
  return pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1) + "/" + d.getFullYear();
}

function pad2(n) {
  return n < 10 ? "0" + n : String(n);
}

/* Lay ngay gio hien tai dang ISO de luu vao du lieu */
function nowISO() {
  var d = new Date();
  return (
    d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) +
    "T" + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds())
  );
}

/* Lay ngay hien tai dang yyyy-mm-dd */
function todayStr() {
  return nowISO().slice(0, 10);
}

/* Nhan mau cho muc uu tien */
function priorityBadge(priority) {
  var cls = "badge-muted";
  if (priority === "Cao") { cls = "badge-danger"; }
  if (priority === "Trung bình") { cls = "badge-warn"; }
  if (priority === "Thấp") { cls = "badge-ok"; }
  return '<span class="badge ' + cls + '">' + escapeHtml(priority) + "</span>";
}

/* Nhan mau cho trang thai su co */
function statusBadge(status) {
  var cls = "badge-muted";
  if (status === "Mới") { cls = "badge-danger"; }
  if (status === "Đang chờ") { cls = "badge-warn"; }
  if (status === "Đang xử lý") { cls = "badge-info"; }
  if (status === "Đã xử lý") { cls = "badge-ok"; }
  return '<span class="badge ' + cls + '">' + escapeHtml(status) + "</span>";
}

/* Nhan mau cho trang thai may */
function machineStatusBadge(status) {
  var cls = "badge-muted";
  if (status === "running") { cls = "badge-ok"; }
  if (status === "warning") { cls = "badge-warn"; }
  if (status === "stopped") { cls = "badge-danger"; }
  return '<span class="badge ' + cls + '">' + MACHINE_STATUS_LABELS[status] + "</span>";
}

/* Tim ten may theo id */
function machineName(machineId) {
  var m = DB.find("machines", machineId);
  return m ? m.name : "(máy không tồn tại)";
}

/* Tim ten day chuyen theo id */
function lineName(lineId) {
  var l = DB.find("lines", lineId);
  return l ? l.name : "(dây chuyền không tồn tại)";
}

/* Them 1 thong bao cho 1 nguoi dung */
function addNotification(userId, message) {
  DB.add("notifications", {
    userId: userId,
    message: message,
    time: nowISO(),
    read: false
  });
}

/* Mo phong trang thai "dang tai" */

/* Hien skeleton trong khoang thoi gian ngan de demo trang thai loading */
function fakeLoading(containerId, renderCallback) {
  var container = document.getElementById(containerId);
  container.innerHTML =
    '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
  setTimeout(function () {
    renderCallback(container);
  }, 600);
}
