import { useState, useEffect } from 'react';

export const useSearchHistory = () => {
    // Khởi tạo State từ localStorage 
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    });

    // Tự động lưu vào localStorage khi history thay đổi
    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }, [history]);

    // Hàm thêm lịch sử mới
    const addSearchTerm = (term) => {
        if (!term.trim()) return;

        setHistory(prev => {
            // Lọc bỏ từ khóa trùng lặp (nếu đã tìm trước đó rồi)
            const filtered = prev.filter(item => item !== term.trim());
            // Đẩy từ khóa mới lên đầu, giữ lại tối đa 5 lịch sử gần nhất
            const newHistory = [term.trim(), ...filtered].slice(0, 5);

            // LATER BE: axios.post('/api/user/search-history', { term })
            return newHistory;
        });
    };

    // Xóa một lịch sử
    const removeSearchTerm = (termToRemove) => {
        setHistory(prev => prev.filter(item => item !== termToRemove));
    };

    return { history, addSearchTerm, removeSearchTerm };
};