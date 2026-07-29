"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const kitchenLayouts = {
  i: {
    name: "Chữ I",
    index: "01",
    sprite: "/images/kitchen-i-sheet.png",
    lightSprite: "/images/kitchen-i-light-sheet.png",
    short: "Gọn theo một trục",
    desc: "Tối ưu cho không gian hẹp, căn hộ nhỏ và nhà phố có mặt bằng bếp dài.",
    models: [
      "Midnight Linear",
      "Walnut Ribbon",
      "Graphite Compact",
      "Stone Gallery",
      "Bronze Accent",
      "Obsidian Slim",
      "Warm Minimal",
      "Urban Charcoal",
      "Noir Studio",
      "Linear Signature",
      "Nhật Mộc Gallery",
      "Ivory Woodline",
      "Graphite Windowline",
    ],
  },
  l: {
    name: "Chữ L",
    index: "02",
    sprite: "/images/kitchen-l-sheet.png",
    lightSprite: "/images/kitchen-l-light-sheet.png",
    short: "Tối ưu góc & công năng",
    desc: "Khai thác hiệu quả góc chết, tạo tam giác công năng bồn rửa – bếp – tủ lạnh thuận tiện.",
    models: [
      "Walnut Corner",
      "Obsidian Angle",
      "Terra L-Form",
      "Noir Triangle",
      "Bronze Corner",
      "Stone & Oak",
      "Graphite Flow",
      "Urban L-Suite",
      "Warm Geometry",
      "Corner Signature",
      "Champagne Peninsula",
      "Pearl Mirror L",
    ],
  },
  u: {
    name: "Chữ U",
    index: "03",
    sprite: "/images/kitchen-u-sheet.png",
    lightSprite: "/images/kitchen-u-light-sheet.png",
    short: "Rộng rãi & liền mạch",
    desc: "Dành cho không gian lớn, tăng mặt bàn thao tác và dễ kết hợp quầy bar hoặc đảo bếp.",
    models: [
      "Grand U-Noir",
      "Walnut Peninsula",
      "Monolith Stone",
      "Bronze Pavilion",
      "Obsidian Social",
      "Graphite Island",
      "Culinary Suite",
      "Dark Oak Lounge",
      "Architect U",
      "U-Form Signature",
      "Ivory Courtyard U",
      "Sunlit Peninsula U",
    ],
  },
  ceiling: {
    name: "Kịch trần",
    index: "04",
    sprite: "/images/kitchen-ceiling-sheet.png",
    lightSprite: "/images/kitchen-ceiling-light-sheet.png",
    short: "Lưu trữ tối đa",
    desc: "Tối đa hóa không gian lưu trữ theo chiều cao và hạn chế bụi bám trên nóc tủ.",
    models: [
      "Full Height Noir",
      "Walnut Tower",
      "Monolithic Wall",
      "Graphite Ceiling",
      "Bronze Vertical",
      "Obsidian Storage",
      "Tall Oak Gallery",
      "Seamless Height",
      "Urban Tower",
      "Ceiling Signature",
      "Zen Full-Height",
    ],
  },
} as const;

type KitchenLayoutKey = keyof typeof kitchenLayouts;
type VisualMode = "dark" | "light";

const addedKitchenImages: Partial<
  Record<KitchenLayoutKey, Record<number, string>>
> = {
  i: {
    10: "/images/kitchen-additions/pima-i-nhat-moc.jpg",
    11: "/images/kitchen-additions/pima-i-ivory.jpg",
    12: "/images/kitchen-additions/pima-i-graphite.jpg",
  },
  l: {
    10: "/images/kitchen-additions/pima-l-champagne.jpg",
    11: "/images/kitchen-additions/pima-l-pearl.jpg",
  },
  u: {
    10: "/images/kitchen-additions/pima-u-ivory.jpg",
    11: "/images/kitchen-additions/pima-u-sunlit.jpg",
  },
  ceiling: {
    10: "/images/kitchen-additions/pima-ceiling-zen.jpg",
  },
};

const layoutSpecifications: Record<
  KitchenLayoutKey,
  {
    recommendedSpace: string;
    recommendedLength: string;
    cabinetDimensions: string;
    planningNote: string;
  }
> = {
  i: {
    recommendedSpace: "6–12 m²",
    recommendedLength: "2,4–3,6 mét dài",
    cabinetDimensions: "Tủ dưới S 580–600 mm · tủ trên S 320–350 mm",
    planningNote: "Bố trí thiết bị theo một trục, ưu tiên khoảng thao tác liên tục.",
  },
  l: {
    recommendedSpace: "10–18 m²",
    recommendedLength: "3,0–5,0 mét dài",
    cabinetDimensions: "Hai cạnh vuông góc · khoang góc tối ưu phụ kiện",
    planningNote: "Tạo tam giác công năng bồn rửa – bếp nấu – tủ lạnh.",
  },
  u: {
    recommendedSpace: "16–30 m²",
    recommendedLength: "4,5–7,0 mét dài",
    cabinetDimensions: "Lối đi giữa hai dãy khuyến nghị 1.000–1.200 mm",
    planningNote: "Tăng mặt bàn thao tác, có thể kết hợp quầy bar hoặc đảo bếp.",
  },
  ceiling: {
    recommendedSpace: "10–25 m²",
    recommendedLength: "Theo mặt bằng thực tế",
    cabinetDimensions: "Chiều cao hoàn thiện tham khảo 2.400–2.800 mm",
    planningNote: "Khai thác chiều cao để tăng lưu trữ và hạn chế bụi trên nóc tủ.",
  },
};

const modelFinishes = [
  { style: "Hiện đại tối giản", palette: "Đen than · Gỗ óc chó", front: "Laminate lì phối vân gỗ", worktop: "Đá thạch anh vân mây" },
  { style: "Warm luxury", palette: "Nâu walnut · Đồng xước", front: "Melamine vân gỗ phối Laminate", worktop: "Đá thạch anh đen hạt" },
  { style: "Urban contemporary", palette: "Xám graphite · Đen mờ", front: "Acrylic mờ phối Laminate", worktop: "Đá thạch anh xám" },
  { style: "Gallery kitchen", palette: "Trắng đá · Gỗ sẫm", front: "Laminate vân đá phối vân gỗ", worktop: "Đá thạch anh trắng" },
  { style: "Bronze accent", palette: "Đen · Nâu đồng", front: "Acrylic mờ phối chỉ nhấn kim loại", worktop: "Đá thạch anh nâu xám" },
  { style: "Monochrome", palette: "Đen obsidian · Xám khói", front: "Laminate chống xước tông tối", worktop: "Đá thạch anh đen" },
  { style: "Warm minimal", palette: "Kem ấm · Gỗ tự nhiên", front: "Melamine lì phối film PVC vân gỗ", worktop: "Đá thạch anh kem" },
  { style: "Industrial refined", palette: "Xám than · Gỗ hun", front: "Laminate vân xi măng phối vân gỗ", worktop: "Đá thạch anh xám đậm" },
  { style: "Noir studio", palette: "Đen mờ · Champagne", front: "Acrylic mờ phối Laminate", worktop: "Đá thạch anh vân trắng" },
  { style: "PIMA signature", palette: "Gỗ sẫm · Đen · Ánh đồng", front: "Laminate cao cấp phối Acrylic", worktop: "Đá thạch anh vân đá" },
] as const;

const lightModelFinishes = [
  { style: "Modern daylight", palette: "Trắng ngà · Gỗ sồi sáng", front: "Laminate lì phối vân gỗ sáng", worktop: "Đá thạch anh kem" },
  { style: "Soft minimal", palette: "Ivory · Champagne beige", front: "Melamine mờ phối Laminate", worktop: "Đá thạch anh trắng ấm" },
  { style: "Natural contemporary", palette: "Gỗ sồi · Trắng sữa", front: "Laminate vân gỗ phối Acrylic mờ", worktop: "Đá thạch anh vân mây" },
  { style: "Light gallery", palette: "Trắng đá · Be cát", front: "Laminate vân đá phối Melamine", worktop: "Đá thạch anh sáng" },
  { style: "Sage accent", palette: "Xanh sage nhạt · Gỗ tự nhiên", front: "Acrylic mờ phối film PVC vân gỗ", worktop: "Đá thạch anh kem" },
  { style: "Warm ivory", palette: "Kem ấm · Champagne", front: "Laminate lì chống xước", worktop: "Đá thạch anh be sáng" },
  { style: "Scandinavian calm", palette: "Trắng · Gỗ tần bì", front: "Melamine lì phối vân gỗ sáng", worktop: "Đá thạch anh trắng" },
  { style: "Coastal refined", palette: "Trắng ngọc · Xám sương", front: "Acrylic mờ phối Laminate", worktop: "Đá thạch anh xám nhạt" },
  { style: "Sunlit studio", palette: "Be sáng · Gỗ sồi", front: "Laminate mờ phối Melamine", worktop: "Đá thạch anh kem vân nhẹ" },
  { style: "PIMA daylight", palette: "Ivory · Gỗ sáng · Xanh sage", front: "Laminate cao cấp phối Acrylic mờ", worktop: "Đá thạch anh sáng" },
] as const;

const lightModelNames = [
  "Ivory Daylight",
  "Oak Serenity",
  "Sage Morning",
  "Sandstone Glow",
  "Pearl Minimal",
  "Natural Canvas",
  "Warm Linen",
  "Cloud Studio",
  "Sunlit Oak",
  "Daylight Signature",
] as const;

type SelectedModel = {
  layout: KitchenLayoutKey;
  index: number;
};

const getModelVisualStyle = (
  layoutKey: KitchenLayoutKey,
  index: number,
  visualMode: VisualMode,
) => {
  const addedImage = addedKitchenImages[layoutKey]?.[index];
  if (addedImage) {
    return {
      backgroundImage: `url("${addedImage}")`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
  }

  const layout = kitchenLayouts[layoutKey];
  return {
    backgroundImage: `url("${visualMode === "light" ? layout.lightSprite : layout.sprite}")`,
    backgroundPosition: `${(index % 5) * 25}% ${Math.floor(index / 5) * 100}%`,
    backgroundSize: "500% 200%",
  };
};

const finishShowcases = {
  acrylic: {
    label: "Acrylic bóng gương",
    short: "Phản chiếu ánh sáng, mở rộng cảm giác không gian",
    image: "/images/collection-light.png",
    palette: "Trắng ngà · Champagne · Gỗ sồi sáng",
    features: ["Bề mặt bóng sâu", "Dễ vệ sinh", "Hợp căn hộ hiện đại"],
  },
  laminate: {
    label: "Laminate vân gỗ",
    short: "Vân gỗ ấm, sang trọng và giàu chiều sâu kiến trúc",
    image: "/images/collection-walnut.png",
    palette: "Walnut · Đen mờ · Ánh đồng",
    features: ["Vân gỗ tự nhiên", "Chống xước tốt", "Phối màu linh hoạt"],
  },
  cement: {
    label: "Film xi măng Loft",
    short: "Tối giản, mạnh mẽ cho phong cách Industrial và Loft",
    image: "/images/detail-island.png",
    palette: "Xám xi măng · Graphite · Gỗ hun",
    features: ["Hiệu ứng bê tông", "Tông màu trung tính", "Cá tính kiến trúc"],
  },
} as const;

type FinishKey = keyof typeof finishShowcases;

const materialCategories = [
  { key: "all", label: "Tất cả" },
  { key: "board", label: "Tấm ván PIMA" },
  { key: "decor", label: "Tấm trang trí" },
  { key: "duracore", label: "Duracore" },
  { key: "slat", label: "Lam sóng" },
] as const;

type MaterialCategory = (typeof materialCategories)[number]["key"];

const pimaMaterials = [
  {
    code: "S01",
    name: "Tấm ván nhựa PIMA trắng",
    category: "board",
    categoryLabel: "Tấm ván PIMA",
    image: "/images/materials/01-pima-white-s01.jpg",
    size: "1.220 × 2.440 mm",
    thickness: "3–30 mm theo cấu hình",
    structure: "PVC Foam Board màu trắng",
    surface: "Bề mặt phẳng, màu trắng",
    density: "450–1.000 kg/m³ theo dòng",
    application: "Thùng tủ bếp, tủ lavabo, vách ngăn, kệ và đồ nội thất",
    note: "Chọn độ dày và tỷ trọng theo tải trọng, vị trí bắt vít và yêu cầu gia công.",
  },
  {
    code: "FOAM",
    name: "Tấm PIMA trắng gia công nội thất",
    category: "board",
    categoryLabel: "Tấm ván PIMA",
    image: "/images/materials/02-pima-white-foam.jpg",
    size: "1.220 × 2.440 mm",
    thickness: "3–30 mm theo cấu hình",
    structure: "Cốt PVC Foam Board đồng nhất",
    surface: "Trắng, có thể phủ bề mặt",
    density: "450–1.000 kg/m³ theo dòng",
    application: "Thân tủ, hậu tủ, vách kỹ thuật, bảng và chi tiết CNC",
    note: "Kích thước gia công và sai số cần xác nhận theo đơn hàng sản xuất.",
  },
  {
    code: "S16",
    name: "Tấm ván nhựa PIMA đen",
    category: "board",
    categoryLabel: "Tấm ván PIMA",
    image: "/images/materials/03-pima-black-s16.jpg",
    size: "1.220 × 2.440 mm",
    thickness: "3–30 mm theo cấu hình",
    structure: "PVC Foam Board cốt đen",
    surface: "Đen đồng màu",
    density: "Theo mã hàng và độ dày",
    application: "Nội thất tông tối, tủ, kệ, vách và chi tiết trang trí",
    note: "Màu cốt thực tế được duyệt theo mẫu lô trước khi sản xuất hàng loạt.",
  },
  {
    code: "SGT",
    name: "Tấm PIMA SGT – than tre 3 lớp",
    category: "board",
    categoryLabel: "Tấm ván PIMA",
    image: "/images/materials/04-pima-sgt-3-layer.jpg",
    size: "1.220 × 2.440 mm",
    thickness: "8 mm và 17 mm",
    structure: "Hai lớp bề mặt PVC mật độ cao, lõi PVC mật độ tiêu chuẩn",
    surface: "Phẳng, cứng và láng",
    density: "Cấu trúc 3 lớp",
    application: "Cánh tủ, vách, kệ và các chi tiết nội thất cần bề mặt hoàn thiện",
    note: "Thử mẫu liên kết vít và bám dính bề mặt trước khi áp dụng cho cấu hình đặc biệt.",
  },
  {
    code: "W19",
    name: "Tấm PIMA vân gỗ",
    category: "board",
    categoryLabel: "Tấm ván PIMA",
    image: "/images/materials/05-pima-wood-w19.jpg",
    size: "1.220 × 2.440 mm",
    thickness: "3–30 mm theo cấu hình",
    structure: "Nền PVC kết hợp bề mặt vân gỗ",
    surface: "Vân gỗ W19",
    density: "450–1.000 kg/m³ theo dòng",
    application: "Tủ bếp, tủ áo, vách trang trí, kệ và nội thất nhà ở",
    note: "Màu sắc hiển thị trên màn hình có thể khác mẫu vật liệu thực tế.",
  },
  {
    code: "W06",
    name: "Tấm tủ PIMA Duracore",
    category: "duracore",
    categoryLabel: "Duracore",
    image: "/images/materials/06-pima-duracore-w06.jpg",
    size: "Theo quy cách sản xuất",
    thickness: "Cấu hình chuyên dụng làm tủ",
    structure: "Cốt nhựa PVC kết hợp film PVC hoàn thiện",
    surface: "Vân gỗ W06",
    density: "Theo mã Duracore",
    application: "Tủ bếp, tủ quần áo, tủ lavabo, kệ tivi và kệ trang trí",
    note: "Quy cách, chiều dày và mặt phủ cần xác nhận theo bảng hàng Duracore hiện hành.",
  },
  {
    code: "8875",
    name: "Tấm cẩm thạch PIMA",
    category: "decor",
    categoryLabel: "Tấm trang trí",
    image: "/images/materials/07-pima-marble-8875.jpg",
    size: "1.220 × 2.440 mm",
    thickness: "Khoảng 2,5 mm theo mã hàng",
    structure: "Tấm PVC trang trí",
    surface: "Vân đá cẩm thạch 8875",
    density: "Theo tiêu chuẩn dòng tấm trang trí",
    application: "Ốp tường, mảng nhấn, sảnh, quầy và trang trí nội thất",
    note: "Thi công trên nền phẳng, khô; sử dụng keo và phụ kiện nẹp phù hợp.",
  },
  {
    code: "ECP-35",
    name: "Tấm ốp Nano PIMA ECP-35",
    category: "decor",
    categoryLabel: "Tấm trang trí",
    image: "/images/materials/08-pima-nano-ecp35.jpg",
    size: "Khoảng 400 × 3.000 mm",
    thickness: "8–9 mm theo mã sản xuất",
    structure: "Tấm ốp PVC rỗng đa khoang",
    surface: "Film vân gỗ ECP-35",
    density: "Khoảng 8 tấm/kiện với dòng 4008",
    application: "Ốp tường, trần và hoàn thiện mảng trang trí",
    note: "Chiều dài, độ dày và quy cách đóng kiện xác nhận theo lệnh sản xuất.",
  },
  {
    code: "ECP-34",
    name: "Tấm ốp Nano PIMA ECP-34",
    category: "decor",
    categoryLabel: "Tấm trang trí",
    image: "/images/materials/09-pima-nano-ecp34.jpg",
    size: "Khoảng 400 × 3.000 mm",
    thickness: "8–9 mm theo mã sản xuất",
    structure: "Tấm ốp PVC rỗng đa khoang",
    surface: "Film vân gỗ ECP-34",
    density: "Khoảng 8 tấm/kiện với dòng 4008",
    application: "Ốp tường phòng khách, phòng ngủ, văn phòng và cửa hàng",
    note: "Nên chốt màu bằng mẫu film thật trước khi triển khai toàn bộ công trình.",
  },
  {
    code: "ECP-33",
    name: "Tấm ốp Nano PIMA ECP-33",
    category: "decor",
    categoryLabel: "Tấm trang trí",
    image: "/images/materials/10-pima-nano-ecp33.jpg",
    size: "Khoảng 400 × 3.000 mm",
    thickness: "8–9 mm theo mã sản xuất",
    structure: "Tấm ốp PVC rỗng đa khoang",
    surface: "Film vân gỗ ECP-33",
    density: "Khoảng 8 tấm/kiện với dòng 4008",
    application: "Ốp tường, trần và phối mảng nội thất vân gỗ",
    note: "Dùng phụ kiện đồng màu để xử lý góc, mép và điểm kết thúc tấm.",
  },
  {
    code: "4009-W66",
    name: "Tấm ốp tường PIMA W66",
    category: "decor",
    categoryLabel: "Tấm trang trí",
    image: "/images/materials/11-pima-wall-w66.jpg",
    size: "Khoảng 400 × 3.000 mm",
    thickness: "9 mm theo mã 4009",
    structure: "Tấm ốp PVC đa khoang",
    surface: "Film vân gỗ W66",
    density: "Theo quy cách tấm ốp",
    application: "Ốp tường, trần, mảng đầu giường và không gian thương mại",
    note: "Quy cách thực tế cần đối chiếu catalogue và phiếu xác nhận đơn hàng.",
  },
  {
    code: "4009-W64",
    name: "Tấm ốp tường PIMA W64",
    category: "decor",
    categoryLabel: "Tấm trang trí",
    image: "/images/materials/12-pima-wall-w64.jpg",
    size: "Khoảng 400 × 3.000 mm",
    thickness: "9 mm theo mã 4009",
    structure: "Tấm ốp PVC đa khoang",
    surface: "Film vân gỗ W64",
    density: "Theo quy cách tấm ốp",
    application: "Ốp tường và phối màu nội thất tông gỗ sẫm",
    note: "Kiểm tra bề mặt nền, khe giãn nở và hướng vân trước khi lắp đặt.",
  },
  {
    code: "6S8",
    name: "Tấm lam 6 sóng 8 PIMA",
    category: "slat",
    categoryLabel: "Lam sóng",
    image: "/images/materials/13-pima-lam-6-wave-8.jpg",
    size: "Theo profile lam 6 sóng",
    thickness: "Cao sóng 8 mm",
    structure: "Profile PVC lam sóng",
    surface: "Trắng hoặc phủ film theo bảng màu",
    density: "Theo tiêu chuẩn profile",
    application: "Ốp tường, trần, mảng nhấn và trang trí quầy",
    note: "Bố trí xương, keo và nẹp kết thúc theo điều kiện nền thi công.",
  },
  {
    code: "PW215-W19",
    name: "Tấm lam 6 sóng PIMA W19",
    category: "slat",
    categoryLabel: "Lam sóng",
    image: "/images/materials/14-pima-lam-6-wave-w19.jpg",
    size: "Rộng khoảng 215 mm",
    thickness: "Cao sóng khoảng 20 mm",
    structure: "Profile PVC 6 sóng",
    surface: "Film vân gỗ W19",
    density: "Theo tiêu chuẩn profile",
    application: "Mảng tivi, vách trang trí, trần và cột điểm nhấn",
    note: "Thông số danh nghĩa cần đối chiếu mẫu profile trước khi bóc khối lượng.",
  },
  {
    code: "PW205-W19",
    name: "Tấm lam 3 sóng PIMA W19",
    category: "slat",
    categoryLabel: "Lam sóng",
    image: "/images/materials/15-pima-lam-3-wave-w19.jpg",
    size: "Rộng khoảng 205 mm",
    thickness: "Cao sóng khoảng 30 mm",
    structure: "Profile PVC 3 sóng",
    surface: "Film vân gỗ W19",
    density: "Theo tiêu chuẩn profile",
    application: "Vách nhấn kiến trúc, sảnh, quầy và không gian cần chiều sâu",
    note: "Tính hao hụt theo bước sóng, điểm nối và hướng lắp đặt thực tế.",
  },
] as const;

const packages = {
  essential: {
    name: "Essential",
    label: "Tinh gọn",
    price: 5_300_000,
    upper: "2,2 triệu",
    lower: "3,1 triệu",
    desc: "Tối ưu ngân sách, đủ đầy công năng cho căn hộ và nhà phố.",
    features: ["Cốt ván nhựa PIMA", "Bề mặt Melamine", "Phụ kiện giảm chấn cơ bản"],
  },
  comfort: {
    name: "Comfort",
    label: "Được chọn nhiều",
    price: 6_400_000,
    upper: "2,7 triệu",
    lower: "3,7 triệu",
    desc: "Cân bằng giữa thẩm mỹ, độ bền và trải nghiệm sử dụng mỗi ngày.",
    features: ["Cốt ván nhựa PIMA", "Melamine / Laminate", "Phụ kiện giảm chấn đồng bộ"],
  },
  premium: {
    name: "Premium",
    label: "Cá nhân hóa",
    price: 8_000_000,
    upper: "3,4 triệu",
    lower: "4,6 triệu",
    desc: "Thiết kế riêng với bề mặt cao cấp và hệ phụ kiện chọn lọc.",
    features: ["Cốt ván nhựa PIMA", "Acrylic / Laminate cao cấp", "Phụ kiện nâng cấp theo nhu cầu"],
  },
} as const;

type PackageKey = keyof typeof packages;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

function SectionHotline({ label = "Tư vấn nhanh cho hạng mục này" }: { label?: string }) {
  return (
    <div className="section-hotline" aria-label="Liên hệ Hotline và Zalo PIMA">
      <span className="section-hotline-label">{label}</span>
      <a href="tel:0902999304" aria-label="Gọi Hotline PIMA 0902 999 304">
        <span aria-hidden="true">☎</span>
        <small>Hotline</small>
        <strong>0902.999.304</strong>
      </a>
      <a
        className="section-hotline-zalo"
        href="https://zalo.me/0902999304"
        target="_blank"
        rel="noreferrer"
        aria-label="Liên hệ Zalo PIMA 0902 999 304"
      >
        <span aria-hidden="true">Z</span>
        <small>Zalo tư vấn</small>
        <strong>0902.999.304</strong>
      </a>
    </div>
  );
}

const footerQualityRecords = [
  {
    mark: "ISO",
    title: "ISO 9001:2015",
    detail: "Hệ thống quản lý chất lượng",
  },
  {
    mark: "SGS",
    title: "SGS Tested",
    detail: "Kiểm nghiệm độc lập theo chỉ tiêu áp dụng",
  },
  {
    mark: "Q3",
    title: "QUATEST 3",
    detail: "Hồ sơ thử nghiệm tại Trung tâm Kỹ thuật 3",
  },
  {
    mark: "RoHS",
    title: "RoHS",
    detail: "Kiểm soát các chất nguy hại theo phạm vi hồ sơ",
  },
  {
    mark: "SAFE",
    title: "Chỉ tiêu độc hại",
    detail: "Kết quả kiểm nghiệm an toàn vật liệu",
  },
  {
    mark: "FIRE",
    title: "Chống cháy lan",
    detail: "Thử nghiệm khả năng cháy theo mẫu sản phẩm",
  },
  {
    mark: "CEIL",
    title: "Test tấm trần nhựa",
    detail: "Kết quả thử nghiệm cho nhóm tấm trần PIMA",
  },
] as const;

export default function Home() {
  const [visualMode, setVisualMode] = useState<VisualMode>("dark");
  const [selected, setSelected] = useState<PackageKey>("comfort");
  const [activeLayout, setActiveLayout] = useState<KitchenLayoutKey>("i");
  const [length, setLength] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [selectedModel, setSelectedModel] = useState<SelectedModel | null>(null);
  const [activeMaterialCategory, setActiveMaterialCategory] = useState<MaterialCategory>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
  const [ledReveal, setLedReveal] = useState(52);
  const [activeFinish, setActiveFinish] = useState<FinishKey>("acrylic");

  useEffect(() => {
    const restoreMode = window.setTimeout(() => {
      const savedMode = window.localStorage.getItem("pima-kitchen-mode");
      if (savedMode === "light" || savedMode === "dark") {
        setVisualMode(savedMode);
      }
    }, 0);
    return () => window.clearTimeout(restoreMode);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("pima-kitchen-mode", visualMode);
    document.documentElement.style.colorScheme = visualMode === "light" ? "light" : "dark";
  }, [visualMode]);

  useEffect(() => {
    const icons = Array.from(document.querySelectorAll<HTMLElement>(".feature-icon"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.35 }
    );
    icons.forEach((icon) => observer.observe(icon));
    return () => observer.disconnect();
  }, []);

  const estimate = useMemo(() => {
    const cabinet = packages[selected].price * length;
    const stoneAndGlass = 2_150_000 * length;
    return Math.round((cabinet + stoneAndGlass) * 1.1);
  }, [selected, length]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleHeroSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHeroSubmitted(true);
  };

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!selectedModel && selectedMaterial === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedModel(null);
        setSelectedMaterial(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedModel, selectedMaterial]);

  const filteredMaterials = pimaMaterials
    .map((material, index) => ({ material, index }))
    .filter(({ material }) =>
      activeMaterialCategory === "all" || material.category === activeMaterialCategory
    );

  const changeModalModel = (direction: -1 | 1) => {
    setSelectedModel((current) => {
      if (!current) return null;
      const total = kitchenLayouts[current.layout].models.length;
      return { ...current, index: (current.index + direction + total) % total };
    });
  };

  const selectedModelDetail = selectedModel
    ? {
        layout: kitchenLayouts[selectedModel.layout],
        specifications: layoutSpecifications[selectedModel.layout],
        finish: visualMode === "light"
          ? lightModelFinishes[selectedModel.index % lightModelFinishes.length]
          : modelFinishes[selectedModel.index % modelFinishes.length],
        model: visualMode === "light" && !addedKitchenImages[selectedModel.layout]?.[selectedModel.index]
          ? lightModelNames[selectedModel.index]
          : kitchenLayouts[selectedModel.layout].models[selectedModel.index],
      }
    : null;

  return (
    <main className={`site-shell mode-${visualMode}`}>
      <header className="site-header">
        <a className="brand-logo" href="#top" aria-label="PIMA - về đầu trang">
          <img src="/images/pima-logo.png" alt="Logo chính thức PIMA" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <nav className={menuOpen ? "nav-open" : ""} aria-label="Điều hướng chính">
          <a href="#san-pham" onClick={closeMenu}>Sản phẩm</a>
          <a href="#kieu-bep" onClick={closeMenu}>Kiểu bếp</a>
          <a href="#vat-lieu" onClick={closeMenu}>Vật liệu</a>
          <a href="#bo-suu-tap" onClick={closeMenu}>Bộ sưu tập</a>
          <a href="#quy-trinh" onClick={closeMenu}>Quy trình</a>
        </nav>

        <div className="header-actions">
          <div className="mode-switch" role="group" aria-label="Chọn giao diện landing page">
            <button
              type="button"
              className={visualMode === "light" ? "active" : ""}
              aria-pressed={visualMode === "light"}
              onClick={() => setVisualMode("light")}
            >
              <span aria-hidden="true">☀</span> Ban ngày
            </button>
            <button
              type="button"
              className={visualMode === "dark" ? "active" : ""}
              aria-pressed={visualMode === "dark"}
              onClick={() => setVisualMode("dark")}
            >
              <span aria-hidden="true">◐</span> Dark
            </button>
          </div>
          <a className="header-cta" href="tel:0902999304">
            Hotline/Zalo · <strong>0902.999.304</strong>
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div
          className="hero-image"
          role="img"
          aria-label={visualMode === "light"
            ? "Không gian bếp PIMA trắng kem và gỗ sáng dưới ánh nắng ban ngày"
            : "Không gian bếp PIMA đen và gỗ óc chó"}
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">Tạm biệt tủ bếp ẩm mốc, mối mọt &amp; mùi hắc độc hại</p>
          <h1>
            Tủ bếp nhựa
            <br />
            PIMA Duracore
            <span className="hero-h1-note">Đẳng cấp nội thất xanh · bền bỉ dài lâu</span>
          </h1>
          <p className="hero-copy">
            Giải pháp tủ bếp PVC thế hệ mới: chống nước 100%, không phải nguồn
            thức ăn của mối mọt và không sử dụng Formaldehyde trong thành phần cốt tấm.
          </p>
          <div className="hero-actions">
            <a className="button button-orange" href="#dang-ky">
              Nhận báo giá trong 24h <span>↗</span>
            </a>
            <a className="text-link" href="#bo-suu-tap">
              Xem bộ sưu tập <span>→</span>
            </a>
          </div>
          <div className="hero-direct-contact" aria-label="Liên hệ nhanh PIMA">
            <span>Cần tư vấn ngay?</span>
            <a href="tel:0902999304">☎ 0902.999.304</a>
            <a href="https://zalo.me/0902999304" target="_blank" rel="noreferrer">
              Zalo 0902.999.304
            </a>
          </div>
          <div className="hero-benefits" aria-label="Lợi ích nổi bật">
            <div><b>01</b><span>Cam kết bảo hành cốt nhựa PIMA</span></div>
            <div><b>02</b><span>Kiểm soát theo ISO 9001:2015</span></div>
            <div><b>03</b><span>Hồ sơ kiểm nghiệm SGS</span></div>
          </div>
        </div>
        <aside className="hero-lead-card" aria-label="Đăng ký nhận tư vấn nhanh">
          {heroSubmitted ? (
            <div className="hero-lead-success" role="status">
              <span>✓</span>
              <p>Đã ghi nhận thông tin</p>
              <h2>PIMA sẽ liên hệ trong giờ làm việc.</h2>
              <small>Bản demo chưa kết nối hệ thống nhận khách hàng.</small>
              <button type="button" onClick={() => setHeroSubmitted(false)}>Gửi lại thông tin</button>
            </div>
          ) : (
            <>
              <p>Nhận tư vấn miễn phí</p>
              <h2>Để PIMA gọi lại trong giờ làm việc.</h2>
              <form className="hero-lead-form" onSubmit={handleHeroSubmit}>
                <label>
                  Tên của bạn
                  <input required name="hero-name" autoComplete="name" placeholder="Nguyễn Văn A" />
                </label>
                <label>
                  Số điện thoại
                  <input
                    required
                    name="hero-phone"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="09xx xxx xxx"
                  />
                </label>
                <button className="button button-orange" type="submit">
                  Nhận tư vấn ngay <span>↗</span>
                </button>
                <a className="hero-form-hotline" href="tel:0902999304">
                  Hoặc gọi ngay: <strong>0902.999.304</strong>
                </a>
                <small>Chỉ dùng để tư vấn sản phẩm PIMA. Không gửi quảng cáo ngoài yêu cầu.</small>
              </form>
            </>
          )}
        </aside>
        <p className="vertical-note">PIMA KITCHEN COLLECTION</p>
      </section>

      <section className="led-compare section" id="ban-ngay-ban-dem">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Daylight / LED night experience</p>
            <h2>Một căn bếp.<br />Hai trạng thái ánh sáng.</h2>
          </div>
          <p>
            Kéo thanh trượt để xem không gian bếp khi đón ánh sáng ban ngày và
            khi hệ đèn LED tủ được bật vào ban đêm.
          </p>
        </div>
        <SectionHotline label="Tư vấn giải pháp ánh sáng & bố trí bếp" />
        <div className="led-compare-stage">
          <img src="/images/hero-light.png" alt="Không gian bếp PIMA vào ban ngày" />
          <div
            className="led-night-layer"
            style={{ clipPath: `inset(0 ${100 - ledReveal}% 0 0)` }}
          >
            <img src="/images/hero-kitchen.png" alt="Không gian bếp PIMA khi bật đèn LED ban đêm" />
          </div>
          <div className="led-divider" style={{ left: `${ledReveal}%` }} aria-hidden="true">
            <span>↔</span>
          </div>
          <div className="led-state-labels" aria-hidden="true">
            <span>☀ Ban ngày</span>
            <span>✦ LED ban đêm</span>
          </div>
        </div>
        <div className="led-range-wrap">
          <button type="button" onClick={() => setLedReveal(0)}>Ban ngày</button>
          <input
            type="range"
            min="0"
            max="100"
            value={ledReveal}
            aria-label="So sánh không gian bếp ban ngày và ban đêm"
            onChange={(event) => setLedReveal(Number(event.target.value))}
          />
          <button type="button" onClick={() => setLedReveal(100)}>Bật LED</button>
        </div>
      </section>

      <section className="video-story" id="trai-nghiem" aria-labelledby="video-story-title">
        <div className="video-story-heading">
          <div>
            <p className="section-kicker">PIMA Kitchen film · 00:10</p>
            <h2 id="video-story-title">
              Nhìn thấy vẻ đẹp.
              <br />
              Cảm nhận công năng.
            </h2>
          </div>
          <div className="video-story-copy">
            <p>
              Khám phá một không gian bếp PIMA hiện đại, nơi vật liệu bền vững,
              đường nét tinh gọn và hệ lưu trữ được kết nối trong cùng một thiết kế.
            </p>
            <span>Video tự phát không tiếng · Chạm điều khiển để bật âm thanh</span>
          </div>
        </div>

        <div className="video-story-frame">
          <video
            className="video-story-player"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            poster="/media/pima-kitchen-film-poster.jpg"
            aria-label="Video giới thiệu không gian tủ bếp PIMA hiện đại"
          >
            <source src="/media/pima-kitchen-film.mp4" type="video/mp4" />
            Trình duyệt của bạn chưa hỗ trợ phát video.
          </video>
          <div className="video-story-brand" aria-hidden="true">
            <img src="/images/pima-logo.png" alt="" />
          </div>
          <p className="video-story-index">PIMA / KITCHEN / 2026</p>
        </div>
      </section>

      <section className="intro section">
        <div className="section-kicker">Nền tảng vật liệu</div>
        <div className="intro-copy">
          <h2>Một căn bếp đẹp bắt đầu từ phần cốt bên trong.</h2>
          <p>
            PIMA kết hợp vật liệu PVC Foam Board với tư duy thiết kế kiến trúc,
            tạo nên hệ tủ bếp phù hợp khí hậu nóng ẩm và nhịp sống Việt.
          </p>
        </div>
        <div className="stats">
          <div><strong>100%</strong><span>không trương nở do nước</span></div>
          <div><strong>3</strong><span>cấu hình ngân sách</span></div>
          <div><strong>01</strong><span>quy trình xuyên suốt</span></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Chứng nhận và kiểm soát chất lượng">
        <div className="trust-copy">
          <p className="section-kicker">Nguồn gốc & kiểm soát chất lượng</p>
          <h2>Cốt PVC không sử dụng formaldehyde trong thành phần cốt tấm.</h2>
          <p>
            Hồ sơ chất lượng và phạm vi chứng nhận được đối chiếu theo từng mã
            sản phẩm, lô hàng và yêu cầu của công trình.
          </p>
        </div>
        <div className="certification-badges">
          <article><span>ISO</span><strong>9001:2015</strong><small>Hệ thống quản lý chất lượng</small></article>
          <article><span>SGS</span><strong>Tested</strong><small>Kiểm nghiệm theo chỉ tiêu áp dụng</small></article>
          <article><span>QUATEST 3</span><strong>Verified</strong><small>Trung tâm Kỹ thuật 3</small></article>
        </div>
      </section>

      <section className="pain-solution section" id="so-sanh-vat-lieu">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Nỗi đau khách hàng · The problem</p>
            <h2>Có phải căn bếp nhà bạn đang gặp những “căn bệnh trầm kha” này?</h2>
          </div>
          <p>
            Ba vấn đề thường âm thầm phát triển từ phần cốt tủ, đặc biệt tại khu
            vực chậu rửa, nơi thường xuyên tiếp xúc với hơi ẩm và nước rò rỉ.
          </p>
        </div>
        <SectionHotline label="Nhận tư vấn vật liệu phù hợp khu vực ẩm" />
        <div className="problem-grid">
          <article>
            <span aria-hidden="true">01</span>
            <div>
              <h3>Mốc, phù nở tại khoang chậu rửa</h3>
              <p>
                Tủ gỗ công nghiệp MDF/HDF dù được xử lý chống ẩm vẫn có nguy cơ
                bong cạnh, trương nở và phát sinh mùi hôi khi nước xâm nhập kéo dài.
              </p>
            </div>
          </article>
          <article>
            <span aria-hidden="true">02</span>
            <div>
              <h3>Mối mọt tấn công từ bên trong</h3>
              <p>
                Sau thời gian sử dụng, cốt gỗ có thể trở thành nơi trú ngụ và nguồn
                thức ăn của mối, ảnh hưởng liên kết bản lề và độ ổn định của cánh tủ.
              </p>
            </div>
          </article>
          <article>
            <span aria-hidden="true">03</span>
            <div>
              <h3>Lo ngại phát thải Formaldehyde</h3>
              <p>
                Chất lượng keo và tiêu chuẩn cốt gỗ khác nhau có thể tạo mùi hắc,
                khiến gia đình quan tâm hơn đến chất lượng không khí trong bếp.
              </p>
            </div>
          </article>
        </div>
        <div className="pain-visual">
          <img
            src="/images/pain-vs-solution.png"
            alt="Ảnh minh họa đối lập MDF bị ẩm hỏng và tủ bếp cốt PVC PIMA khô ráo"
          />
          <div className="pain-label pain-label-left">
            <span>Vấn đề thường gặp</span>
            <strong>MDF tại vùng ẩm</strong>
            <small>Có nguy cơ trương nở, bong cạnh khi nước xâm nhập kéo dài.</small>
          </div>
          <div className="pain-label pain-label-right">
            <span>Giải pháp PIMA</span>
            <strong>Cốt PVC chống nước</strong>
            <small>Ổn định trong môi trường ẩm khi thi công và sử dụng đúng kỹ thuật.</small>
          </div>
        </div>
        <div className="feature-icons" aria-label="Đặc tính vật liệu PIMA">
          <article>
            <span className="feature-icon" aria-hidden="true">💧</span>
            <div><strong>Chống nước</strong><small>Cốt tấm không trương nở do nước.</small></div>
          </article>
          <article>
            <span className="feature-icon" aria-hidden="true">♨</span>
            <div><strong>An toàn khu vực bếp</strong><small>Bố trí cách nguồn nhiệt theo cấu tạo thiết kế.</small></div>
          </article>
          <article>
            <span className="feature-icon" aria-hidden="true">◉</span>
            <div><strong>Chống mối mọt</strong><small>Cốt nhựa PVC không phải nguồn thức ăn của mối.</small></div>
          </article>
        </div>
        <p className="technical-note">
          Ảnh minh họa kỹ thuật, không phải ảnh đối chứng cùng một công trình sau 10 năm.
          Hiệu quả thực tế phụ thuộc cấu hình vật liệu, phụ kiện, thi công và điều kiện sử dụng.
        </p>
        <div className="problem-question">
          <span>Bạn đang tìm kiếm một vật liệu</span>
          <strong>thật sự chống nước, chống mọt nhưng vẫn sang trọng và thẩm mỹ cao?</strong>
          <a href="#dang-ky">Nhận tư vấn cấu hình phù hợp <b>↗</b></a>
        </div>
      </section>

      <section className="duracore-solution section" id="giai-phap-duracore">
        <div className="solution-heading">
          <div>
            <p className="section-kicker">Giải pháp vượt trội · The PIMA solution</p>
            <h2>PIMA Duracore – “Lá chắn thép” cho không gian bếp hạnh phúc.</h2>
          </div>
          <p>
            Không chỉ là một tấm nhựa thông thường, PIMA Duracore là hệ vật liệu
            PVC được phát triển cho nội thất, hướng đến độ ổn định trong môi trường
            nóng ẩm và khả năng hoàn thiện đa dạng.
          </p>
        </div>

        <div className="solution-grid">
          <article>
            <span className="solution-icon" aria-hidden="true">💧</span>
            <div><small>01 / WATERPROOF</small><h3>Chống nước 100%</h3></div>
            <p>Cốt tấm PVC không trương nở do nước, duy trì kích thước khi được sử dụng đúng cấu hình kỹ thuật.</p>
          </article>
          <article>
            <span className="solution-icon" aria-hidden="true">◉</span>
            <div><small>02 / TERMITE RESISTANT</small><h3>Kháng mối mọt</h3></div>
            <p>Cốt nhựa PVC không phải nguồn thức ăn của mối mọt, phù hợp các khu vực nội thất có độ ẩm cao.</p>
          </article>
          <article>
            <span className="solution-icon" aria-hidden="true">✦</span>
            <div><small>03 / ZERO ADDED FORMALDEHYDE</small><h3>Không dùng Formaldehyde trong cốt tấm</h3></div>
            <p>Hồ sơ chất lượng được đối chiếu theo mã sản phẩm, chỉ tiêu áp dụng và lô hàng thực tế.</p>
          </article>
          <article>
            <span className="solution-icon" aria-hidden="true">♨</span>
            <div><small>04 / FIRE PERFORMANCE</small><h3>Hạn chế cháy lan</h3></div>
            <p>Đặc tính cháy được xác nhận theo cấu hình và phương pháp thử; khu vực bếp vẫn cần tuân thủ khoảng cách an toàn nhiệt.</p>
          </article>
          <article>
            <span className="solution-icon" aria-hidden="true">◇</span>
            <div><small>05 / SURFACE DESIGN</small><h3>Thẩm mỹ thời thượng</h3></div>
            <p>Dễ phối Acrylic bóng gương, Laminate vân gỗ, film xi măng hoặc vân đá cho nhiều phong cách thiết kế.</p>
          </article>
        </div>
        <div className="solution-cta">
          <div>
            <span>Chọn đúng cốt · Chọn đúng bề mặt · Chọn đúng ngân sách</span>
            <strong>Nhận mẫu vật liệu và cấu hình đề xuất cho căn bếp của bạn.</strong>
          </div>
          <a className="button button-orange" href="#dang-ky">Nhận tư vấn miễn phí <span>↗</span></a>
        </div>
        <p className="technical-note">
          Tuyên bố hiệu năng và chứng nhận áp dụng theo phạm vi hồ sơ của từng mã
          sản phẩm, độ dày, cấu hình hoàn thiện và phương pháp thử tương ứng.
        </p>
      </section>

      <section className="reason-to-buy section" id="bang-so-sanh">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Bảng so sánh công năng · Reason to buy</p>
            <h2>Khác biệt nằm ở giá trị sử dụng dài hạn.</h2>
          </div>
          <p>
            Bảng dưới đây giúp so sánh nhanh đặc tính phổ biến của ba nhóm vật liệu.
            Kết quả thực tế phụ thuộc chất lượng vật liệu, thi công và điều kiện sử dụng.
          </p>
        </div>
        <div className="comparison-table-wrap" role="region" aria-label="Bảng so sánh vật liệu tủ bếp" tabIndex={0}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Tiêu chí so sánh</th>
                <th className="pima-column"><span>Khuyên dùng</span>Tủ bếp nhựa PIMA Duracore</th>
                <th>Gỗ công nghiệp MDF/HDF</th>
                <th>Gỗ tự nhiên</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Khả năng chống nước</th>
                <td className="pima-column"><b>✓</b> Cốt PVC không trương nở do nước</td>
                <td>Chống ẩm theo cấp vật liệu; có nguy cơ phù nở khi nước xâm nhập</td>
                <td>Có thể cong vênh, co ngót khi độ ẩm thay đổi</td>
              </tr>
              <tr>
                <th>Kháng mối mọt</th>
                <td className="pima-column"><b>✓</b> Cốt nhựa không phải thức ăn của mối</td>
                <td>Có nguy cơ bị mối mọt tấn công theo điều kiện môi trường</td>
                <td>Cần xử lý và bảo trì phòng mối mọt</td>
              </tr>
              <tr>
                <th>An toàn sức khỏe</th>
                <td className="pima-column"><b>✓</b> Không sử dụng Formaldehyde trong thành phần cốt tấm</td>
                <td>Phụ thuộc cấp phát thải Formaldehyde và loại keo sử dụng</td>
                <td>Phụ thuộc sơn, keo và hệ hoàn thiện bề mặt</td>
              </tr>
              <tr>
                <th>Đặc tính cháy</th>
                <td className="pima-column"><b>✓</b> Đối chiếu theo chỉ tiêu thử nghiệm của từng cấu hình</td>
                <td>Vật liệu hữu cơ, cần giải pháp an toàn cháy phù hợp</td>
                <td>Vật liệu hữu cơ, có khả năng bắt cháy</td>
              </tr>
              <tr>
                <th>Độ ổn định lâu dài</th>
                <td className="pima-column"><b>✓</b> Ổn định trong môi trường ẩm khi thi công đúng kỹ thuật</td>
                <td>Phụ thuộc độ ẩm, chất lượng cạnh dán và điều kiện sử dụng</td>
                <td>Phụ thuộc độ ẩm, kỹ thuật xử lý và bảo trì định kỳ</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="comparison-close">
          <div>
            <span>Đừng để căn bếp ẩm mốc làm giảm giá trị ngôi nhà bạn.</span>
            <strong>Chọn PIMA Duracore ngay từ phần cốt.</strong>
          </div>
          <a href="tel:0902999304">Hotline tư vấn <b>0902.999.304</b></a>
        </div>
      </section>

      <section className="packages section" id="san-pham">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Cấu hình sản phẩm</p>
            <h2>Chọn chuẩn bếp của bạn.</h2>
          </div>
          <p>
            Đơn giá tư vấn sơ bộ cho bộ tủ trên và tủ dưới. Giá chính thức được
            xác lập sau khi khảo sát, duyệt vật liệu và bản vẽ.
          </p>
        </div>

        <SectionHotline label="Nhận báo giá theo cấu hình bạn chọn" />
        <div className="package-grid">
          {(Object.keys(packages) as PackageKey[]).map((key, index) => {
            const item = packages[key];
            return (
              <article
                className={`package-card ${key === selected ? "selected" : ""}`}
                key={key}
                onClick={() => setSelected(key)}
              >
                <div className="package-topline">
                  <span>0{index + 1}</span>
                  <span>{item.label}</span>
                </div>
                <h3>PIMA {item.name}</h3>
                <p>{item.desc}</p>
                <div className="package-price">
                  <strong>{(item.price / 1_000_000).toFixed(1).replace(".", ",")}</strong>
                  <span>triệu đồng / mét dài<br />bộ tủ trên + dưới</span>
                </div>
                <div className="mini-prices">
                  <span>Tủ trên <b>{item.upper}/md</b></span>
                  <span>Tủ dưới <b>{item.lower}/md</b></span>
                </div>
                <ul>
                  {item.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <button type="button" onClick={() => setSelected(key)}>
                  {key === selected ? "Đang lựa chọn" : "Chọn cấu hình"} <span>→</span>
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="layout-showcase section" id="kieu-bep">
        <div className="section-heading layout-heading">
          <div>
            <p className="section-kicker">48 mẫu thiết kế tiêu biểu</p>
            <h2>Bốn dáng bếp.<br />Một chuẩn PIMA.</h2>
          </div>
          <p>
            Chọn kiểu dáng phù hợp với mặt bằng để xem 11–13 gợi ý thiết kế. Mỗi
            mẫu có thể tiếp tục cá nhân hóa màu sắc, bề mặt và hệ phụ kiện.
          </p>
        </div>

        <SectionHotline label="Gửi mặt bằng để chọn đúng kiểu bếp" />
        <div className="layout-tabs" role="tablist" aria-label="Chọn kiểu dáng tủ bếp">
          {(Object.keys(kitchenLayouts) as KitchenLayoutKey[]).map((key) => {
            const layout = kitchenLayouts[key];
            const active = key === activeLayout;
            return (
              <button
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="layout-gallery"
                className={active ? "active" : ""}
                key={key}
                onClick={() => setActiveLayout(key)}
              >
                <span>{layout.index}</span>
                <strong>{layout.name}</strong>
                <small>{layout.short}</small>
              </button>
            );
          })}
        </div>

        <div className="layout-detail">
          <div>
            <p className="section-kicker">
              {kitchenLayouts[activeLayout].index} / {kitchenLayouts[activeLayout].name}
            </p>
            <h3>{kitchenLayouts[activeLayout].short}</h3>
          </div>
          <p>{kitchenLayouts[activeLayout].desc}</p>
          <span>{kitchenLayouts[activeLayout].models.length} mẫu</span>
        </div>

        <div className="model-grid" id="layout-gallery" role="tabpanel">
          {kitchenLayouts[activeLayout].models.map((model, index) => (
            <article className="model-card" key={`${activeLayout}-${model}`}>
              <button
                className="model-image-button"
                type="button"
                aria-label={`Xem ảnh lớn và thông số mẫu ${model}`}
                onClick={() => setSelectedModel({ layout: activeLayout, index })}
              >
                <span
                  className="model-image"
                  role="img"
                  aria-label={`Mẫu tủ bếp ${kitchenLayouts[activeLayout].name} ${model}`}
                  style={getModelVisualStyle(activeLayout, index, visualMode)}
                />
                <span className="model-view-hint"><b>＋</b> Xem ảnh & thông số</span>
              </button>
              <div className="model-caption">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h4>
                    {visualMode === "light" && !addedKitchenImages[activeLayout]?.[index]
                      ? lightModelNames[index]
                      : model}
                  </h4>
                  <p>PIMA {kitchenLayouts[activeLayout].name}</p>
                </div>
                <a href="#dang-ky" aria-label={`Nhận tư vấn mẫu ${model}`}>↗</a>
              </div>
            </article>
          ))}
        </div>
        <p className="image-note">
          Hình ảnh minh họa định hướng thiết kế. Màu sắc và cấu hình thực tế
          được chốt theo mẫu vật liệu, bản vẽ và mặt bằng công trình.
        </p>
      </section>

      <section className="materials section" id="vat-lieu">
        <div className="materials-heading">
          <div>
            <p className="section-kicker">Material library · 15 mẫu tiêu biểu</p>
            <h2>Vật liệu PIMA.<br />Hiểu rõ trước khi chọn.</h2>
          </div>
          <p>
            Thư viện gồm tấm PIMA trắng, tấm SG/SGT, vân gỗ, vân đá, Duracore,
            tấm ốp Nano và lam sóng. Nhấp vào từng mẫu để xem ảnh lớn, cấu tạo,
            quy cách và ứng dụng đề xuất.
          </p>
        </div>

        <SectionHotline label="Nhận mẫu & thông số vật liệu PIMA" />
        <div className="material-filters" role="tablist" aria-label="Lọc vật liệu PIMA">
          {materialCategories.map((category) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeMaterialCategory === category.key}
              className={activeMaterialCategory === category.key ? "active" : ""}
              key={category.key}
              onClick={() => setActiveMaterialCategory(category.key)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="material-gallery">
          {filteredMaterials.map(({ material, index }) => (
            <article className="material-card" key={material.code}>
              <button
                type="button"
                className="material-card-image"
                aria-label={`Xem chi tiết ${material.name}`}
                onClick={() => setSelectedMaterial(index)}
              >
                <img src={material.image} alt={`${material.name} – mã ${material.code}`} />
                <span className="material-logo-stamp">
                  <img src="/images/pima-logo.png" alt="" aria-hidden="true" />
                </span>
                <span className="material-open">＋ Xem thông số</span>
              </button>
              <div className="material-card-copy">
                <span>{String(index + 1).padStart(2, "0")} / {material.categoryLabel}</span>
                <h3>{material.name}</h3>
                <p>{material.code} · {material.size} · {material.thickness}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="material-disclaimer">
          Thông số trên trang dùng để định hướng lựa chọn. Quy cách chính thức được
          xác nhận theo mẫu vật liệu, catalogue và phiếu sản xuất của từng đơn hàng.
        </p>
      </section>

      <section className="finish-showcase section" id="be-mat-hoan-thien">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Finish showcase</p>
            <h2>Chạm để đổi ngôn ngữ bề mặt.</h2>
          </div>
          <p>
            Ba nhóm hoàn thiện tiêu biểu được trình bày theo tab. Chọn một bề mặt
            để phối cảnh, bảng màu và đặc tính thay đổi tức thời.
          </p>
        </div>
        <SectionHotline label="Tư vấn phối bề mặt theo phong cách nội thất" />
        <div className="finish-tabs" role="tablist" aria-label="Chọn bề mặt hoàn thiện">
          {(Object.keys(finishShowcases) as FinishKey[]).map((key) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeFinish === key}
              className={activeFinish === key ? "active" : ""}
              key={key}
              onClick={() => setActiveFinish(key)}
            >
              <span>{finishShowcases[key].label}</span>
              <small>{finishShowcases[key].short}</small>
            </button>
          ))}
        </div>
        <div className="finish-stage" role="tabpanel">
          <div className="finish-image-wrap">
            <img
              key={activeFinish}
              src={finishShowcases[activeFinish].image}
              alt={`Phối cảnh tủ bếp PIMA bề mặt ${finishShowcases[activeFinish].label}`}
            />
            <span>Phối cảnh minh họa · PIMA Kitchen</span>
          </div>
          <div className="finish-copy">
            <p className="section-kicker">{finishShowcases[activeFinish].label}</p>
            <h3>{finishShowcases[activeFinish].short}</h3>
            <div className="finish-palette">
              <span>Bảng màu gợi ý</span>
              <strong>{finishShowcases[activeFinish].palette}</strong>
            </div>
            <ul>
              {finishShowcases[activeFinish].features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>
            <a className="button button-orange" href="#dang-ky">
              Nhận mẫu bề mặt <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="collection section" id="bo-suu-tap">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Kitchen collection 2026</p>
            <h2>Không gian có chiều sâu.</h2>
          </div>
          <p>Ba ngôn ngữ vật liệu được phát triển cho căn hộ, nhà phố và biệt thự hiện đại.</p>
        </div>
        <SectionHotline label="Chọn mẫu bếp và nhận tư vấn thiết kế" />
        <div className="gallery">
          <article className="gallery-large">
            <img
              src={visualMode === "light" ? "/images/collection-light.png" : "/images/collection-walnut.png"}
              alt={visualMode === "light" ? "Bếp chữ L trắng kem và gỗ sồi sáng" : "Bếp chữ L màu gỗ óc chó và đen"}
            />
            <div>
              <span>{visualMode === "light" ? "01 / Daylight Oak" : "01 / Nocturne Walnut"}</span>
              <b>{visualMode === "light" ? "Thanh lịch · Thoáng sáng" : "Ấm áp · Trầm tĩnh"}</b>
            </div>
          </article>
          <article>
            <img
              src={visualMode === "light" ? "/images/detail-light.png" : "/images/detail-island.png"}
              alt={visualMode === "light" ? "Chi tiết đảo bếp màu kem và gỗ sáng" : "Chi tiết đảo bếp đen phay sọc"}
            />
            <div>
              <span>{visualMode === "light" ? "02 / Ivory Line" : "02 / Obsidian Line"}</span>
              <b>{visualMode === "light" ? "Tinh gọn · Tự nhiên" : "Mạnh mẽ · Kiến trúc"}</b>
            </div>
          </article>
          <article className="gallery-panel">
            <p>Thiết kế riêng theo mặt bằng, thói quen sử dụng và ngân sách của từng gia đình.</p>
            <a href="#dang-ky">Bắt đầu dự án <span>↗</span></a>
          </article>
        </div>
      </section>

      <section className="social-proof section" id="phan-hoi">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Góc nhìn sau bàn giao</p>
            <h2>Đẹp trong phối cảnh.<br />Tiện trong sử dụng.</h2>
          </div>
          <p>
            Các nội dung dưới đây tổng hợp những tiêu chí khách hàng và kiến trúc
            sư thường đánh giá sau khi đưa căn bếp vào sử dụng.
          </p>
        </div>
        <SectionHotline label="Đặt lịch khảo sát cùng đội ngũ PIMA" />
        <div className="feedback-grid">
          <article>
            <img src="/images/collection-light.png" alt="Không gian tủ bếp sáng sau hoàn thiện" />
            <div>
              <span>Gia chủ nhà phố · Phản hồi tổng hợp</span>
              <blockquote>
                “Khoang chậu rửa dễ vệ sinh, không còn cảm giác lo lắng mỗi khi
                có nước đọng trong quá trình sử dụng.”
              </blockquote>
            </div>
          </article>
          <article>
            <img src="/images/collection-walnut.png" alt="Không gian tủ bếp gỗ tối sau hoàn thiện" />
            <div>
              <span>Kiến trúc sư nội thất · Phản hồi tổng hợp</span>
              <blockquote>
                “Hệ bề mặt đa dạng giúp giữ được ngôn ngữ thiết kế mà vẫn ưu tiên
                cốt tủ phù hợp điều kiện nóng ẩm.”
              </blockquote>
            </div>
          </article>
          <article>
            <img src="/images/detail-light.png" alt="Chi tiết đảo bếp PIMA hoàn thiện" />
            <div>
              <span>Đơn vị thi công · Phản hồi tổng hợp</span>
              <blockquote>
                “Cấu hình rõ theo từng khoang giúp kiểm soát vật liệu, phụ kiện và
                tiến độ lắp đặt thuận lợi hơn.”
              </blockquote>
            </div>
          </article>
        </div>
        <p className="technical-note">
          Ảnh và trích dẫn đang dùng để minh họa cách trình bày social proof.
          Khi có hồ sơ bàn giao đã được khách hàng đồng ý, PIMA nên thay bằng ảnh,
          tên dự án và phản hồi đã xác minh.
        </p>
      </section>

      <section className="process section" id="quy-trinh">
        <div className="process-lead">
          <p className="section-kicker">Từ ý tưởng đến căn bếp hoàn thiện</p>
          <h2>Một quy trình.<br />Bốn điểm kiểm soát.</h2>
          <SectionHotline label="Đặt lịch khảo sát" />
        </div>
        <ol className="process-list">
          <li><span>01</span><div><h3>Khảo sát</h3><p>Đo hiện trạng, ghi nhận nhu cầu, thiết bị và phong cách.</p></div></li>
          <li><span>02</span><div><h3>Thiết kế</h3><p>Tối ưu công năng, phối màu và duyệt cấu hình vật liệu.</p></div></li>
          <li><span>03</span><div><h3>Sản xuất</h3><p>Gia công theo bản vẽ đã duyệt và kiểm tra trước xuất xưởng.</p></div></li>
          <li><span>04</span><div><h3>Lắp đặt</h3><p>Hoàn thiện tại công trình, nghiệm thu và hướng dẫn sử dụng.</p></div></li>
        </ol>
      </section>

      <section className="calculator section" id="du-toan">
        <div className="calculator-intro">
          <p className="section-kicker">Dự toán nhanh</p>
          <h2>Ước tính ngân sách trong 30 giây.</h2>
          <p>
            Kết quả gồm bộ tủ trên, tủ dưới, mặt đá, kính bếp và VAT; chưa gồm
            thiết bị, phụ kiện chức năng, vận chuyển và điều kiện thi công đặc biệt.
          </p>
          <SectionHotline label="Cần kiểm tra dự toán?" />
        </div>
        <div className="calculator-card">
          <div className="calc-field">
            <label>Cấu hình</label>
            <div className="segmented">
              {(Object.keys(packages) as PackageKey[]).map((key) => (
                <button
                  type="button"
                  key={key}
                  className={selected === key ? "active" : ""}
                  onClick={() => setSelected(key)}
                >
                  {packages[key].name}
                </button>
              ))}
            </div>
          </div>
          <div className="calc-field">
            <div className="range-label">
              <label htmlFor="length">Chiều dài bếp</label>
              <strong>{length.toFixed(1).replace(".", ",")} m</strong>
            </div>
            <input
              id="length"
              type="range"
              min="2"
              max="8"
              step="0.5"
              value={length}
              onChange={(event) => setLength(Number(event.target.value))}
            />
            <div className="range-scale"><span>2 m</span><span>8 m</span></div>
          </div>
          <div className="estimate">
            <span>Ngân sách dự kiến</span>
            <strong>{formatPrice(estimate)}</strong>
            <small>Giá ước lượng, không phải báo giá chính thức.</small>
          </div>
          <a className="button button-gold" href="#dang-ky">Nhận báo giá chi tiết <span>↗</span></a>
        </div>
      </section>

      <section className="contact section" id="dang-ky">
        <div className="contact-copy">
          <p className="section-kicker">Bắt đầu căn bếp của bạn</p>
          <h2>Đăng ký khảo sát<br />và tư vấn vật liệu.</h2>
          <p>
            Để lại thông tin và nhu cầu sơ bộ. Đội ngũ PIMA sẽ liên hệ để xác
            nhận phạm vi, thời gian khảo sát và cấu hình phù hợp.
          </p>
          <div className="contact-promise">
            <span>✓</span> Tư vấn cấu hình theo ngân sách
            <span>✓</span> Dự toán minh bạch theo hạng mục
            <span>✓</span> Thiết kế bám sát mặt bằng thực tế
          </div>
          <SectionHotline label="Liên hệ trực tiếp, không cần chờ form" />
        </div>
        {submitted ? (
          <div className="success-message" role="status">
            <span>✓</span>
            <h3>Đã ghi nhận yêu cầu.</h3>
            <p>Đây là bản demo giao diện. Form sẽ được kết nối hệ thống nhận khách hàng ở bước triển khai chính thức.</p>
            <button type="button" onClick={() => setSubmitted(false)}>Gửi yêu cầu khác</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Họ và tên<input required name="name" placeholder="Nguyễn Văn A" /></label>
              <label>Số điện thoại<input required name="phone" inputMode="tel" placeholder="09xx xxx xxx" /></label>
            </div>
            <label>Khu vực công trình<input required name="location" placeholder="Quận / huyện, tỉnh / thành phố" /></label>
            <div className="form-row">
              <label>Kiểu bếp
                <select name="layout" defaultValue="Bếp chữ L">
                  <option>Bếp chữ I</option>
                  <option>Bếp chữ L</option>
                  <option>Bếp chữ U</option>
                  <option>Bếp kịch trần</option>
                </select>
              </label>
              <label>Ngân sách dự kiến
                <select name="budget" defaultValue="30–50 triệu">
                  <option>Dưới 30 triệu</option>
                  <option>30–50 triệu</option>
                  <option>50–80 triệu</option>
                  <option>Trên 80 triệu</option>
                </select>
              </label>
            </div>
            <label>Nhu cầu của bạn<textarea name="message" rows={3} placeholder="Kích thước sơ bộ, phong cách, thời gian mong muốn..." /></label>
            <button className="button button-gold" type="submit">Gửi yêu cầu tư vấn <span>↗</span></button>
            <small>Thông tin chỉ được dùng để liên hệ tư vấn sản phẩm PIMA.</small>
          </form>
        )}
      </section>

      <footer className="site-footer">
        <section className="footer-certifications" aria-labelledby="footer-certifications-title">
          <div className="footer-certifications-heading">
            <div>
              <p className="section-kicker">Chất lượng được kiểm chứng</p>
              <h2 id="footer-certifications-title">07 chứng chỉ & hồ sơ kiểm nghiệm PIMA</h2>
            </div>
            <a
              href="https://pima.com.vn/chung-nhan-chat-luong-san-pham/"
              target="_blank"
              rel="noreferrer"
            >
              Xem hồ sơ chứng nhận <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="footer-certificate-grid">
            {footerQualityRecords.map((record, index) => (
              <article key={record.title}>
                <div className="certificate-seal" aria-hidden="true">
                  <span>{record.mark}</span>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                </div>
                <div>
                  <strong>{record.title}</strong>
                  <p>{record.detail}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="footer-certification-note">
            Chứng nhận và kết quả thử nghiệm áp dụng theo mã sản phẩm, mẫu thử,
            lô hàng và phạm vi thể hiện trong từng hồ sơ.
          </p>
        </section>

        <div className="footer-main">
          <a className="brand-logo brand-logo-footer" href="#top">
            <img src="/images/pima-logo.png" alt="Logo chính thức PIMA" />
          </a>
          <p>Vật liệu nội thất xanh · Sản xuất trực tiếp tại Việt Nam</p>
          <nav className="footer-nav" aria-label="Điều hướng chân trang">
            <a href="#san-pham">Sản phẩm</a>
            <a href="#vat-lieu">Vật liệu</a>
            <a href="#dang-ky">Liên hệ</a>
          </nav>
        </div>
        <span className="footer-copyright">© 2026 PIMA. All rights reserved.</span>
      </footer>

      {selectedModel && selectedModelDetail && (
        <div
          className="model-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedModel(null);
          }}
        >
          <section
            className="model-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="model-modal-title"
          >
            <button
              className="model-modal-close"
              type="button"
              aria-label="Đóng cửa sổ thông tin mẫu"
              autoFocus
              onClick={() => setSelectedModel(null)}
            >
              ×
            </button>

            <div className="model-modal-visual">
              <div
                className="model-modal-image"
                role="img"
                aria-label={`Ảnh lớn mẫu ${selectedModelDetail.model}`}
                style={getModelVisualStyle(
                  selectedModel.layout,
                  selectedModel.index,
                  visualMode,
                )}
              />
              <div className="model-modal-navigation">
                <button type="button" onClick={() => changeModalModel(-1)} aria-label="Xem mẫu trước">←</button>
                <span>
                  {String(selectedModel.index + 1).padStart(2, "0")} / {selectedModelDetail.layout.models.length}
                </span>
                <button type="button" onClick={() => changeModalModel(1)} aria-label="Xem mẫu tiếp theo">→</button>
              </div>
            </div>

            <div className="model-modal-content">
              <p className="section-kicker">
                PIMA {selectedModelDetail.layout.name} · Mẫu {String(selectedModel.index + 1).padStart(2, "0")}
              </p>
              <h2 id="model-modal-title">{selectedModelDetail.model}</h2>
              <p className="model-modal-lead">
                {selectedModelDetail.specifications.planningNote}
              </p>

              <div className="model-specs" aria-label="Thông số chi tiết">
                <div><span>Phong cách</span><strong>{selectedModelDetail.finish.style}</strong></div>
                <div><span>Tông màu</span><strong>{selectedModelDetail.finish.palette}</strong></div>
                <div><span>Diện tích phù hợp</span><strong>{selectedModelDetail.specifications.recommendedSpace}</strong></div>
                <div><span>Chiều dài đề xuất</span><strong>{selectedModelDetail.specifications.recommendedLength}</strong></div>
                <div><span>Cốt thùng tủ</span><strong>Ván nhựa PVC Foam PIMA 17–18 mm</strong></div>
                <div><span>Hậu tủ</span><strong>Ván nhựa PIMA 5–8 mm</strong></div>
                <div><span>Bề mặt cánh</span><strong>{selectedModelDetail.finish.front}</strong></div>
                <div><span>Mặt bàn</span><strong>{selectedModelDetail.finish.worktop}</strong></div>
                <div><span>Kích thước bố trí</span><strong>{selectedModelDetail.specifications.cabinetDimensions}</strong></div>
                <div><span>Phụ kiện cơ bản</span><strong>Bản lề và ray giảm chấn đồng bộ</strong></div>
              </div>

              <p className="model-modal-note">
                Thông số trên là cấu hình định hướng. Kích thước, vật liệu và phụ kiện
                chính thức được xác nhận sau khi khảo sát mặt bằng và duyệt mẫu.
              </p>
              <a
                className="button button-gold model-modal-cta"
                href="#dang-ky"
                onClick={() => setSelectedModel(null)}
              >
                Nhận tư vấn mẫu này <span>↗</span>
              </a>
            </div>
          </section>
        </div>
      )}

      {selectedMaterial !== null && (
        <div
          className="model-modal-backdrop material-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedMaterial(null);
          }}
        >
          <section
            className="model-modal material-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="material-modal-title"
          >
            <button
              className="model-modal-close"
              type="button"
              aria-label="Đóng thông tin vật liệu"
              autoFocus
              onClick={() => setSelectedMaterial(null)}
            >
              ×
            </button>
            <div className="material-modal-visual">
              <img
                src={pimaMaterials[selectedMaterial].image}
                alt={`Ảnh lớn ${pimaMaterials[selectedMaterial].name}`}
              />
              <div className="material-modal-brand">
                <img src="/images/pima-logo.png" alt="PIMA" />
              </div>
              <div className="model-modal-navigation">
                <button
                  type="button"
                  aria-label="Vật liệu trước"
                  onClick={() =>
                    setSelectedMaterial(
                      (selectedMaterial - 1 + pimaMaterials.length) % pimaMaterials.length
                    )
                  }
                >
                  ←
                </button>
                <span>{String(selectedMaterial + 1).padStart(2, "0")} / 15</span>
                <button
                  type="button"
                  aria-label="Vật liệu tiếp theo"
                  onClick={() => setSelectedMaterial((selectedMaterial + 1) % pimaMaterials.length)}
                >
                  →
                </button>
              </div>
            </div>
            <div className="model-modal-content">
              <p className="section-kicker">
                {pimaMaterials[selectedMaterial].categoryLabel} · {pimaMaterials[selectedMaterial].code}
              </p>
              <h2 id="material-modal-title">{pimaMaterials[selectedMaterial].name}</h2>
              <p className="model-modal-lead">
                Cấu hình vật liệu PIMA tiêu biểu cho nội thất và hoàn thiện không gian.
              </p>
              <div className="model-specs" aria-label="Thông số vật liệu">
                <div><span>Mã sản phẩm</span><strong>{pimaMaterials[selectedMaterial].code}</strong></div>
                <div><span>Quy cách</span><strong>{pimaMaterials[selectedMaterial].size}</strong></div>
                <div><span>Độ dày</span><strong>{pimaMaterials[selectedMaterial].thickness}</strong></div>
                <div><span>Cấu tạo</span><strong>{pimaMaterials[selectedMaterial].structure}</strong></div>
                <div><span>Bề mặt</span><strong>{pimaMaterials[selectedMaterial].surface}</strong></div>
                <div><span>Tỷ trọng / đóng gói</span><strong>{pimaMaterials[selectedMaterial].density}</strong></div>
                <div><span>Ứng dụng</span><strong>{pimaMaterials[selectedMaterial].application}</strong></div>
                <div><span>Lưu ý kỹ thuật</span><strong>{pimaMaterials[selectedMaterial].note}</strong></div>
              </div>
              <a
                className="button button-gold model-modal-cta"
                href="#dang-ky"
                onClick={() => setSelectedMaterial(null)}
              >
                Nhận mẫu & tư vấn vật liệu <span>↗</span>
              </a>
            </div>
          </section>
        </div>
      )}

      <div className="desktop-contact-float" aria-label="Liên hệ nhanh PIMA">
        <a href="tel:0902999304">
          <span aria-hidden="true">☎</span>
          <small>Hotline</small>
          <strong>0902.999.304</strong>
        </a>
        <a href="https://zalo.me/0902999304" target="_blank" rel="noreferrer">
          <span aria-hidden="true">Z</span>
          <small>Zalo</small>
          <strong>0902.999.304</strong>
        </a>
      </div>

      <div className="mobile-sticky-bar" aria-label="Liên hệ nhanh">
        <a href="tel:0902999304">
          <span aria-hidden="true">☎</span>
          <strong>Gọi Hotline</strong>
          <small>0902.999.304</small>
        </a>
        <a href="https://zalo.me/0902999304" target="_blank" rel="noreferrer">
          <span aria-hidden="true">Z</span>
          <strong>Nhận Báo Giá Zalo</strong>
          <small>0902.999.304</small>
        </a>
      </div>
    </main>
  );
}
