/*
   LineWatch - ai.js
   Mo phong 3 tinh nang AI bang JavaScript theo luat
   (khong goi API that). Moi ham nhan du lieu vao,
   "suy nghi" 1 chut (setTimeout) roi tra ket qua
   qua ham callback.

   Ket qua luon co dang:
   { ok: true,  result: ..., explain: "..." }
   hoac khi AI that bai / khong chac chan:
   { ok: false, message: "..." }
   =================================================== */
AI-1: Phan loai su co va muc uu tien 
/* Dung trong trang operator-incident-create.html */


var AI_KEYWORDS = [
  { words: ["kẹt", "dừng đột ngột", "dồn ứ", "mắc"], category: "Kẹt vật liệu", priority: "Cao" },
  { words: ["nhiệt", "nóng", "quá nhiệt", "cháy"], category: "Quá nhiệt", priority: "Cao" },
  { words: ["rung", "ồn", "kêu", "lạch cạch", "tiếng"], category: "Rung động bất thường", priority: "Trung bình" },
  { words: ["điện", "mất điện", "cảm biến", "báo lỗi", "reset"], category: "Sự cố điện", priority: "Trung bình" },
  { words: ["rò rỉ", "rỉ nước", "dầu", "vũng nước"], category: "Rò rỉ", priority: "Trung bình" }
];

function aiClassifyIncident(title, description, callback) {
  setTimeout(function () {
    var text = (title + " " + description).toLowerCase();

    /* Trang thai that bai: khong du du lieu */
    if (description.trim().length < 15) {
      callback({
        ok: false,
        message: "Không đủ dữ liệu để đưa ra đề xuất. Hãy mô tả sự cố chi tiết hơn (ít nhất 15 ký tự)."
      });
      return;
    }

    var matched = null;
    for (var i = 0; i < AI_KEYWORDS.length; i++) {
      var rule = AI_KEYWORDS[i];
      for (var j = 0; j < rule.words.length; j++) {
        if (text.indexOf(rule.words[j]) !== -1) {
          matched = rule;
          break;
        }
      }
      if (matched !== null) { break; }
    }

    /* Khong khop luat nao -> AI khong chac chan */
    if (matched === null) {
      callback({
        ok: false,
        message: "AI chưa chắc chắn về kết quả này. Mô tả không khớp mẫu sự cố nào đã biết, hãy tự chọn loại sự cố thủ công."
      });
      return;
    }

    callback({
      ok: true,
      result: { category: matched.category, priority: matched.priority, confidence: 87 },
      explain:
        "AI tìm thấy từ khóa liên quan đến \"" + matched.category + "\" trong mô tả của bạn. " +
        "Mức ưu tiên \"" + matched.priority + "\" dựa trên thống kê sự cố tương tự trước đây " +
        "(loại sự cố này từng gây dừng line trung bình 30 phút)."
    });
  }, 1200);
}

/* Dung trong trang supervisor-shift-dashboard.html */

function aiSummarizeShift(callback) {
  setTimeout(function () {
    var incidents = DB.all("incidents");
    var notes = DB.all("shiftNotes");

    var open = [];
    var done = [];
    var totalDowntime = 0;
    for (var i = 0; i < incidents.length; i++) {
      var inc = incidents[i];
      totalDowntime += inc.downtimeMin || 0;
      if (inc.status === "Đã xử lý" || inc.status === "Đã hủy") {
        done.push(inc);
      } else {
        open.push(inc);
      }
    }

    /* Trang thai that bai: khong du du lieu */
    if (incidents.length === 0 && notes.length === 0) {
      callback({
        ok: false,
        message: "Không đủ dữ liệu để tóm tắt ca. Chưa có sự cố hay ghi chú nào được ghi nhận."
      });
      return;
    }

    var highOpen = [];
    for (var k = 0; k < open.length; k++) {
      if (open[k].priority === "Cao") { highOpen.push(open[k]); }
    }

    var lines = [];
    lines.push("Ca hôm nay ghi nhận " + incidents.length + " sự cố, tổng downtime khoảng " + totalDowntime + " phút.");
    lines.push("Đã xử lý/đóng: " + done.length + " sự cố. Còn tồn: " + open.length + " sự cố.");
    if (highOpen.length > 0) {
      var names = [];
      for (var h = 0; h < highOpen.length; h++) {
        names.push(open[open.indexOf(highOpen[h])].title);
      }
      lines.push("Ưu tiên cao chưa xong: " + highOpen.length + " (" + names.join("; ") + ").");
    } else {
      lines.push("Không có sự cố ưu tiên cao nào đang tồn.");
    }
    if (open.length > 0) {
      lines.push("Việc cần bàn giao: theo dõi và cập nhật trạng thái " + open.length + " sự cố đang mở.");
    }

    callback({
      ok: true,
      result: { summary: lines.join("\n") },
      explain:
        "AI tổng hợp từ " + incidents.length + " sự cố và " + notes.length +
        " ghi chú bàn giao trong dữ liệu hiện có, đếm số sự cố theo trạng thái và cộng tổng downtime."
    });
  }, 1500);
}

/* Dung trong trang maintenance-machine-history.html */

function aiFindRepeatFailures(machineId, callback) {
  setTimeout(function () {
    var incidents = DB.all("incidents");
    var machineIncidents = [];
    for (var i = 0; i < incidents.length; i++) {
      if (incidents[i].machineId === Number(machineId)) {
        machineIncidents.push(incidents[i]);
      }
    }

    /* Trang thai that bai: khong du du lieu */
    if (machineIncidents.length < 2) {
      callback({
        ok: false,
        message: "Không đủ dữ liệu để đưa ra đề xuất. Máy này có ít hơn 2 sự cố được ghi nhận."
      });
      return;
    }

    /* Dem so lan xuat hien cua tung loai su co */
    var counts = {};
    for (var j = 0; j < machineIncidents.length; j++) {
      var cat = machineIncidents[j].category;
      if (counts[cat] === undefined) { counts[cat] = 0; }
      counts[cat] = counts[cat] + 1;
    }

    /* Tim loai xuat hien nhieu nhat */
    var topCat = null;
    var topCount = 0;
    for (var key in counts) {
      if (counts[key] > topCount) {
        topCount = counts[key];
        topCat = key;
      }
    }

    if (topCount < 2) {
      callback({
        ok: false,
        message: "AI chưa chắc chắn về kết quả này. Chưa phát hiện mẫu lỗi lặp lại rõ ràng ở máy này."
      });
      return;
    }

    var totalDown = 0;
    for (var m = 0; m < machineIncidents.length; m++) {
      if (machineIncidents[m].category === topCat) {
        totalDown += machineIncidents[m].downtimeMin || 0;
      }
    }

    callback({
      ok: true,
      result: {
        category: topCat,
        times: topCount,
        totalDowntime: totalDown,
        suggestion:
          "Đề xuất lên kế hoạch bảo trì tổng thể cho nhóm lỗi \"" + topCat + "\" thay vì chỉ sửa từng lần, " +
          "và kiểm tra lại quy trình vận hành liên quan."
      },
      explain:
        "AI đếm tần suất từng loại sự cố của máy này: loại \"" + topCat + "\" xuất hiện " + topCount +
        " lần (nhiều nhất), tổng downtime " + totalDown + " phút. Một loại lỗi lặp lại từ 2 lần trở lên " +
        "được coi là mẫu lỗi có hệ thống."
    });
  }, 1400);
}


/* Hien trang thai "AI dang xu ly..." */
function aiShowLoading(containerId) {
  var box = document.getElementById(containerId);
  box.innerHTML =
    '<div class="ai-loading"><span class="spinner"></span> AI đang phân tích dữ liệu, vui lòng chờ...</div>';
}

/* actions: mang cac nut, moi nut { label, className, onClick (ten ham dang chuoi) } */
function aiShowResult(containerId, answer, actionsHtml) {
  var box = document.getElementById(containerId);
  if (answer.ok) {
    box.innerHTML =
      '<div class="ai-result" id="ai-result-content"></div>' +
      '<div class="ai-explain"><strong>Vì sao có kết quả này?</strong><br>' + escapeHtml(answer.explain) + "</div>" +
      '<div class="ai-actions">' + actionsHtml + "</div>";
  } else {
    box.innerHTML =
      '<div class="ai-fail">⚠ ' + escapeHtml(answer.message) + "</div>" +
      '<div class="ai-actions">' + actionsHtml + "</div>";
  }
}
