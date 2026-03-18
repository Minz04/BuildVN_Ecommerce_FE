// Màn chính
//ĐĂNG KÝ X
// _id: 69b229645a3da422fcd5a15b
// username: "Trịnh Nguyễn Bảo Nguyên"
// password: "$2b$10$yVWBFxHnQ2E/mBY3Ob1rnOumonigrVgW.wfvbMl.Z803bAAxBOsiy"
// email: "bonvipro123z@gmail.com"
// fullname: "Trịnh Nguyễn Bảo Nguyên"
// phone: "0853772210"
// address: "Ngã Tư Cây Sung, Đường Nguyễn Thái Học, khu Phố 4, phường Trảng Dài"

//Thông tin người dùng
// {
//     "user": {
//         "_id": "69b229645a3da422fcd5a15b",
//         "username": "Trịnh Nguyễn Bảo Nguyên",
//         "email": "bonvipro123z@gmail.com",
//         "fullname": "Trịnh Nguyễn Bảo Nguyên",
//         "phone": "0853772210",
//         "address": "Ngã Tư Cây Sung, Đường Nguyễn Thái Học, khu Phố 4, phường Trảng Dài, thành phố Biên Hòa, Đồng Nai",
//         "role": {
//             "_id": "69b126b30ee0f029ccf08c8f",
//             "name": "user"
//         },
//         "createdAt": "2026-03-12T02:48:04.330Z",
//         "updatedAt": "2026-03-12T02:48:04.330Z",
//         "__v": 0
//     }
// }

// Giỏ hàng 
//http://localhost:3000/api/cart/ GET
// {
//     "cartItem": [
//         {
//             "_id": "69b2e5719eb4ed07fdc7b33b",
//             "quantity": 2,
//             "user": "69b229645a3da422fcd5a15b",
//             "computer": {
//                 "_id": "69b1040bcfd4bdcab5396096",
//                 "name": "PC TTG GAMING i5 14600KF - RTX 5080 16GB (ALL NEW - Bảo hành 36 tháng) (Nâng cấp lên RAM 32GB DDR5_1 - SSD 500GB - Tản nhiệt khí)",
//                 "price": 60680000,
//                 "image": "1773208587574-Gaming.jpg",
//                 "slug": "pc-ttg-gaming-i5-14600kf-rtx-5080-16gb-all-new-bao-hanh-36-thang-nang-cap-len-ram-32gb-ddr5_1-ssd-500gb-tan-nhiet-khi"
//             },
//             "createdAt": "2026-03-12T16:10:25.126Z",
//             "updatedAt": "2026-03-12T16:13:24.809Z",
//             "__v": 0,

// Tổng tiền của 1 sản phẩm 
//             "totalPrice": 121360000
//         },
//         {
//             "_id": "69b2e57a9eb4ed07fdc7b340",
//             "quantity": 1,
//             "user": "69b229645a3da422fcd5a15b",
//             "computer": {
//                 "_id": "69b104b2cfd4bdcab539609a",
//                 "name": "PC TTG GAMING i5 14600KF - RTX 5080 16GB (ALL NEW - Bảo hành 36 tháng) (Nâng cấp lên RAM 32GB DDR5_1 - SSD 500GB - Tản nhiệt khí)",
//                 "price": 60680000,
//                 "image": "1773208754596-gaming 2.jpg",
//                 "slug": "pc-ttg-gaming-i5-14600kf-rtx-5080-16gb-all-new-bao-hanh-36-thang-nang-cap-len-ram-32gb-ddr5_1-ssd-500gb-tan-nhiet-khi-hCJZooVM4"
//             },
//             "createdAt": "2026-03-12T16:10:34.157Z",
//             "updatedAt": "2026-03-12T16:10:34.157Z",
//             "__v": 0,
//tổng tiền của 1 sản phẩm 
//             "totalPrice": 60680000
//         }
//     ],
//tổng tiền tất cả sản phẩm 
//     "total": 182040000
// }

//mua hàng 
//http://localhost:3000/api/orders/create
// {
//     "message": "Đơn hàng đã được tạo thành công",
//     "orderId": "69b401da7f419526f6bdb787"
// }
//lấy đơn hàng của tôi
// {
//     "orders": [
//         {
//             "_id": "69b401da7f419526f6bdb787",
//             "totalAmount": 182040000,
//             "status": "PENDING",
//             "shippingAddress": "thành phố Biên Hòa, Đồng Nai",
//             "phone": "0853772210",
//             "user": {
//                 "_id": "69b229645a3da422fcd5a15b",
//                 "email": "bonvipro123z@gmail.com",
//                 "fullname": "Trịnh Nguyễn Bảo Nguyên"
//             },
//             "orderDate": "2026-03-13T12:23:54.207Z",
//             "createdAt": "2026-03-13T12:23:54.214Z",
//             "updatedAt": "2026-03-13T12:23:54.214Z",
//             "__v": 0
//         }
//     ]
// }


//chi tiết đơn hàng http://localhost:3000/api/orders/:orderId/detail
// {
//     "order": {
//         "_id": "69b401da7f419526f6bdb787",
//         "totalAmount": 182040000,
//         "status": "PENDING",
//         "shippingAddress": "thành phố Biên Hòa, Đồng Nai",
//         "phone": "0853772210",
//         "user": {
//             "_id": "69b229645a3da422fcd5a15b",
//             "email": "bonvipro123z@gmail.com",
//             "fullname": "Trịnh Nguyễn Bảo Nguyên"
//         },
//         "orderDate": "2026-03-13T12:23:54.207Z",
//         "createdAt": "2026-03-13T12:23:54.214Z",
//         "updatedAt": "2026-03-13T12:23:54.214Z",
//         "__v": 0
//     },
//     "orderItem": [
//         {
//             "_id": "69b401da7f419526f6bdb789",
//             "quantity": 2,
//             "price": 60680000,
//             "image": "1773208587574-Gaming.jpg",
//             "order": "69b401da7f419526f6bdb787",
//             "computer": {
//                 "_id": "69b1040bcfd4bdcab5396096",
//                 "name": "PC TTG GAMING i5 14600KF - RTX 5080 16GB (ALL NEW - Bảo hành 36 tháng) (Nâng cấp lên RAM 32GB DDR5_1 - SSD 500GB - Tản nhiệt khí)",
//                 "price": 60680000,
//                 "image": "1773208587574-Gaming.jpg",
//                 "slug": "pc-ttg-gaming-i5-14600kf-rtx-5080-16gb-all-new-bao-hanh-36-thang-nang-cap-len-ram-32gb-ddr5_1-ssd-500gb-tan-nhiet-khi"
//             },
//             "__v": 0
//         },
//         {
//             "_id": "69b401da7f419526f6bdb78a",
//             "quantity": 1,
//             "price": 60680000,
//             "image": "1773208754596-gaming 2.jpg",
//             "order": "69b401da7f419526f6bdb787",
//             "computer": {
//                 "_id": "69b104b2cfd4bdcab539609a",
//                 "name": "PC TTG GAMING i5 14600KF - RTX 5080 16GB (ALL NEW - Bảo hành 36 tháng) (Nâng cấp lên RAM 32GB DDR5_1 - SSD 500GB - Tản nhiệt khí)",
//                 "price": 60680000,
//                 "image": "1773208754596-gaming 2.jpg",
//                 "slug": "pc-ttg-gaming-i5-14600kf-rtx-5080-16gb-all-new-bao-hanh-36-thang-nang-cap-len-ram-32gb-ddr5_1-ssd-500gb-tan-nhiet-khi-hCJZooVM4"
//             },
//             "__v": 0
//         }
//     ]
// }
//lấy tất cả đơn hàng cho admin http://localhost:3000/api/orders/all
// {
//     "orders": [
//         {
//             "_id": "69b401da7f419526f6bdb787",
//             "totalAmount": 182040000,
//             "status": "PENDING",
//             "shippingAddress": "thành phố Biên Hòa, Đồng Nai",
//             "phone": "0853772210",
//             "user": {
//                 "_id": "69b229645a3da422fcd5a15b",
//                 "email": "bonvipro123z@gmail.com",
//                 "fullname": "Trịnh Nguyễn Bảo Nguyên"
//             },
//             "orderDate": "2026-03-13T12:23:54.207Z",
//             "createdAt": "2026-03-13T12:23:54.214Z",
//             "updatedAt": "2026-03-13T12:23:54.214Z",
//             "__v": 0
//         }
//     ]
//}


//{Cập nhật đơn hàng http://localhost:3000/api/orders/69b401da7f419526f6bdb787/status
//     "message": "Trạng thái đơn hàng đã được cập nhật",
//     "order": {
//         "_id": "69b401da7f419526f6bdb787",
//         "totalAmount": 182040000,
//         "status": "CONFIRMED",
//         "shippingAddress": "thành phố Biên Hòa, Đồng Nai",
//         "phone": "0853772210",
//         "user": {
//             "_id": "69b229645a3da422fcd5a15b",
//             "email": "bonvipro123z@gmail.com",
//             "fullname": "Trịnh Nguyễn Bảo Nguyên",
//             "phone": "0853772210"
//         },
//         "orderDate": "2026-03-13T12:23:54.207Z",
//         "createdAt": "2026-03-13T12:23:54.214Z",
//         "updatedAt": "2026-03-13T12:58:47.117Z",
//         "__v": 0
//     }
// }

//thống kê 
// {
    //tổng số đơn hàng 
//     "totalOrder": 1,
//tổng doanh thu
//     "totalRevenue": 182040000,
//     "ordersByStatus": [
//         {
//             "_id": "DELIVERED",
//đơn hàng đã giao 1
//             "count": 1
//         }
//     ]
// }

//đơn hàng đã giao, đã hủy , thay status bằng cái khác là đc .... http://localhost:3000/api/orders/my-orders?status=DELIVERED
// {
//     "orders": [
//         {
//             "_id": "69b401da7f419526f6bdb787",
//             "totalAmount": 182040000,
//             "status": "DELIVERED",
//             "shippingAddress": "thành phố Biên Hòa, Đồng Nai",
//             "phone": "0853772210",
//             "user": {
//                 "_id": "69b229645a3da422fcd5a15b",
//                 "email": "bonvipro123z@gmail.com",
//                 "fullname": "Trịnh Nguyễn Bảo Nguyên"
//             },
//             "orderDate": "2026-03-13T12:23:54.207Z",
//             "createdAt": "2026-03-13T12:23:54.214Z",
//             "updatedAt": "2026-03-13T12:59:58.766Z",
//             "__v": 0
//         }
//     ]
//}


//get computer http://localhost:3000/api/computers
// [
//     {
//         "_id": "69b1040bcfd4bdcab5396096",
//         "name": "PC TTG GAMING i5 14600KF - RTX 5080 16GB (ALL NEW - Bảo hành 36 tháng) (Nâng cấp lên RAM 32GB DDR5_1 - SSD 500GB - Tản nhiệt khí)",
//         "price": 60680000,
//         "image": "1773208587574-Gaming.jpg",
//         "description": "CPU Intel Core i5-14600KF (Up to 5.3Ghz, 14 NHÂN 20 LUỒNG, 24MB CACHE) TRAY\nMainboard MSI B760M GAMING WIFI PLUS DDR5\nRAM APACER NOX 32GB (2x16GB) DDR5 Bus 5200Mhz – Black\nỔ cứng SSD HIKSEMI WAVE 512GB M.2 2280 PCIe 3.0x4\nNguồn FSP VITA 850GM - 850W PPA8504205 GOLD/DÂY RỜI/EU/ĐEN\nCard màn hình PNY GeForce RTX 5080 OC 16GB 16GB GDDR7\nVỏ Case AIGO C218M BLACK - KÈM 4 FAN ARGB BLACK\nTản nhiệt khí Thermalright Peerless Assassin 120 SE ARGB BLACK",
//         "stockQuantity": 5,
//         "category": {
//             "_id": "69af030a98e481a58bbe09b8",
//             "name": "PC Gaming",
//             "description": "Máy tính cấu hình cao được thiết kế để chơi game, xử lý đồ họa mạnh và mang lại trải nghiệm game mượt mà.",
//             "slug": "pc-gaming"
//         },
//         "deleted": false,
//         "slug": "pc-ttg-gaming-i5-14600kf-rtx-5080-16gb-all-new-bao-hanh-36-thang-nang-cap-len-ram-32gb-ddr5_1-ssd-500gb-tan-nhiet-khi",
//         "__v": 0
//     },
//     {
//         "_id": "69b104b2cfd4bdcab539609a",
//         "name": "PC TTG GAMING i5 14600KF - RTX 5080 16GB (ALL NEW - Bảo hành 36 tháng) (Nâng cấp lên RAM 32GB DDR5_1 - SSD 500GB - Tản nhiệt khí)",
//         "price": 60680000,
//         "image": "1773208754596-gaming 2.jpg",
//         "description": "\nCPU Intel Core i5-14600KF (Up to 5.3Ghz, 14 NHÂN 20 LUỒNG, 24MB CACHE) TRAY\nMainboard MSI B760M GAMING WIFI PLUS DDR5\nRAM APACER NOX 32GB (2x16GB) DDR5 Bus 5200Mhz – Black\nỔ cứng SSD HIKSEMI WAVE 512GB M.2 2280 PCIe 3.0x4\nNguồn FSP VITA 850GM - 850W PPA8504205 GOLD/DÂY RỜI/EU/ĐEN\nCard màn hình PNY GeForce RTX 5080 OC 16GB 16GB GDDR7\nVỏ Case AIGO C218M BLACK - KÈM 4 FAN ARGB BLACK\nTản nhiệt khí Thermalright Peerless Assassin 120 SE ARGB BLACK",
//         "stockQuantity": 5,
//         "category": {
//             "_id": "69af030a98e481a58bbe09b8",
//             "name": "PC Gaming",
//             "description": "Máy tính cấu hình cao được thiết kế để chơi game, xử lý đồ họa mạnh và mang lại trải nghiệm game mượt mà.",
//             "slug": "pc-gaming"
//         },
//         "deleted": false,
//         "slug": "pc-ttg-gaming-i5-14600kf-rtx-5080-16gb-all-new-bao-hanh-36-thang-nang-cap-len-ram-32gb-ddr5_1-ssd-500gb-tan-nhiet-khi-hCJZooVM4",
//         "__v": 0
//     },
//     {
//         "_id": "69b10638cfd4bdcab53960a4",
//         "name": "PC TTG HOME OFFICE Ryzen 5 5500GT- RAM 8GB- SSD 256GB",
//         "price": 9280000,
//         "image": "1773209144274-office.jpg",
//         "description": "CPU AMD Ryzen 5 5500GT (AMD AM4 - 6 Core - 12 Thread - Base 3.6Ghz - Turbo 4.4Ghz - Cache 19MB)\nMainboard Colorful BATTLE-AX B450M-T M.2 V14\nRam SSTC 8GB Bus 3200Mhz DDR4 BLACK TẢN NHIỆT\nSSD VSP 256GB (ĐỌC 560MB/S GHI 470MB/S) SATA III 2.5 INCH (VSP-256GB-860G)\nNguồn máy tính SSTC 550F 550W\nVỎ CASE AIGO Q15 MATX USB 3.0\nBộ bàn phím + Chuột Tomato S100\nTản nhiệt CPU Aigo ICE 200 Pro RGB",
//         "stockQuantity": 5,
//         "category": {
//             "_id": "69af9bb381c4da1a053f2e76",
//             "name": "PC Văn Phòng",
//             "description": "Máy tính được thiết kế cho các công việc văn phòng như soạn thảo văn bản, xử lý bảng tính, trình chiếu và sử dụng các phần mềm quản lý. Cấu hình ổn định, tiết kiệm điện và phù hợp cho môi trường làm việc.",
//             "slug": "pc-van-phong"
//         },
//         "deleted": false,
//         "slug": "pc-ttg-home-office-ryzen-5-5500gt-ram-8gb-ssd-256gb",
//         "__v": 0
//     },
//     {
//         "_id": "69b10681cfd4bdcab53960a8",
//         "name": "PC MINI TTG GAMING PRO i5 14600KF - RTX 5080 16GB OC",
//         "price": 61680000,
//         "image": "1773209217838-mini.jpg",
//         "description": "CPU Intel Core i5-14600KF (Up to 5.3Ghz, 14 NHÂN 20 LUỒNG, 24MB CACHE) TRAY\nMainboard MSI B760M GAMING WIFI PLUS DDR5\nRAM APACER NOX 32GB (2x16GB) DDR5 Bus 5200Mhz – Black\nỔ cứng SSD HIKSEMI WAVE 512GB M.2 2280 PCIe 3.0x4\nNguồn FSP VITA 850GM - 850W PPA8504205 GOLD/DÂY RỜI/EU/ĐEN\nCard màn hình PNY GeForce RTX 5080 OC 16GB 16GB GDDR7\nVỏ Case JONSBO D32 PRO MINI BLACK\nTẢN NHIỆT NƯỚC ID-COOLING FX240 INF ARGB",
//         "stockQuantity": 5,
//         "category": {
//             "_id": "69af9bb981c4da1a053f2e79",
//             "name": "PC Mini",
//             "description": "Máy tính có kích thước nhỏ gọn, tiết kiệm không gian nhưng vẫn đáp ứng tốt các nhu cầu cơ bản như làm việc văn phòng, học tập, giải trí nhẹ và xem phim.",
//             "slug": "pc-mini"
//         },
//         "deleted": false,
//         "slug": "pc-mini-ttg-gaming-pro-i5-14600kf-rtx-5080-16gb-oc",
//         "__v": 0
//     },
//     {
//         "_id": "69b106cccfd4bdcab53960ac",
//         "name": "PC TTG AMD GAMING PRO Ryzen 5 9600X - RX 9060 XT 8GB OC",
//         "price": 26880000,
//         "image": "1773210545777-amd_gaming.jpg",
//         "description": "CPU AMD Ryzen 5 9600X - TRAY (3.9 GHz Boost 5.4 GHz | 6 nhân/ 12 luồng | 32 MB Cache)\nMainboard ASUS A620M-E DDR5\nRAM APACER NOX 16GB Bus 5200Mhz DDR5\nỔ cứng SSD HIKSEMI WAVE 512GB M.2 2280 PCIe 3.0x4\nNguồn máy tính AIGO GB650 - 650W (80 Plus Bronze/Màu Đen)\nCard màn hình ASRock AMD Radeon RX 9060 XT Challenger 8GB OC\nVỏ Case AIGO C218M BLACK - KÈM 4 FAN ARGB\nTản nhiệt khí IDCOOLING SE-214 XT RGB BLACK",
//         "stockQuantity": 5,
//         "category": {
//             "_id": "69af9b8b81c4da1a053f2e73",
//             "name": "PC AMD Gaming",
//             "description": "Dòng máy tính gaming sử dụng CPU AMD Ryzen kết hợp với card đồ họa rời như Radeon hoặc NVIDIA, cung cấp hiệu năng cao, khả năng đa nhiệm tốt và tối ưu chi phí cho game thủ.",
//             "slug": "pc-amd-gaming"
//         },
//         "deleted": false,
//         "slug": "pc-ttg-amd-gaming-pro-ryzen-5-9600x-rx-9060-xt-8gb-oc",
//         "__v": 0
//     }
// ]

//get category http://localhost:3000/api/categories
// [
//     {
//         "_id": "69af030a98e481a58bbe09b8",
//         "name": "PC Gaming",
//         "description": "Máy tính cấu hình cao được thiết kế để chơi game, xử lý đồ họa mạnh và mang lại trải nghiệm game mượt mà.",
//         "deleted": false,
//         "slug": "pc-gaming",
//         "__v": 0,
//         "deletedAt": "2026-03-10T06:38:15.813Z"
//     },
//     {
//         "_id": "69af9b8b81c4da1a053f2e73",
//         "name": "PC AMD Gaming",
//         "description": "Dòng máy tính gaming sử dụng CPU AMD Ryzen kết hợp với card đồ họa rời như Radeon hoặc NVIDIA, cung cấp hiệu năng cao, khả năng đa nhiệm tốt và tối ưu chi phí cho game thủ.",
//         "deleted": false,
//         "slug": "pc-amd-gaming",
//         "__v": 0
//     },
//     {
//         "_id": "69af9bb381c4da1a053f2e76",
//         "name": "PC Văn Phòng",
//         "description": "Máy tính được thiết kế cho các công việc văn phòng như soạn thảo văn bản, xử lý bảng tính, trình chiếu và sử dụng các phần mềm quản lý. Cấu hình ổn định, tiết kiệm điện và phù hợp cho môi trường làm việc.",
//         "deleted": false,
//         "slug": "pc-van-phong",
//         "__v": 0
//     },
//     {
//         "_id": "69af9bb981c4da1a053f2e79",
//         "name": "PC Mini",
//         "description": "Máy tính có kích thước nhỏ gọn, tiết kiệm không gian nhưng vẫn đáp ứng tốt các nhu cầu cơ bản như làm việc văn phòng, học tập, giải trí nhẹ và xem phim.",
//         "deleted": false,
//         "slug": "pc-mini",
//         "__v": 0
//     }
// ]