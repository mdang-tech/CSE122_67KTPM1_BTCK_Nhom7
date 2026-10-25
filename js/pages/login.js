/* Trang dang nhap: kiem tra hop le form, luu user vao LocalStorage */

initPage();

var form = document.getElementById("login-form");

/* nho vai tro dang nhap gan nhat, lan sau mo trang thi tu tick san */
var lastRole = localStorage.getItem("lw_last_role");
if (lastRole !== null) {
  var lastRadio = document.querySelector('input[name="username"][value="' + lastRole + '"]');
  if (lastRadio !== null) { lastRadio.checked = true; }
}

// bam Gui thi JS tu kiem tra, khong cho reload trang
form.addEventListener("submit", function (event) {
  event.preventDefault();

  var errRole = document.getElementById("err-role");
  var errPassword = document.getElementById("err-password");
  errRole.classList.remove("show");
  errPassword.classList.remove("show");

  /* Lay vai tro duoc chon */
  var checked = form.querySelector('input[name="username"]:checked');
  var password = document.getElementById("password").value;

  var hasError = false;
  if (checked === null) {
    errRole.classList.add("show");
    hasError = true;
  }
  if (password === "") {
    errPassword.classList.add("show");
    hasError = true;
  }
  if (hasError) { return; }

  /* Tim user trong du lieu */
  var users = DB.all("users");
  var found = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === checked.value && users[i].password === password) {
      found = users[i];
    }
  }

  if (found === null) {
    errPassword.classList.add("show");
    showToast("Đăng nhập thất bại. Kiểm tra lại mật khẩu.", "error");
    return;
  }

  /* Dang nhap thanh cong */
  saveCurrentUser(found);
  localStorage.setItem("lw_last_role", found.username);
  var btn = document.getElementById("btn-login");
  btn.disabled = true;
  btn.textContent = "Đang đăng nhập...";
  showToast("Xin chào " + found.name + "!", "success");

  setTimeout(function () {
    location.href = homePageOfRole(found.role);
  }, 700);
});
