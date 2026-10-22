/* Lich su may: timeline su co + nhat ky bao tri (CRUD) + AI-3 */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["maintenance", "admin"])) { /* sai vai tro */ }

initPage();

var user = getCurrentUser();
var aiAnswer = null;

/* ---------- Chon may ---------- */

function fillMachineSelect() {
  var select = document.getElementById("machine-select");
  var lines = DB.all("lines");
  var machines = DB.all("machines");
  for (var i = 0; i < lines.length; i++) {
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
    select.appendChild(group);
  }
}

function selectedMachineId() {
  return document.getElementById("machine-select").value;
}

/* ---------- Render timeline ---------- */

function renderHistory() {
  var box = document.getElementById("history-area");
  var machineId = selectedMachineId();

  if (machineId === "") {
    box.innerHTML = '<div class="empty-state"><span class="empty-icon">👈</span>Chọn một máy để xem lịch sử.</div>';
    return;
  }

  /* Gop su co + nhat ky bao tri thanh 1 danh sach su kien */
  var events = [];
  var incidents = DB.all("incidents");
  for (var i = 0; i < incidents.length; i++) {
    if (incidents[i].machineId === Number(machineId)) {
      events.push({
        time: incidents[i].createdAt,
        icon: "🚨",
        title: incidents[i].title,
        detail: incidents[i].category + " · " + incidents[i].status + " · downtime " + (incidents[i].downtimeMin || 0) + " phút",
        html: ""
      });
    }
  }
  var tasks = DB.all("maintenanceTasks");
  for (var j = 0; j < tasks.length; j++) {
    if (tasks[j].machineId === Number(machineId)) {
      events.push({
        time: tasks[j].createdAt,
        icon: "🔧",
        title: tasks[j].type + " – " + tasks[j].taskDate,
        detail: tasks[j].note + " (" + tasks[j].technician + ")",
        html:
          '<button class="btn btn-outline btn-sm" onclick="openEditTask(' + tasks[j].id + ')">Sửa</button> ' +
          '<button class="btn btn-danger btn-sm" onclick="deleteTask(' + tasks[j].id + ')">Xóa</button>'
      });
    }
  }

  if (events.length === 0) {
    box.innerHTML = '<div class="empty-state"><span class="empty-icon">📄</span>Máy này chưa có sự cố hay nhật ký bảo trì nào.</div>';
    return;
  }

  events.sort(function (a, b) { return a.time < b.time ? 1 : -1; });

  var html = '<ul class="timeline">';
  for (var k = 0; k < events.length; k++) {
    var e = events[k];
    html +=
      "<li>" +
      "<strong>" + e.icon + " " + escapeHtml(e.title) + "</strong>" +
      '<div class="time">' + formatDateTime(e.time) + "</div>" +
      '<div style="font-size:14px;">' + escapeHtml(e.detail) + "</div>" +
      (e.html ? '<div class="mt-8">' + e.html + "</div>" : "") +
      "</li>";
  }
  html += "</ul>";
  box.innerHTML = html;
}

/* ---------- CRUD nhat ky bao tri ---------- */

var taskCard = document.getElementById("task-form-card");

document.getElementById("btn-add-task").addEventListener("click", function () {
  if (selectedMachineId() === "") {
    showToast("Hãy chọn máy trước khi ghi nhật ký.", "error");
    return;
  }
  document.getElementById("task-form-title").textContent = "Ghi nhật ký bảo trì";
  document.getElementById("task-form").reset();
  document.getElementById("task-id").value = "";
  document.getElementById("task-date").value = todayStr();
  hideTaskErrors();
  taskCard.style.display = "block";
  taskCard.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("btn-cancel-task").addEventListener("click", function () {
  taskCard.style.display = "none";
});

function hideTaskErrors() {
  document.getElementById("err-task-date").classList.remove("show");
  document.getElementById("err-task-note").classList.remove("show");
}

function openEditTask(id) {
  var t = DB.find("maintenanceTasks", id);
  if (t === null) { return; }
  document.getElementById("task-form-title").textContent = "Sửa nhật ký bảo trì";
  document.getElementById("task-id").value = t.id;
  document.getElementById("task-date").value = t.taskDate;
  document.getElementById("task-type").value = t.type;
  document.getElementById("task-note").value = t.note;
  hideTaskErrors();
  taskCard.style.display = "block";
  taskCard.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("task-form").addEventListener("submit", function (event) {
  event.preventDefault();
  hideTaskErrors();

  var id = document.getElementById("task-id").value;
  var taskDate = document.getElementById("task-date").value;
  var type = document.getElementById("task-type").value;
  var note = document.getElementById("task-note").value.trim();

  var hasError = false;
  if (taskDate === "") {
    document.getElementById("err-task-date").classList.add("show");
    hasError = true;
  }
  if (note.length < 10) {
    document.getElementById("err-task-note").classList.add("show");
    hasError = true;
  }
  if (hasError) { return; }

  if (id === "") {
    DB.add("maintenanceTasks", {
      machineId: Number(selectedMachineId()),
      taskDate: taskDate,
      type: type,
      note: note,
      technician: user.name,
      createdAt: nowISO()
    });
    showToast("Đã thêm nhật ký bảo trì.", "success");
  } else {
    DB.update("maintenanceTasks", id, {
      taskDate: taskDate,
      type: type,
      note: note
    });
    showToast("Đã cập nhật nhật ký.", "success");
  }

  taskCard.style.display = "none";
  renderHistory();
});

function deleteTask(id) {
  if (!confirm("Xóa bản ghi nhật ký này?")) { return; }
  DB.remove("maintenanceTasks", id);
  renderHistory();
  showToast("Đã xóa nhật ký.", "info");
}

/* ---------- AI-3: phat hien loi lap lai ---------- */

document.getElementById("btn-ai-insight").addEventListener("click", function () {
  var machineId = selectedMachineId();
  if (machineId === "") {
    showToast("Hãy chọn máy trước khi phân tích.", "error");
    return;
  }

  aiShowLoading("ai-output");
  document.getElementById("btn-ai-insight").disabled = true;

  aiFindRepeatFailures(machineId, function (answer) {
    aiAnswer = answer;
    document.getElementById("btn-ai-insight").disabled = false;

    if (answer.ok) {
      var r = answer.result;
      var html =
        "<strong>Phát hiện mẫu lỗi lặp:</strong><br>" +
        "Loại lỗi <span class='badge badge-danger'>" + escapeHtml(r.category) + "</span> lặp lại <strong>" + r.times + " lần</strong>" +
        ", tổng downtime <strong>" + r.totalDowntime + " phút</strong>.<br>" +
        '<span style="font-size:14px;">💡 ' + escapeHtml(r.suggestion) + "</span>";
      aiShowResult("ai-output", { ok: true, explain: answer.explain }, aiActionsHtml());
      document.getElementById("ai-result-content").innerHTML = html;
    } else {
      aiShowResult("ai-output", answer, aiActionsHtml());
    }
  });
});

function aiActionsHtml() {
  return (
    (aiAnswer && aiAnswer.ok ? '<button class="btn btn-ok btn-sm" onclick="aiAccept()">✔ Tạo kế hoạch bảo trì từ đề xuất</button>' : "") +
    '<button class="btn btn-outline btn-sm" onclick="aiRegenerate()">↻ Thử lại</button>' +
    '<button class="btn btn-outline btn-sm" onclick="aiReject()">✖ Bỏ qua, làm thủ công</button>'
  );
}

/* Chap nhan: tao nhat ky bao tri loai "Kiem tra" tu de xuat AI */
function aiAccept() {
  DB.add("maintenanceTasks", {
    machineId: Number(selectedMachineId()),
    taskDate: todayStr(),
    type: "Kiểm tra",
    note: "[Kế hoạch từ AI] " + aiAnswer.result.suggestion,
    technician: user.name,
    createdAt: nowISO()
  });
  showToast("Đã tạo kế hoạch bảo trì vào nhật ký.", "success");
  document.getElementById("ai-output").innerHTML =
    '<div class="ai-result">✔ Đề xuất đã được lưu thành nhật ký bảo trì (loại Kiểm tra) ở dòng thời gian.</div>';
  renderHistory();
}

function aiRegenerate() {
  document.getElementById("btn-ai-insight").click();
}

function aiReject() {
  aiAnswer = null;
  document.getElementById("ai-output").innerHTML =
    '<div class="ai-result text-muted">Đã bỏ qua đề xuất AI. Bạn tự quyết định kế hoạch bảo trì thủ công.</div>';
}

/* ---------- Khoi chay ---------- */

fillMachineSelect();
document.getElementById("machine-select").addEventListener("change", function () {
  document.getElementById("ai-output").innerHTML = "";
  renderHistory();
});

var params = new URLSearchParams(location.search);
var urlMachineId = params.get("machineId");
if (urlMachineId !== null) {
  document.getElementById("machine-select").value = urlMachineId;
}

fakeLoading("history-area", renderHistory);
