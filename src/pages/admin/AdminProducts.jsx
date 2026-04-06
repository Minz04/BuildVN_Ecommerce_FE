import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Package, Plus, Edit, Trash2, X, Loader2, Image as ImageIcon, Search, Layers } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = {
    name: '',
    price: '',
    oldPrice: '',
    stockQuantity: '',
    category: '',
    specs: ''
  };
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null); 
  const [existingImage, setExistingImage] = useState(''); 

  const fetchData = async () => {
    try {
      const productRes = await axios.get('http://localhost:3000/api/computers');
      setProducts(productRes.data || []);

      const categoryRes = await axios.get('http://localhost:3000/api/categories');
      setCategories(categoryRes.data || []);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (product = null) => {
    setImageFile(null); 
    
    if (product) {
      setEditingId(product._id);
      setExistingImage(product.image || ''); 
      
      // Xử lý specs: Nếu DB trả về Object thì ép thành chuỗi Text để hiện lên ô input
      let specsText = '';
      if (product.specs) {
        specsText = typeof product.specs === 'object' ? JSON.stringify(product.specs) : product.specs;
      }

      setFormData({
        name: product.name || '',
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        stockQuantity: product.stockQuantity || '',
        category: product.category?._id || product.category || '',
        specs: specsText
      });
    } else {
      setEditingId(null);
      setExistingImage('');
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
    setImageFile(null);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      return toast.warning("Vui lòng nhập đủ Tên, Giá và Danh mục!");
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('price', formData.price);
      submitData.append('oldPrice', formData.oldPrice);
      submitData.append('stockQuantity', formData.stockQuantity);
      submitData.append('category', formData.category);
      submitData.append('specs', formData.specs);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const config = { 
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
        } 
      };

      if (editingId) {
        await axios.put(`http://localhost:3000/api/computers/${editingId}`, submitData, config);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await axios.post('http://localhost:3000/api/computers', submitData, config);
        toast.success("Thêm sản phẩm thành công!");
      }
      
      fetchData(); 
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/computers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đã xóa sản phẩm!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể xóa sản phẩm này!");
    }
  };

  // FIX LỖI ĐƯỜNG DẪN ẢNH Ở ĐÂY
  const getImageUrl = (imgName) => {
    if (!imgName) return 'https://via.placeholder.com/150?text=No+Image';
    if (imgName.startsWith('http')) return imgName;
    
    // Nếu trong DB đã lưu sẵn dấu "/" (VD: /images/abc.jpg) thì chỉ nối với localhost
    if (imgName.startsWith('/')) return `http://localhost:3000${imgName}`;
    
    // Nếu DB chỉ lưu "abc.jpg" thì nối thêm /images/
    return `http://localhost:3000/images/${imgName}`; 
  };

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-6 md:p-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Quản lý Sản phẩm</h1>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#0071e3] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold">
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <th className="p-5 w-20 text-center">Ảnh</th>
                <th className="p-5">Tên sản phẩm</th>
                <th className="p-5 text-right">Giá bán</th>
                <th className="p-5 text-center">Tồn kho</th>
                <th className="p-5 text-center text-blue-600">Đã bán</th> {/* Thêm cột Đã bán */}
                <th className="p-5 text-center w-28">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50">
                  <td className="p-3 text-center">
                    <img src={getImageUrl(product.image)} alt="thumbnail" className="w-12 h-12 object-contain mx-auto" />
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{product.name}</p>
                  </td>
                  <td className="p-4 text-right">
                    <p className="font-black text-[#e30019]">{product.price?.toLocaleString('vi-VN')} đ</p>
                    {product.oldPrice > 0 && (
                      <p className="text-xs text-gray-400 line-through">{product.oldPrice?.toLocaleString('vi-VN')} đ</p>
                    )}
                  </td>
                  <td className="p-4 text-center">{product.stockQuantity}</td>
                  <td className="p-4 text-center font-bold text-blue-600">{product.soldCount || 0}</td> {/* Hiển thị soldCount */}
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(product._id, product.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CẬP NHẬT / THÊM SẢN PHẨM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between">
              <h3 className="font-black text-xl text-gray-800 uppercase">{editingId ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>

            <div className="p-6 overflow-y-auto bg-gray-50 max-h-[75vh]">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* BOX 1: THÔNG TIN CƠ BẢN */}
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-1">Tên sản phẩm *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Danh mục *</label>
                      <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-cyan-500">
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Số lượng Tồn kho *</label>
                      <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} min="0" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1 text-[#e30019]">Giá bán hiện tại *</label>
                      <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-cyan-500 text-[#e30019] font-bold" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1 text-gray-500">Giá cũ (nếu có Flash Sale)</label>
                      <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange} min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-cyan-500 text-gray-500" placeholder="Bỏ trống nếu không sale" />
                    </div>
                  </div>
                </div>

                {/* BOX 2: ẢNH VÀ THÔNG SỐ (THÊM LẠI THEO YÊU CẦU) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ô CHỌN FILE ẢNH */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2"><ImageIcon size={16}/> Chọn ảnh từ máy tính</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4 cursor-pointer" />
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex justify-center bg-gray-50 h-32 relative">
                      {imageFile ? (
                        <img src={URL.createObjectURL(imageFile)} alt="Preview mới" className="h-full object-contain" />
                      ) : existingImage ? (
                        <img src={getImageUrl(existingImage)} alt="Ảnh cũ" className="h-full object-contain" />
                      ) : (
                        <p className="text-gray-400 mt-10 text-sm">Chưa có ảnh</p>
                      )}
                    </div>
                  </div>

                  {/* Ô NHẬP THÔNG SỐ KỸ THUẬT */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <label className="block text-sm font-bold mb-2">Thông số kỹ thuật (Specs)</label>
                    <p className="text-xs text-gray-500 mb-2">Nhập chuỗi JSON hoặc mô tả văn bản thường.</p>
                    <textarea 
                      name="specs" 
                      value={formData.specs} 
                      onChange={handleChange} 
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 resize-none font-mono text-sm bg-gray-50" 
                      placeholder='Ví dụ dạng JSON:
{
  "cpu": "Core i7",
  "ram": "16GB",
  "vga": "RTX 3060"
}'
                    ></textarea>
                  </div>
                </div>

              </form>
            </div>

            <div className="p-5 border-t bg-white flex justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 bg-gray-100 font-bold rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">Hủy bỏ</button>
              <button type="submit" form="productForm" disabled={isSubmitting} className="px-8 py-2.5 bg-[#0071e3] text-white font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Lưu Sản Phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;