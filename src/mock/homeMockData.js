const images = import.meta.glob("../assets/img/*.{png,jpg,jpeg,gif}", {
    eager: true,
    import: "default"
});

export const mockNews = [
    {
        id: "news_1",
        title: "Đánh giá chi tiết RTX 4060: Liệu có đáng để nâng cấp?",
        // Link ảnh xịn, không bao giờ bị sập
        thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600&auto=format&fit=crop",
        date: "17/03/2026",
        slug: "danh-gia-chi-tiet-rtx-4060"
    },
    {
        id: "news_2",
        title: "Hướng dẫn tối ưu hóa Windows 11 để chơi game mượt mà nhất",
        thumbnail: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=600&auto=format&fit=crop",
        date: "15/03/2026",
        slug: "huong-dan-toi-uu-hoa-windows-11"
    },
    {
        id: "news_3",
        title: "Top 5 Laptop Gaming đáng mua nhất đầu năm 2026",
        thumbnail: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop",
        date: "10/03/2026",
        slug: "top-5-laptop-gaming-dang-mua"
    }
];