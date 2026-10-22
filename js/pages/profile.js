/* Trang ho so ca nhan: xem thong tin, doi ten, dat lai du lieu demo */

if (!requireLogin()) { /* da chuyen ve login.html */ }

initPage();

var user = getCurrentUser();

/* Hien thong tin len trang */
function renderProfile() {
  document.getElementById("profile-avatar").textContent = user.name.charAt(0).toUpperCase();
  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-role").textContent = user.roleLabel;
  document.getElementById("input-name").value = user.name;
  document.getElementById("input-username").value = user.username;
}

renderProfile();

/* Luu ten moi */
document.getElementById("profile-form").addEventListener("submit", function (event) {
  event.preventDefault();

  var newName = document.getElementById("input-name").value.trim();
  var errName = document.getElementById("err-name");
  errName.classList.remove("show");

  if (newName.length < 2) {
    errName.classList.add("show");
    return;
  }

  DB.update("users", user.id, { name: newName });
  user.name = newName;
  saveCurrentUser(user);
  renderProfile();
  renderTopbarUser();
  showToast("Đã lưu thay đổi!", "success");
});

/* Dat lai du lieu demo */
document.getElementById("btn-reset").addEventListener("click", function () {
  if (confirm("Bạn có chắc muốn đặt lại toàn bộ dữ liệu demo? Mọi thay đổi sẽ mất.")) {
    resetData();
    showToast("Đã đặt lại dữ liệu demo.", "info");
    setTimeout(function () { location.reload(); }, 800);
  }
});
