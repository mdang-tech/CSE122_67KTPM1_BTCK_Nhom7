/* Trang chu: hien so lieu he thong, doi nut hero neu da dang nhap */

initPage();

function renderHomeStats() {
  var lines = DB.all("lines");
  var machines = DB.all("machines");
  var incidents = DB.all("incidents");

  var openCount = 0;
  var downtime = 0;
  for (var i = 0; i < incidents.length; i++) {
    if (incidents[i].status !== "Đã xử lý" && incidents[i].status !== "Đã hủy") {
      openCount++;
    }
    downtime += incidents[i].downtimeMin || 0;
  }

  var box = document.getElementById("stats-box");
  box.innerHTML =
    '<div class="stat"><div class="stat-value">' + lines.length + '</div><div class="stat-label">Dây chuyền</div></div>' +
    '<div class="stat"><div class="stat-value">' + machines.length + '</div><div class="stat-label">Máy móc</div></div>' +
    '<div class="stat stat-warn"><div class="stat-value">' + openCount + '</div><div class="stat-label">Sự cố đang mở</div></div>' +
    '<div class="stat stat-danger"><div class="stat-value">' + downtime + '</div><div class="stat-label">Phút downtime</div></div>';
}

fakeLoading("stats-box", renderHomeStats);

/* Neu da dang nhap thi doi nut hero thanh "Vao khu vuc lam viec" */
var user = getCurrentUser();
if (user !== null) {
  var btn = document.getElementById("hero-btn");
  btn.textContent = "Vào khu vực làm việc của bạn →";
  btn.setAttribute("href", homePageOfRole(user.role));
}
