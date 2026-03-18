// Danh sách dọc cho nút "DANH MỤC SẢN PHẨM" màu đen (Hình 1)
export const mockMainMenu = [
    { name: "PC GAMING", hasSub: true },
    { name: "PC WORKSTATION 2D 3D", hasSub: true },
    { name: "PC AMD GAMING", hasSub: false },
    { name: "PC MINI", hasSub: false },
    { name: "PC VĂN PHÒNG", hasSub: false },
    { name: "Linh kiện máy tính", hasSub: true },
    { name: "PC GIẢ LẬP ẢO HÓA", hasSub: false },
    { name: "Màn hình máy tính", hasSub: true },
    { name: "Gaming Gear", hasSub: true },
    { name: "Full Bộ PC Kèm Màn Hình", hasSub: false },
    { name: "Loa máy tính", hasSub: false },
    { name: "LAPTOP", hasSub: true },
    { name: "OnSale", hasSub: false },
    { name: "CARD MẠNG KHÔNG DÂY", hasSub: false }
];

// Dữ liệu giả lập chuẩn cấu trúc JSON cho Hàng ngang & Mega Menu (Hình 2)
export const mockCategories = [
    {
        id: 1,
        name: "PC GAMING",
        slug: "pc-gaming",
        iconName: "Gamepad2",
        subMenu: [
            {
                title: "PC GAMING",
                items: ["CHỌN THEO NHU CẦU", "CHỌN THEO KHOẢNG GIÁ"]
            },
            {
                title: "PC ĐỒ HOẠ - LÀM VIỆC",
                items: ["Server - Máy ảo hóa", "Máy Tính Đồng Bộ", "Máy Tính Đồ Họa", "Build PC Custom"]
            },
            {
                title: "PC AI - TRÍ TUỆ NHÂN TẠO",
                items: ["PC AI Deep Learning", "PC AI Machine Learning"]
            },
            {
                title: "PC VĂN PHÒNG GIÁ RẺ",
                items: ["PC Kế toán", "PC Lễ tân"]
            }
        ]
    },
    {
        id: 2,
        name: "PC WORKSTATION",
        slug: "pc-workstation",
        iconName: "MonitorPlay",
        subMenu: [
            {
                title: "PC WORKSTATION",
                items: ["Workstation Intel", "Workstation AMD", "Máy chủ Server"]
            }
        ]
    },
    {
        id: 3,
        name: "PC AMD GAMING",
        slug: "pc-amd-gaming",
        iconName: "Cpu",
        subMenu: [
            {
                title: "PC WORKSTATION",
                items: ["Workstation Intel", "Workstation AMD", "Máy chủ Server"]
            }
        ]
    },
    {
        id: 4,
        name: "PC MINI",
        slug: "pc-mini",
        iconName: "Laptop",
        subMenu: [
            {
                title: "PC WORKSTATION",
                items: ["Workstation Intel", "Workstation AMD", "Máy chủ Server"]
            }
        ]
    },
    {
        id: 5,
        name: "PC VĂN PHÒNG",
        slug: "pc-van-phong",
        iconName: "Monitor",
        subMenu: [
            {
                title: "PC WORKSTATION",
                items: ["Workstation Intel", "Workstation AMD", "Máy chủ Server"]
            }
        ]
    }
];

// Danh sách dọc cho nút "Tất cả danh mục" trên thanh tìm kiếm
export const mockVerticalMenu = [
    "LAPTOP", "PC GAMING", "PC ĐỒ HOẠ - LÀM VIỆC", "PC AI - TRÍ TUỆ NHÂN TẠO",
    "PC NC", "PC VĂN PHÒNG GIÁ RẺ", "LINH KIỆN MÁY TÍNH", "MÀN HÌNH MÁY TÍNH"
];