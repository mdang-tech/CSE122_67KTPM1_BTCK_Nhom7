/* Bang dieu khien ca: thong ke, su co dang mo, may co van de, AI-2 */

if (!requireLogin()) { /* da chuyen ve login.html */ }
if (!requireRole(["supervisor"])) { /* sai vai tro */ }

initPage();

var aiAnswer = null;

function isOpen(status) {
  return status !== "Đã xử lý" && status !== "Đã hủy";
}


function renderStats() {
  var incidents = DB.all("incidents");
  var machines = DB.all("machines");

  var open = 0, high = 0, downtime = 0, stopped = 0;
  for (var i = 0; i < incidents.length; i++) {
    if (isOpen(incidents[i].status)) {
      open++;
      if (incidents[i].priority === "Cao") { high++; }
    }
    downtime += incidents[i].downtimeMin || 0;
  }
  for (var j = 0; j < machines.length; j++) {
    if (machines[j].status === "stopped" && !machines[j].archived) { stopped++; }
  }

  document.getElementById("stats-box").innerHTML =
    '<div class="stat stat-warn"><div class="stat-value">' + open + '</div><div class="stat-label">Sự cố đang mở</div></div>' +
    '<div class="stat stat-danger"><div class="stat-value">' + high + '</div><div class="stat-label">Ưu tiên cao</div></div>' +
    '<div class="stat stat-info"><div class="stat-value">' + stopped + '</div><div class="stat-label">Máy đang dừng</div></div>' +
    '<div class="stat"><div class="stat-value">' + downtime + '</div><div class="stat-label">Phút downtime</div></div>';
}


function renderOpenIncidents() {
  var box = document.getElementById("open-incidents");
  var incidents = DB.all("incidents");
  var list = [];
  for (var i = 0; i < incidents.length; i++) {
    if (isOpen(incidents[i].status)) { list.push(incidents[i]); }
  }
  /* Uu tien Cao len truoc */
  var order = { "Cao": 0, "Trung bình": 1, "Thấp": 2 };
  list.sort(function (a, b) { return order[a.priority] - order[b.priority]; });

  if (list.length === 0) {
    box.innerHTML =
      '<div class="empty-state"><span class="empty-icon">✅</span>Tuyệt vời! Không có sự cố nào đang mở.</div>';
    return;
  }

  var html = "";
  for (var j = 0; j < list.length; j++) {
    var inc = list[j];
    html +=
      '<div class="card" style="margin-bottom:8px;">' +
      "<strong>" + escapeHtml(inc.title) + "</strong><br>" +
      '<span class="text-muted" style="font-size:13px;">' + escapeHtml(machineName(inc.machineId)) +
      " · " + formatDateTime(inc.createdAt) + "</span><br>" +
      priorityBadge(inc.priority) + " " + statusBadge(inc.status) +
      (inc.assignee ? ' <span class="badge badge-muted">' + escapeHtml(inc.assignee) + "</span>" : "") +
      "</div>";
  }
  box.innerHTML = html;
}


function renderProblemMachines() {
  var box = document.getElementById("problem-machines");
  var machines = DB.all("machines");
  var html = "";
  var count = 0;
  for (var i = 0; i < machines.length; i++) {
    var m = machines[i];
    if (m.archived || m.status === "running") { continue; }
    count++;
    html +=
      "<div>" +
      '<span class="status-dot dot-' + m.status + '"></span>' +
      escapeHtml(m.name) + " " + machineStatusBadge(m.status) +
      '<span class="text-muted" style="font-size:12px;"> · ' + escapeHtml(lineName(m.lineId)) + "</span>" +
      "</div>";
  }
  if (count === 0) {
    html = '<p class="text-muted">Tất cả máy đang chạy bình thường.</p>';
  }
  box.innerHTML = html;
}


document.getElementById("btn-ai-summary").addEventListener("click", function () {
  aiShowLoading("ai-output");
  document.getElementById("btn-ai-summary").disabled = true;

  aiSummarizeShift(function (answer) {
    aiAnswer = answer;
    document.getElementById("btn-ai-summary").disabled = false;

    if (answer.ok) {
      var html =
        "<strong>Tóm tắt ca hôm nay:</strong><br>" +
        "<span style='white-space:pre-line;'>" + escapeHtml(answer.result.summary) + "</span>";
      aiShowResult("ai-output", { ok: true, explain: answer.explain }, aiActionsHtml());
      document.getElementById("ai-result-content").innerHTML = html;
    } else {
      aiShowResult("ai-output", answer, aiActionsHtml());
    }
  });
});

function aiActionsHtml() {
  return (
    (aiAnswer && aiAnswer.ok ? '<button class="btn btn-ok btn-sm" onclick="aiAccept()">✔ Dùng làm ghi chú bàn giao</button>' : "") +
    '<button class="btn btn-outline btn-sm" onclick="aiEdit()">✎ Sửa trước khi dùng</button>' +
    '<button class="btn btn-outline btn-sm" onclick="aiRegenerate()">↻ Tạo lại</button>' +
    '<button class="btn btn-outline btn-sm" onclick="aiReject()">✖ Từ chối</button>'
  );
}

/* Chap nhan: luu tom tat thanh ghi chu ban giao moi */
function aiAccept() {
  DB.add("shiftNotes", {
    shift: "Ca hiện tại",
    workDate: todayStr(),
    author: getCurrentUser().name,
    content: aiAnswer.result.summary,
    pendingTasks: "",
    createdAt: nowISO()
  });
  showToast("Đã lưu tóm tắt AI thành ghi chú bàn giao.", "success");
  document.getElementById("ai-output").innerHTML =
    '<div class="ai-result">✔ Đã lưu vào <a href="supervisor-handover-note.html">Bàn giao ca</a>. Bạn có thể sang đó chỉnh sửa thêm.</div>';
}

/* Sua: dua tom tat vao hop nhap de nguoi dung sua */
function aiEdit() {
  var edited = prompt("Sửa lại tóm tắt trước khi lưu:", aiAnswer.result.summary);
  if (edited !== null && edited.trim() !== "") {
    aiAnswer.result.summary = edited.trim();
    showToast("Đã cập nhật nội dung tóm tắt. Bấm 'Tạo lại' hoặc chấp nhận để lưu.", "info");
    document.getElementById("ai-output").innerHTML =
      "<div class='ai-result'><strong>Tóm tắt (đã sửa):</strong><br><span style='white-space:pre-line;'>" +
      escapeHtml(aiAnswer.result.summary) + "</span></div>" +
      '<div class="ai-actions"><button class="btn btn-ok btn-sm" onclick="aiAccept()">✔ Lưu làm ghi chú bàn giao</button></div>';
  }
}

function aiRegenerate() {
  document.getElementById("btn-ai-summary").click();
}

function aiReject() {
  aiAnswer = null;
  document.getElementById("ai-output").innerHTML =
    '<div class="ai-result text-muted">Đã từ chối tóm tắt của AI. Bạn có thể tự viết ghi chú bàn giao thủ công.</div>';
}


fakeLoading("stats-box", function () {
  renderStats();
  renderOpenIncidents();
  renderProblemMachines();
});
