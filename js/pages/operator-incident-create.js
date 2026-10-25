/* Trang bao su co: form + validation + AI-1 phan loai su co */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["operator"])) { /* sai vai tro */ }

initPage();

var user = getCurrentUser();
var aiAnswer = null; /* ket qua AI lan gan nhat */


function fillFormOptions() {
  /* Danh sach may, nhom theo day chuyen */
  var machineSelect = document.getElementById("input-machine");
  var lines = DB.all("lines");
  var machines = DB.all("machines");

  for (var i = 0; i < lines.length; i++) {
    if (lines[i].archived) { continue; }
    var group = document.createElement("optgroup");
    group.label = lines[i].name;
    for (var j = 0; j < machines.length; j++) {
      if (machines[j].lineId === lines[i].id && !machines[j].archived) {
        var opt = document.createElement("option");
        opt.value = machines[j].id;
        opt.textContent = machines[j].name + " (" + machines[j].code + ")";
        group.appendChild(opt);
      }
    }
    machineSelect.appendChild(group);
  }

  /* Danh sach loai su co */
  var catSelect = document.getElementById("input-category");
  for (var c = 0; c < CATEGORIES.length; c++) {
    var opt2 = document.createElement("option");
    opt2.value = CATEGORIES[c];
    opt2.textContent = CATEGORIES[c];
    catSelect.appendChild(opt2);
  }

  /* Danh sach muc uu tien */
  var priSelect = document.getElementById("input-priority");
  for (var p = 0; p < PRIORITIES.length; p++) {
    var opt3 = document.createElement("option");
    opt3.value = PRIORITIES[p];
    opt3.textContent = PRIORITIES[p];
    priSelect.appendChild(opt3);
  }
  priSelect.value = "Trung bình";
}

fillFormOptions();


document.getElementById("btn-ai").addEventListener("click", function () {
  var title = document.getElementById("input-title").value;
  var desc = document.getElementById("input-desc").value;

  aiShowLoading("ai-output");
  document.getElementById("btn-ai").disabled = true;

  aiClassifyIncident(title, desc, function (answer) {
    aiAnswer = answer;
    document.getElementById("btn-ai").disabled = false;

    if (answer.ok) {
      var html =
        "<strong>Kết quả phân loại:</strong><br>" +
        "Loại sự cố: <span class='badge badge-info'>" + escapeHtml(answer.result.category) + "</span> " +
        "Mức ưu tiên: " + priorityBadge(answer.result.priority) + "<br>" +
        '<span class="text-muted" style="font-size:13px;">Độ tin cậy: ' + answer.result.confidence + "%</span>";
      aiShowResult("ai-output", { ok: true, explain: answer.explain }, aiActionsHtml());
      document.getElementById("ai-result-content").innerHTML = html;
    } else {
      aiShowResult("ai-output", answer, aiActionsHtml());
    }
  });
});

/* Cac nut dieu khien ket qua AI */
function aiActionsHtml() {
  return (
    (aiAnswer && aiAnswer.ok ? '<button class="btn btn-ok btn-sm" onclick="aiAccept()">✔ Chấp nhận</button>' : "") +
    '<button class="btn btn-outline btn-sm" onclick="aiEdit()">✎ Sửa thủ công</button>' +
    '<button class="btn btn-outline btn-sm" onclick="aiRegenerate()">↻ Tạo lại</button>' +
    '<button class="btn btn-outline btn-sm" onclick="aiReject()">✖ Từ chối</button>'
  );
}

/* Chap nhan: dien ket qua AI vao form */
function aiAccept() {
  document.getElementById("input-category").value = aiAnswer.result.category;
  document.getElementById("input-priority").value = aiAnswer.result.priority;
  showToast("Đã áp dụng phân loại của AI vào biểu mẫu.", "success");
  document.getElementById("ai-output").innerHTML =
    '<div class="ai-result">✔ Đã chấp nhận kết quả AI và điền vào biểu mẫu. Bạn vẫn có thể chỉnh lại trước khi gửi.</div>';
}

/* Sua thu cong: nguoi dung tu chon lai select */
function aiEdit() {
  showToast("Bạn hãy tự chọn loại sự cố và mức ưu tiên ở biểu mẫu bên trái.", "info");
  document.getElementById("input-category").focus();
}

/* Tao lai: chay AI lan nua */
function aiRegenerate() {
  document.getElementById("btn-ai").click();
}

/* Tu choi: bo ket qua AI */
function aiReject() {
  aiAnswer = null;
  document.getElementById("ai-output").innerHTML =
    '<div class="ai-result text-muted">Đã từ chối kết quả AI. Bạn hãy tự chọn loại sự cố thủ công.</div>';
}


document.getElementById("incident-form").addEventListener("submit", function (event) {
  event.preventDefault();

  var machineId = document.getElementById("input-machine").value;
  var title = document.getElementById("input-title").value.trim();
  var desc = document.getElementById("input-desc").value.trim();
  var category = document.getElementById("input-category").value;
  var priority = document.getElementById("input-priority").value;

  /* Xoa loi cu */
  var errs = document.querySelectorAll(".error-msg");
  for (var i = 0; i < errs.length; i++) { errs[i].classList.remove("show"); }

  var hasError = false;
  if (machineId === "") {
    document.getElementById("err-machine").classList.add("show");
    hasError = true;
  }
  if (title.length < 5) {
    document.getElementById("err-title").classList.add("show");
    hasError = true;
  }
  if (desc.length < 15) {
    document.getElementById("err-desc").classList.add("show");
    hasError = true;
  }
  if (hasError) {
    showToast("Vui lòng sửa các ô bị đánh đỏ.", "error");
    return;
  }

  var machine = DB.find("machines", machineId);

  /* Luu su co moi */
  DB.add("incidents", {
    machineId: Number(machineId),
    lineId: machine.lineId,
    title: title,
    description: desc,
    category: category,
    priority: priority,
    status: "Mới",
    reporter: user.name,
    assignee: "",
    createdAt: nowISO(),
    downtimeMin: 0,
    rootCause: "",
    actionNote: ""
  });

  /* Bao cho truong ca (userId 2) biet co su co moi */
  addNotification(2, "Sự cố mới mức " + priority + ": " + title + " (" + machine.name + ")");

  /* Neu muc uu tien Cao -> chuyen may sang trang thai dung */
  if (priority === "Cao") {
    DB.update("machines", machine.id, { status: "stopped" });
  }

  showToast("Đã gửi báo cáo sự cố thành công!", "success");
  setTimeout(function () {
    location.href = "operator-shift-incidents.html";
  }, 900);
});
