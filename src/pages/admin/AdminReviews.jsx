import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Star, MessageSquare, ExternalLink, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminReviews = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/reviews/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.stats || []);
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu đánh giá');
      } finally {
        setLoading(false);
      }
    };
    fetchReviewStats();
  }, []);

  const handleClearAllReviews = async (computerId, computerName) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa toàn bộ đánh giá của sản phẩm "${computerName}" không?\n\nHành động này không thể hoàn tác!`);
    
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/reviews/admin/product/${computerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Đã xóa toàn bộ đánh giá thành công!');
      const res = await axios.get('http://localhost:3000/api/reviews/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.stats || []);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa đánh giá');
    }
  };

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    if (img.startsWith('http')) return img;
    const BASE_URL = 'http://localhost:3000';
    if (img.startsWith('/images/')) return `${BASE_URL}${img}`;
    if (img.startsWith('/')) return `${BASE_URL}/images${img}`;
    return `${BASE_URL}/images/${img}`;
  };

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-6 md:p-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Thống kê Đánh giá</h1>
          <p className="text-gray-500 font-medium mt-1">Quản lý phản hồi và chất lượng sản phẩm</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {stats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <MessageSquare size={64} className="mb-4 opacity-20" />
              <p className="text-lg font-bold text-gray-500">Chưa có sản phẩm nào được đánh giá</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                  <th className="p-5">Sản phẩm</th>
                  <th className="p-5 text-center">Tổng Đánh Giá</th>
                  <th className="p-5 text-center">Điểm Trung Bình</th>
                  <th className="p-5 w-[300px]">Chi tiết Phân bổ Sao</th>
                  <th className="p-5 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                {stats.map((item) => (
                  <tr key={item.computer._id} className="hover:bg-gray-50/50 transition-colors">
                    
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-white shrink-0 p-1">
                          <img src={getImageUrl(item.computer.image)} alt="Product" className="w-full h-full object-contain" />
                        </div>
                        <p className="font-bold text-gray-900 line-clamp-2 max-w-[250px]">{item.computer.name}</p>
                      </div>
                    </td>

                    <td className="p-5 text-center font-black text-lg text-gray-800">
                      {item.total}
                    </td>

                    <td className="p-5 text-center">
                      <div className="flex flex-col items-center justify-center text-[#ee4d2d]">
                        <span className="text-2xl font-black">{item.avg}</span>
                        <div className="flex gap-0.5">
                           {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= Math.round(item.avg) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}/>)}
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="space-y-1.5 text-xs font-medium text-gray-600">
                        <div className="flex items-center gap-2"><span className="w-8 text-right text-green-600 font-bold">5 ★</span> <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{width: `${(item.stars[5] / item.total) * 100}%`}}></div></div> <span className="w-6">{item.stars[5]}</span></div>
                        <div className="flex items-center gap-2"><span className="w-8 text-right text-lime-600 font-bold">4 ★</span> <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-lime-500" style={{width: `${(item.stars[4] / item.total) * 100}%`}}></div></div> <span className="w-6">{item.stars[4]}</span></div>
                        <div className="flex items-center gap-2"><span className="w-8 text-right text-yellow-500 font-bold">3 ★</span> <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{width: `${(item.stars[3] / item.total) * 100}%`}}></div></div> <span className="w-6">{item.stars[3]}</span></div>
                        <div className="flex items-center gap-2"><span className="w-8 text-right text-orange-500 font-bold">2 ★</span> <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400" style={{width: `${(item.stars[2] / item.total) * 100}%`}}></div></div> <span className="w-6">{item.stars[2]}</span></div>
                        <div className="flex items-center gap-2"><span className="w-8 text-right text-red-500 font-bold">1 ★</span> <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{width: `${(item.stars[1] / item.total) * 100}%`}}></div></div> <span className="w-6">{item.stars[1]}</span></div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <a href={`/product/${item.computer.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold rounded-lg transition-colors border border-cyan-200">
                        <ExternalLink size={16} /> Xem chi tiết
                      </a>

                      <button onClick={() => handleClearAllReviews(item.computer._id, item.computer.name)} className="inline-flex items-center gap-1.5 px-3 ml-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors border border-red-200 text-xs" title="Xóa trắng toàn bộ đánh giá">
                        <Trash2 size={14} /> Dọn dẹp
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;