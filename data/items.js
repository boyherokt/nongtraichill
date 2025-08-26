window.itemsData = [
  {
    id: 'ring_gold',
    name: '💍 Nhẫn Cưới Vàng',
    description: 'Nhẫn cưới cơ bản để cầu hôn người khác.',
    price: 8000000, // Giá hợp lý cho item thấp
    type: 'marriage',
    canBuy: true,
    canUse: false,
    fame: 500000, // Fame thấp tương ứng với giá trị thấp
    thumbnail: 'https://i.postimg.cc/vHdRGcHT/Nh-n-C-i-V-ng.png'
  },
  {
    id: 'ring_diamond',
    name: '💎 Nhẫn Cưới Kim Cương',
    description: 'Nhẫn cưới cao cấp giúp tăng 10000000 fame khi cầu hôn.',
    price: 200000000, // Giá chuẩn
    type: 'marriage',
    canBuy: true,
    canUse: false,
    fame: 10000000, // Fame chuẩn
    thumbnail: 'https://i.postimg.cc/d0SPF6Lc/Nh-n-C-i-Kim-C-ng.png'
  },
  {
    id: 'ring_platinum',
    name: '💍 Nhẫn Cưới Bạch Kim',
    description: 'Nhẫn cưới quý hiếm, tôn vinh tình yêu vĩnh cửu.',
    price: 50000000, // Giá hợp lý cho một item quý hiếm
    type: 'marriage',
    canBuy: true,
    canUse: false,
    fame: 2000000, // Fame cao hơn so với các item thấp hơn
    thumbnail: 'https://i.postimg.cc/XJGMY5CG/Nh-n-C-i-B-ch-Kim.png'
  },
  {
    id: 'ring_sapphire',
    name: '💎 Nhẫn Cưới Ngọc Lục Bảo',
    description: 'Nhẫn cưới ngọc xanh lam, biểu tượng của lòng trung thành và tình yêu vĩnh cửu.',
    price: 25000000, // Giá hợp lý cho một item cao cấp
    type: 'marriage',
    canBuy: true,
    canUse: false,
    fame: 3000000, // Fame hợp lý cho giá trị này
    thumbnail: 'https://i.postimg.cc/433kjq41/Nh-n-C-i-Ng-c-L-c-B-o.png'
  },
  {
    id: 'ring_emerald',
    name: '💍 Nhẫn Cưới Ngọc Xanh Lam',
    description: 'Nhẫn cưới được làm từ ngọc lục bảo, biểu trưng cho sự thịnh vượng.',
    price: 30000000, // Giá hợp lý cho item này
    type: 'marriage',
    canBuy: true,
    canUse: false,
    fame: 4000000, // Fame hợp lý cho giá trị này
    thumbnail: 'https://i.postimg.cc/Dw63jnhZ/Nh-n-C-i-Ng-c-Xanh-Lam.png'
  },
  {
    id: 'ring_ruby',
    name: '💎 Nhẫn Cưới Hồng Ngọc',
    description: 'Nhẫn cưới sang trọng với viên hồng ngọc, biểu tượng của sự cháy bỏng và đam mê.',
    price: 35000000, // Giá hợp lý cho item cao cấp
    type: 'marriage',
    canBuy: true,
    canUse: false,
    fame: 5000000, // Fame hợp lý cho item cao cấp này
    thumbnail: 'https://i.postimg.cc/SRgtLNCF/Nh-n-C-i-H-ng-Ng-c.png'
  },
  {
    id: 'hp_potion_small',
    name: '🧪 Bình Máu Nhỏ',
    description: 'Dùng để hồi 25 HP ngay lập tức.',
    price: 8000, // 25 HP ~ 8000, lấy 320 coin/HP, chuẩn cho lối chơi này
    type: 'heal',
    canBuy: true,
    canUse: true,
    heal: 25,
    thumbnail: 'https://i.postimg.cc/bNjXgNmd/hoimaunho.png'
  },
  {
    id: 'hp_potion_big',
    name: '🍷 Bình Máu Đại',
    description: 'Dùng để hồi 60 HP ngay lập tức.',
    price: 18000, // 60 HP ~ 18000, vẫn giữ giá/HP như bình nhỏ
    type: 'heal',
    canBuy: true,
    canUse: true,
    heal: 60,
    thumbnail: 'https://i.postimg.cc/MHVCwhpW/hoimaulon.png'
  },
  // ===== food =====
  {
    id: 'banh_mi',
    name: '🥖 Bánh Mì',
    description: 'Đồ ăn sáng quốc dân, hồi 10 HP.',
    price: 3000,
    type: 'food',
    canBuy: true,
    canUse: true,
    heal: 10,
    thumbnail: 'https://i.postimg.cc/QN7GcWkR/banhmy.png'
  },
  {
    id: 'pho',
    name: '🍜 Tô Phở',
    description: 'Ăn giúp hồi 18 HP và tăng tinh thần.',
    price: 15000,
    type: 'food',
    canBuy: true,
    canUse: true,
    heal: 18,
    thumbnail: 'https://i.postimg.cc/N0FZFyjC/topho.png'
  },
  {
    id: 'cake',
    name: '🍰 Bánh Kem',
    description: 'Ăn giúp hồi 10 HP và tăng tinh thần..',
    price: 12000,
    type: 'food',
    canBuy: true,
    canUse: true,
    heal: 10,
    thumbnail: 'https://i.postimg.cc/fLt4234S/banhkem.png'
  },

  // ===== drink =====
  {
    id: 'tra_sua',
    name: '🧋 Trà Sữa',
    description: 'Uống giúp hồi 5 HP và tăng vui vẻ.',
    price: 2000,
    type: 'drink',
    canBuy: true,
    canUse: true,
    heal: 5,
    thumbnail: 'https://i.postimg.cc/bwz7XVch/trasua.png'
  },
  {
    id: 'red_bull',
    name: '🧃 Red Bull',
    description: 'Tăng sức mạnh tạm thời, hồi 7 HP.',
    price: 2800,
    type: 'drink',
    canBuy: true,
    canUse: true,
    heal: 7,
    thumbnail: 'https://i.postimg.cc/BQ5rV9zp/redbull.png'
  },
  {
    id: 'bia',
    name: '🍺 Bia Hơi',
    description: 'Uống tăng dũng cảm, hồi 3 HP.',
    price: 1200,
    type: 'drink',
    canBuy: true,
    canUse: true,
    heal: 3,
    thumbnail: 'https://i.postimg.cc/vBpJpQMq/biahoi.png'
  }
];
