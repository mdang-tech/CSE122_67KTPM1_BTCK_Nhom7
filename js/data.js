// data.js: du lieu gia lap (mock data) + ham luu/doc LocalStorage, nap truoc main.js


var SEED_USERS = [
  { id: 1, username: "operator1", password: "123456", name: "Đinh Minh Đăng", role: "operator", roleLabel: "Công nhân vận hành" },
  { id: 2, username: "supervisor1", password: "123456", name: "Tạ Việt Trung", role: "supervisor", roleLabel: "Trưởng ca" },
  { id: 3, username: "maintenance1", password: "123456", name: "Nguyễn Thành Công", role: "maintenance", roleLabel: "Kỹ thuật bảo trì" },
  { id: 4, username: "admin1", password: "123456", name: "Quản trị hệ thống", role: "admin", roleLabel: "Quản trị viên" }
];

var SEED_LINES = [
  { id: 1, name: "Dây chuyền A", product: "Bia lon 330ml", capacity: 12000, status: "running", archived: false },
  { id: 2, name: "Dây chuyền B", product: "Nước ngọt 500ml", capacity: 9000, status: "warning", archived: false },
  { id: 3, name: "Dây chuyền C", product: "Bia chai 450ml", capacity: 7000, status: "running", archived: false }
];

var SEED_MACHINES = [
  { id: 1, lineId: 1, name: "Máy chiết rót A1", code: "M-A1", status: "running", archived: false },
  { id: 2, lineId: 1, name: "Máy dán nhãn A2", code: "M-A2", status: "running", archived: false },
  { id: 3, lineId: 1, name: "Băng tải A3", code: "M-A3", status: "stopped", archived: false },
  { id: 4, lineId: 2, name: "Máy rửa chai B1", code: "M-B1", status: "warning", archived: false },
  { id: 5, lineId: 2, name: "Máy chiết rót B2", code: "M-B2", status: "running", archived: false },
  { id: 6, lineId: 2, name: "Máy đóng két B3", code: "M-B3", status: "running", archived: false },
  { id: 7, lineId: 3, name: "Lò thanh trùng C1", code: "M-C1", status: "running", archived: false },
  { id: 8, lineId: 3, name: "Máy chiết rót C2", code: "M-C2", status: "running", archived: false },
  { id: 9, lineId: 3, name: "Băng tải C3", code: "M-C3", status: "warning", archived: false }
];

var SEED_INCIDENTS = [
  {
    id: 1, machineId: 3, lineId: 1, title: "Băng tải A3 bị kẹt",
    description: "Băng tải dừng đột ngột, có tiếng kêu lớn, chai bị dồn ứ lại ở đoạn giữa.",
    category: "Kẹt vật liệu", priority: "Cao", status: "Đang xử lý",
    reporter: "Đinh Minh Đăng", assignee: "Nguyễn Thành Công",
    createdAt: "2026-10-22T07:15:00", downtimeMin: 45,
    rootCause: "Vòng bi băng tải mòn, chưa được thay theo lịch bảo trì.", actionNote: ""
  },
  {
    id: 2, machineId: 4, lineId: 2, title: "Máy rửa chai B1 rung mạnh",
    description: "Máy rửa chai rung bất thường khi chạy tốc độ cao, có mùi khét nhẹ.",
    category: "Rung động bất thường", priority: "Cao", status: "Mới",
    reporter: "Đinh Minh Đăng", assignee: "",
    createdAt: "2026-10-22T08:40:00", downtimeMin: 20,
    rootCause: "", actionNote: ""
  },
  {
    id: 3, machineId: 7, lineId: 3, title: "Lò thanh trùng C1 quá nhiệt",
    description: "Nhiệt độ lò vượt ngưỡng 105 độ C trong 10 phút, phải giảm công suất.",
    category: "Quá nhiệt", priority: "Trung bình", status: "Đang chờ",
    reporter: "Đinh Minh Đăng", assignee: "Nguyễn Thành Công",
    createdAt: "2026-10-21T14:20:00", downtimeMin: 30,
    rootCause: "", actionNote: "Đang chờ linh kiện cảm biến nhiệt thay thế."
  },
  {
    id: 4, machineId: 3, lineId: 1, title: "Băng tải A3 kêu lạch cạch",
    description: "Băng tải phát ra tiếng lạch cạch khi khởi động, chạy một lúc thì hết.",
    category: "Rung động bất thường", priority: "Thấp", status: "Đã xử lý",
    reporter: "Đinh Minh Đăng", assignee: "Nguyễn Thành Công",
    createdAt: "2026-10-18T09:00:00", downtimeMin: 10,
    rootCause: "Ốc cố định con lăn bị lỏng.", actionNote: "Siết lại toàn bộ ốc con lăn."
  },
  {
    id: 5, machineId: 3, lineId: 1, title: "Băng tải A3 dừng giữa ca",
    description: "Băng tải tự dừng giữa ca sản xuất, phải khởi động lại thủ công.",
    category: "Kẹt vật liệu", priority: "Trung bình", status: "Đã xử lý",
    reporter: "Đinh Minh Đăng", assignee: "Nguyễn Thành Công",
    createdAt: "2026-10-15T10:30:00", downtimeMin: 25,
    rootCause: "Mảnh thủy tinh rơi vào rãnh băng tải gây kẹt.", actionNote: "Vệ sinh rãnh, kiểm tra chai đầu vào."
  },
  {
    id: 6, machineId: 8, lineId: 3, title: "Máy chiết rót C2 rò rỉ nước",
    description: "Có vũng nước dưới chân máy chiết rót C2, nghi rò rỉ đường ống cấp.",
    category: "Rò rỉ", priority: "Trung bình", status: "Đã xử lý",
    reporter: "Đinh Minh Đăng", assignee: "Nguyễn Thành Công",
    createdAt: "2026-10-12T13:45:00", downtimeMin: 40,
    rootCause: "Gioăng cao su đường ống cấp nước bị lão hóa.", actionNote: "Thay gioăng mới."
  },
  {
    id: 7, machineId: 5, lineId: 2, title: "Máy chiết rót B2 báo lỗi cảm biến",
    description: "Màn hình máy chiết rót B2 báo lỗi cảm biến mức, phải reset nhiều lần.",
    category: "Sự cố điện", priority: "Thấp", status: "Đã hủy",
    reporter: "Đinh Minh Đăng", assignee: "",
    createdAt: "2026-10-10T08:00:00", downtimeMin: 0,
    rootCause: "Báo nhầm do người vận hành chưa chọn đúng chế độ.", actionNote: "Đã hướng dẫn lại quy trình."
  }
];

var SEED_SHIFT_NOTES = [
  {
    id: 1, shift: "Ca sáng", workDate: "2026-10-21", author: "Tạ Việt Trung",
    content: "Dây chuyền A chạy ổn định 90% ca. Băng tải A3 kẹt lúc 7h15, bảo trì đang xử lý. Lò C1 quá nhiệt, đã giảm công suất.",
    pendingTasks: "Theo dõi băng tải A3; nhắc bảo trì kiểm tra lò C1 đầu ca chiều.",
    createdAt: "2026-10-21T14:00:00"
  },
  {
    id: 2, shift: "Ca chiều", workDate: "2026-10-20", author: "Tạ Việt Trung",
    content: "Sản lượng dây chuyền B đạt 85% kế hoạch do máy rửa chai B1 chạy chậm. Không có sự cố mới.",
    pendingTasks: "Đặt lịch bảo trì máy B1 trong tuần.",
    createdAt: "2026-10-20T22:00:00"
  }
];

var SEED_MAINTENANCE_TASKS = [
  {
    id: 1, machineId: 3, taskDate: "2026-10-18", type: "Sửa chữa",
    note: "Siết lại ốc con lăn băng tải A3 sau sự cố kêu lạch cạch.",
    technician: "Nguyễn Thành Công", createdAt: "2026-10-18T11:00:00"
  },
  {
    id: 2, machineId: 3, taskDate: "2026-10-15", type: "Vệ sinh",
    note: "Vệ sinh rãnh băng tải A3, loại bỏ mảnh thủy tinh.",
    technician: "Nguyễn Thành Công", createdAt: "2026-10-15T13:00:00"
  },
  {
    id: 3, machineId: 8, taskDate: "2026-10-12", type: "Thay thế",
    note: "Thay gioăng cao su đường ống cấp nước máy chiết rót C2.",
    technician: "Nguyễn Thành Công", createdAt: "2026-10-12T16:30:00"
  }
];

var SEED_NOTIFICATIONS = [
  { id: 1, userId: 2, message: "Sự cố mới mức Cao: Máy rửa chai B1 rung mạnh", time: "2026-10-22T08:40:00", read: false },
  { id: 2, userId: 3, message: "Bạn được giao xử lý sự cố: Băng tải A3 bị kẹt", time: "2026-10-22T07:20:00", read: false },
  { id: 3, userId: 1, message: "Sự cố 'Lò thanh trùng C1 quá nhiệt' chuyển sang Đang chờ", time: "2026-10-21T15:00:00", read: true }
];



var DB = {
  /* Doc 1 collection tu LocalStorage, tra ve mang */
  all: function (name) {
    var raw = localStorage.getItem("lw_" + name);
    if (raw === null) { return []; }
    return JSON.parse(raw);
  },

  /* Ghi ca mang vao LocalStorage */
  save: function (name, arr) {
    localStorage.setItem("lw_" + name, JSON.stringify(arr));
  },

  /* Them 1 ban ghi moi (tu cap id), tra ve ban ghi */
  add: function (name, obj) {
    var arr = this.all(name);
    var maxId = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id > maxId) { maxId = arr[i].id; }
    }
    obj.id = maxId + 1;
    arr.push(obj);
    this.save(name, arr);
    return obj;
  },

  /* Tim 1 ban ghi theo id */
  find: function (name, id) {
    var arr = this.all(name);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === Number(id)) { return arr[i]; }
    }
    return null;
  },

  /* Cap nhat ban ghi theo id: update(name, 3, {status: 'Moi'}) */
  update: function (name, id, changes) {
    var arr = this.all(name);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === Number(id)) {
        for (var key in changes) {
          arr[i][key] = changes[key];
        }
        this.save(name, arr);
        return arr[i];
      }
    }
    return null;
  },

  /* Xoa ban ghi theo id */
  remove: function (name, id) {
    var arr = this.all(name);
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id !== Number(id)) { newArr.push(arr[i]); }
    }
    this.save(name, newArr);
  }
};

/* Do du lieu mau vao LocalStorage neu chua co (chi chay 1 lan) */
function seedDataIfEmpty() {
  if (localStorage.getItem("lw_seeded") === "yes") { return; }
  DB.save("users", SEED_USERS);
  DB.save("lines", SEED_LINES);
  DB.save("machines", SEED_MACHINES);
  DB.save("incidents", SEED_INCIDENTS);
  DB.save("shiftNotes", SEED_SHIFT_NOTES);
  DB.save("maintenanceTasks", SEED_MAINTENANCE_TASKS);
  DB.save("notifications", SEED_NOTIFICATIONS);
  localStorage.setItem("lw_seeded", "yes");
}

/* Dat lai toan bo du lieu ve ban dau (nut reset trong trang ca nhan) */
function resetData() {
  localStorage.removeItem("lw_seeded");
  var keys = ["users", "lines", "machines", "incidents", "shiftNotes", "maintenanceTasks", "notifications", "user"];
  for (var i = 0; i < keys.length; i++) {
    localStorage.removeItem("lw_" + keys[i]);
  }
  seedDataIfEmpty();
}

/*  Cac gia tri co dinh dung chung  */

var INCIDENT_STATUSES = ["Mới", "Đang chờ", "Đang xử lý", "Đã xử lý", "Đã hủy"];
var PRIORITIES = ["Cao", "Trung bình", "Thấp"];
var CATEGORIES = ["Kẹt vật liệu", "Quá nhiệt", "Rung động bất thường", "Sự cố điện", "Rò rỉ", "Khác"];
var MACHINE_STATUSES = ["running", "warning", "stopped"];

var MACHINE_STATUS_LABELS = {
  running: "Đang chạy",
  warning: "Cảnh báo",
  stopped: "Dừng"
};
