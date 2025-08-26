// commands.data.js — đầy đủ lệnh người dùng (không gồm Owner). Slash mặc định ephemeral.
window.COMMANDS = [
  /* ==== Cửa hàng & Kho ==== */
  { name: "cuahang", type: "slash", usage: "/cuahang", description: "Vào cửa hàng để mua vật phẩm (HP, nhẫn, v.v.).", category: "Cửa hàng & Kho", ephemeral: true },
  { name: "khodo",   type: "slash", usage: "/khodo",   description: "Kho đồ cá nhân; sử dụng nhẫn và vật phẩm.", category: "Cửa hàng & Kho", ephemeral: true },

  /* ==== Hôn nhân & Cá nhân (nhấn mạnh: xem trung tâm tại /profile) ==== */
  { name: "profile", type: "slash", usage: "/profile", description: "Thông tin tổng cá nhân & hôn nhân (trung tâm).", category: "Hôn nhân & Cá nhân", ephemeral: true },
  { name: "giftcode", type: "prefix", usage: "hgc [code]", description: "Nhận mã quà tặng", category: "Hôn nhân & Cá nhân", ephemeral: true },
  { name: "cauhon",  type: "slash", usage: "/cauhon @user", description: "Cầu hôn người khác (quản lý tại /profile).", category: "Hôn nhân & Cá nhân", ephemeral: true },
  { name: "honnhan", type: "slash", usage: "/honnhan", description: "Xem trạng thái hôn nhân hiện tại.", category: "Hôn nhân & Cá nhân", ephemeral: true },
  { name: "lyhon",   type: "slash", usage: "/lyhon",   description: "Ly hôn.", category: "Hôn nhân & Cá nhân", ephemeral: true },
  { name: "nvcapdoi",type: "slash", usage: "/nvcapdoi",description: "Nhiệm vụ cặp đôi.", category: "Hôn nhân & Cá nhân", ephemeral: true },
  { name: "quychung",type: "slash", usage: "/quychung",description: "Quản lý quỹ chung.", category: "Hôn nhân & Cá nhân", ephemeral: true },

  /* ==== Phương tiện ==== */
  { name: "muaxe",     type: "slash", usage: "/muaxe",     description: "Mua phương tiện.", category: "Phương tiện", ephemeral: true },
  { name: "banxe",     type: "slash", usage: "/banxe",     description: "Bán phương tiện.", category: "Phương tiện", ephemeral: true },
  { name: "chonxe",    type: "slash", usage: "/chonxe",    description: "Chọn xe hiển thị trong /profile.", category: "Phương tiện", ephemeral: true },
  { name: "danhsachxe",type: "slash", usage: "/danhsachxe",description: "Danh sách phương tiện đang sở hữu.", category: "Phương tiện", ephemeral: true },

  /* ==== Nhà cửa ==== */
  { name: "muanha", type: "slash", usage: "/muanha", description: "Mua nhà.", category: "Nhà cửa", ephemeral: true },
  { name: "bannha", type: "slash", usage: "/bannha", description: "Bán nhà.", category: "Nhà cửa", ephemeral: true },

  /* ==== Chợ Tốt (giao bán giữa thành viên) ==== */
  { name: "chotot",     type: "slash", usage: "/chotot",     description: "Xem thị trường Chợ Tốt (nhà/xe).", category: "Chợ Tốt", ephemeral: true },
  { name: "chotot-ban", type: "slash", usage: "/chotot ban", description: "Đăng bán nhà/xe lên Chợ Tốt.", category: "Chợ Tốt", ephemeral: true },
  { name: "chotot-xoa", type: "slash", usage: "/chotot xoa", description: "Gỡ tin đang đăng trên Chợ Tốt.", category: "Chợ Tốt", ephemeral: true },

  /* ==== Ngân hàng ==== */
  { name: "bank",       type: "slash", usage: "/bank",       description: "Tổng quan tài khoản ngân hàng.", category: "Ngân hàng", ephemeral: true },
  { name: "bankchuyen", type: "slash", usage: "/bankchuyen @user 1000", description: "Chuyển khoản ngân hàng.", category: "Ngân hàng", ephemeral: true },
  { name: "bankgui",    type: "slash", usage: "/bankgui 1000", description: "Gửi tiết kiệm.", category: "Ngân hàng", ephemeral: true },
  { name: "bankls",     type: "slash", usage: "/bankls",     description: "Lịch sử chuyển khoản.", category: "Ngân hàng", ephemeral: true },
  { name: "bankrut",    type: "slash", usage: "/bankrut 1000", description: "Rút tiền từ ngân hàng.", category: "Ngân hàng", ephemeral: true },
  { name: "banktrano",  type: "slash", usage: "/banktrano 1000", description: "Trả nợ ngân hàng.", category: "Ngân hàng", ephemeral: true },
  { name: "bankvay",    type: "slash", usage: "/bankvay 1000", description: "Vay tiền từ ngân hàng.", category: "Ngân hàng", ephemeral: true },

  /* ==== Tiền ảo ==== */
  { name: "muacoin", type: "slash", usage: "/muacoin ABC 100", description: "Mua coin theo ký hiệu & số lượng.", category: "Tiền ảo", ephemeral: true },
  { name: "bancoin", type: "slash", usage: "/bancoin ABC 100", description: "Bán coin.", category: "Tiền ảo", ephemeral: true },
  { name: "dexcoin", type: "slash", usage: "/dexcoin ABC/XYZ 50", description: "Giao dịch coin (DEX/AMM).", category: "Tiền ảo", ephemeral: true },
  { name: "bieudo",  type: "slash", usage: "/bieudo ABC", description: "Xem biểu đồ giá coin.", category: "Tiền ảo", ephemeral: true },
  { name: "guicoin", type: "slash", usage: "/guicoin @user ABC 10", description: "Gửi coin cho người khác.", category: "Tiền ảo", ephemeral: true },
  { name: "khocoin", type: "slash", usage: "/khocoin", description: "Kho coin cá nhân.", category: "Tiền ảo", ephemeral: true },

  /* ==== Vay/Nợ giữa người chơi ==== */
  { name: "chovay",     type: "slash", usage: "/chovay @user 1000", description: "Cho người khác vay tiền.", category: "Vay/Nợ", ephemeral: true },
  { name: "danhsachno", type: "slash", usage: "/danhsachno", description: "Danh sách các khoản nợ.", category: "Vay/Nợ", ephemeral: true },
  { name: "doino",      type: "slash", usage: "/doino @user", description: "Đòi nợ khi đến hạn.", category: "Vay/Nợ", ephemeral: true },
  { name: "trano",      type: "slash", usage: "/trano [@chủ_nợ] 1000", description: "Trả nợ (chung hoặc chỉ định).", category: "Vay/Nợ", ephemeral: true },
  { name: "vay",        type: "slash", usage: "/vay @user 1000", description: "Vay tiền từ người khác.", category: "Vay/Nợ", ephemeral: true },
  { name: "xoano",      type: "slash", usage: "/xoano @user", description: "Xoá khoản nợ cho con nợ.", category: "Vay/Nợ", ephemeral: true },

  /* ==== Cướp ==== */
  { name: "cuop",  type: "slash",   usage: "/cuop @user", description: "Cướp coin từ người chơi khác (mỗi lần cướp mất HP → mua HP trong /cuahang).", category: "Cướp", ephemeral: true },
  { name: "hcuop", type: "prefix",  usage: "hcuop @user", description: "Phiên bản prefix của cướp.", category: "Cướp" },

  /* ==== Việc làm ==== */
  { name: "xinviec", type: "slash", usage: "/xinviec", description: "Xin việc.", category: "Việc làm", ephemeral: true },
  { name: "lamviec", type: "slash", usage: "/lamviec", description: "Làm việc để nhận lương/danh vọng.", category: "Việc làm", ephemeral: true },
  { name: "vieclam", type: "slash", usage: "/vieclam", description: "Xem thông tin việc làm.", category: "Việc làm", ephemeral: true },

  /* ==== Nhắn tin ẩn danh ==== */
  { name: "andanh", type: "slash", usage: "/andanh @user Nội_dung", description: "Gửi tin nhắn ẩn danh.", category: "Khác", ephemeral: true },

  /* ==== Bảng xếp hạng ==== */
  { name: "bxh",        type: "slash",  usage: "/bxh [cuop|coin|danhvong|bank]", description: "Xem bảng xếp hạng theo mục.", category: "Bảng xếp hạng", ephemeral: true },
  { name: "htopcoin",   type: "prefix", usage: "htopcoin",   description: "BXH coin (prefix).", category: "Bảng xếp hạng" },
  { name: "htopcuop",   type: "prefix", usage: "htopcuop",   description: "BXH cướp (prefix).", category: "Bảng xếp hạng" },
  { name: "htopdanhvong", type: "prefix", usage: "htopdanhvong", description: "BXH danh vọng (prefix).", category: "Bảng xếp hạng" },
  { name: "htopbank",   type: "prefix", usage: "htopbank",   description: "BXH ngân hàng (prefix).", category: "Bảng xếp hạng" },

  /* ==== Điểm danh & Nhiệm vụ ==== */
  { name: "daily", type: "slash",  usage: "/daily", description: "Điểm danh hằng ngày.", category: "Điểm danh & Nhiệm vụ", ephemeral: true },
  { name: "hdaily",type: "prefix", usage: "hdaily", description: "Điểm danh hằng ngày (prefix).", category: "Điểm danh & Nhiệm vụ" },
  { name: "nv",    type: "slash",  usage: "/nv",    description: "Nhiệm vụ hằng ngày (tiến độ).", category: "Điểm danh & Nhiệm vụ", ephemeral: true },
  { name: "hnv",   type: "prefix", usage: "hnv",    description: "Nhiệm vụ hằng ngày (prefix).", category: "Điểm danh & Nhiệm vụ" },

  /* ==== Giao dịch tiền mặt (tay) ==== */
  { name: "hpay",  type: "prefix", usage: "hpay @user 1000", description: "Đưa tiền mặt cho người khác.", category: "Chuyển/Giao dịch" },
  { name: "hcoin", type: "prefix", usage: "hcoin",           description: "Xem tiền mặt đang cầm.", category: "Chuyển/Giao dịch" }
];
