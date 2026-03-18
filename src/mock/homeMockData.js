const images = import.meta.glob("../assets/img/*.{png,jpg,jpeg,gif}", {
    eager: true,
    import: "default"
});

export const mockBanners = {
    // Banner chính 
    main: [
        images['../assets/img/banner1.png'],
        images['../assets/img/banner2.png'],
        images['../assets/img/banner6.png']
    ],

    // Banner phụ
    sub1: images['../assets/img/banner3.png'],
    sub2: images['../assets/img/banner4.png'],
    sub3: images['../assets/img/banner5.png'],
};

for (const path in images) {
    // Lấy tên file để làm key. 
    // Ví dụ: từ '../assets/img/banner1.png' -> sẽ lấy chữ 'banner1'
    const fileName = path.split('/').pop().split('.')[0];

    // Gán URL của ảnh vào object
    mockBanners[fileName] = images[path];
}

// 2. DỮ LIỆU SẢN PHẨM (Khớp với Schema Computer của BE)
export const mockProducts = [
    {
        _id: "comp_1",
        name: "Bộ PC Gaming i5-12400F, RAM 16GB, RTX 3060 12GB [TẶNG MÀN HÌNH]",
        price: 25000000,
        discountPrice: 21090000, // Có giá giảm -> Cho vào Flash Sale
        image: "https://nguyencongpc.vn/media/product/250-27016-pc-gaming-25251328.jpg",
        categorySlug: "pc-gaming",
        stockQuantity: 0,
        specs: {
            cpu: "Intel Core i5-12400F (6 nhân 12 luồng)",
            main: "Mainboard H610M DDR4",
            ram: "16GB DDR4 3200MHz",
            storage: "500GB NVMe SSD",
            vga: "COLORFUL RTX 3060 12GB Duo",
            psu: "MIK SPOWER C650B 650W Bronze",
            case: "XIGMATEK PANO M NANO 3GF / Vitra Cruise Aurora M5 Black",
            cooling: "Tản nhiệt khí RGB"
        }
    },
    {
        _id: "comp_2",
        name: "Bộ PC Hatsune Miku Ryzen 7 9800X3D, RAM 32GB, VGA RTX 5080 16GB [Tặng Màn Hình]",
        price: 130990000,
        discountPrice: null, // Không giảm giá
        image: "https://nguyencongpc.vn/media/product/250-28119-pc-hatsune-miku-01.jpg",
        categorySlug: "pc-gaming",
        stockQuantity: 6,
        specs: {
            cpu: "AMD Ryzen 7 9800X3D (Up to 5.2GHz, 8 cores, 96MB cache)",
            main: "ASUS ROG STRIX X870E-H GAMING WIFI 7 Hatsune Miku Edition",
            ram: "32GB (2x16GB) DDR5 6000MHz G.Skill Trident Z5 RGB Black",
            storage: "1TB NVMe PCIe Gen4 x4 (Lexar NQ780, 6500MB/s read)",
            vga: "ASUS ROG Astral GeForce RTX 5080 16GB GDDR7 OC Hatsune Miku Edition",
            psu: "ASUS ROG Thor 1200W Platinum III Hatsune Miku Edition",
            case: "ASUS ROG Strix Helios II Hatsune Miku Edition",
            cooling: "ASUS ROG RYUJIN/RYUO IV 360 ARGB Hatsune Miku Edition"
        }
    },
    {
        _id: "comp_3",
        name: "Bộ PC Gaming Intel Core i5-14600KF, Ram 16GB, VGA RTX 5060",
        price: 27900000,
        discountPrice: 28900000,
        image: "https://nguyencongpc.vn/media/product/250-27600-pc-gaming-intel-core-i5-14600kf-ram-16gb-vga-rtx-5060-01.jpg",
        categorySlug: "pc-gaming",
        stockQuantity: 10,
        specs: {
            cpu: "Intel Core i5-14600KF (Up to 5.3GHz, 14 nhân 20 luồng, 24MB cache)",
            main: "ASUS PRIME B760M-A WIFI D4",
            ram: "16GB DDR4 3200MHz (Black)",
            storage: "512GB M.2 NVMe",
            vga: "Colorful GeForce RTX 5060 Gaming DUO 8GB-V",
            psu: "GIGABYTE P650SS 650W (80 Plus Silver)",
            case: "MSI MAG FORGE 130A AIRFLOW",
            cooling: "ID-Cooling FROZN A620 Pro SE"
        }
    },
    {
        _id: "comp_4",
        name: "Bộ PC Gaming AMD Ryzen 5 5500, RAM 16GB, RTX 3050 6GB [TẶNG MÀN HÌNH]",
        price: 17090000,
        discountPrice: null,
        image: "https://nguyencongpc.vn/media/product/250-27719-pc-gaming-amd-ryzen-5-5500-ram-16gb-rtx-3050-6gb-17.jpg",
        categorySlug: "pc-gaming",
        stockQuantity: 9,
        specs: {
            cpu: "AMD Ryzen 5 5500 (3.6GHz up to 4.2GHz, 6 cores, 12 threads, 16MB cache)",
            main: "Colorful BATTLE-AX B450M-T M.2 V14",
            ram: "16GB DDR4 3200MHz",
            storage: "512GB NVMe SSD",
            vga: "NVIDIA GeForce RTX 3050 6GB OC",
            psu: "Segotep SG D600A U5 500W",
            case: "MIK LV12 MINI FLOW Black (2 fan RGB)",
            cooling: "ID-Cooling SE-904-XT ARGB Black"
        },
        _id: "comp_5",
        name: "Bộ PC Gaming AMD Ryzen 5 5500, RAM 16GB, RTX 3050 6GB [TẶNG MÀN HÌNH]",
        price: 80900000,
        discountPrice: null,
        image: "https://nguyencongpc.vn/media/product/250-27719-pc-gaming-amd-ryzen-5-5500-ram-16gb-rtx-3050-6gb-17.jpg",
        categorySlug: "pc-ai",
        stockQuantity: 5,
        specs: {
            cpu: "AMD Ryzen 5 5500 (3.6GHz up to 4.2GHz, 6 cores, 12 threads, 16MB cache)",
            main: "Colorful BATTLE-AX B450M-T M.2 V14",
            ram: "16GB DDR4 3200MHz",
            storage: "512GB NVMe SSD",
            vga: "NVIDIA GeForce RTX 3050 6GB OC",
            psu: "Segotep SG D600A U5 500W",
            case: "MIK LV12 MINI FLOW Black (2 fan RGB)",
            cooling: "ID-Cooling SE-904-XT ARGB Black"
        }
    }
];

// 3. DỮ LIỆU TIN TỨC (Chuẩn bị sẵn cho API)
export const mockNews = [
    {
        id: "news_1",
        title: "Đánh giá chi tiết RTX 4060: Liệu có đáng để nâng cấp?",
        thumbnail: "https://file.hstatic.net/200000722513/article/gearvn-rtx-4060-thumb_f31500ed84714db294e77dd62d3a19b5_large.jpg",
        date: "17/03/2026",
        slug: "danh-gia-chi-tiet-rtx-4060"
    },
    {
        id: "news_2",
        title: "Hướng dẫn tối ưu hóa Windows 11 để chơi game mượt mà nhất",
        thumbnail: "https://file.hstatic.net/200000722513/article/gearvn-toi-uu-win-11-thumb_6b15858004f14a0f8b1eb7ea12586a11_large.jpg",
        date: "15/03/2026",
        slug: "huong-dan-toi-uu-hoa-windows-11"
    },
    {
        id: "news_3",
        title: "Top 5 Laptop Gaming đáng mua nhất đầu năm 2026",
        thumbnail: "https://file.hstatic.net/200000722513/article/gearvn-top-laptop-gaming-2024-thumb_353a261a87794bc29759c2b4c8d57896_large.jpg",
        date: "10/03/2026",
        slug: "top-5-laptop-gaming-dang-mua"
    }
];