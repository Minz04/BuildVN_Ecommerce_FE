import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, KeyRound, Loader2, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { userApi } from '../services/userApi';

const Profile = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // ==========================================
  // STATE: HỒ SƠ
  // ==========================================
  const [profileData, setProfileData] = useState({
    fullname: '', phone: '', email: '', gender: 'Nam', dob: '', avatar: ''
  });

  // ==========================================
  // STATE: ĐỊA CHỈ (JSON TRICK)
  // ==========================================
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // ==========================================
  // STATE: MẬT KHẨU
  // ==========================================
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  // Load API Hành chính VN
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Form thêm/sửa địa chỉ trong Popup
  const [addressForm, setAddressForm] = useState({
    name: '', phone: '', province: '', provinceName: '', district: '', districtName: '',
    ward: '', wardName: '', street: '', type: 'Nhà Riêng', isDefault: false
  });

  // ==========================================
  // FETCH DỮ LIỆU BAN ĐẦU
  // ==========================================
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    
    // ĐÃ FIX: Dùng dữ liệu Github cực kỳ ổn định, không bao giờ lỗi CORS
    axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
      .then(res => setProvinces(res.data)).catch(err => console.error(err));

    const fetchProfile = async () => {
      try {
        const res = await userApi.getProfile();
        const userData = res.data.user;
        
        setProfileData({
          fullname: userData.fullname || '',
          phone: userData.phone || '',
          email: userData.email || '',
          gender: userData.gender || 'Nam',
          dob: userData.dob || '',
          avatar: userData.avatar || 'https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg'
        });

        let parsedAddresses = [];
        try {
          parsedAddresses = JSON.parse(userData.address);
          if (!Array.isArray(parsedAddresses)) throw new Error();
        } catch (e) {
          if (userData.address) {
            parsedAddresses = [{
              id: Date.now().toString(),
              name: userData.fullname,
              phone: userData.phone,
              fullAddress: userData.address,
              type: 'Nhà Riêng',
              isDefault: true
            }];
          }
        }
        setAddresses(parsedAddresses);
        setUser(userData);
      } catch (error) {
        toast.error('Không thể tải thông tin cá nhân');
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // HÀM LƯU HỒ SƠ (TAB 1)
  // ==========================================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await userApi.updateProfile({
        fullname: profileData.fullname,
        phone: profileData.phone,
        gender: profileData.gender,
        dob: profileData.dob,
        avatar: profileData.avatar
      });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Cập nhật hồ sơ thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // XỬ LÝ ĐỔI MẬT KHẨU (TAB 3)
  // ==========================================
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.warning('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      await userApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Đổi mật khẩu thành công! Vui lòng ghi nhớ mật khẩu mới.');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Mật khẩu cũ không chính xác!');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // XỬ LÝ ĐỊA CHỈ (Đã sửa cho khớp API Github)
  // ==========================================
  const openModal = (addr = null) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddressForm({ ...addr, province: '', district: '', ward: '', street: addr.fullAddress });
    } else {
      setEditingAddressId(null);
      setAddressForm({ name: '', phone: '', province: '', provinceName: '', district: '', districtName: '', ward: '', wardName: '', street: '', type: 'Nhà Riêng', isDefault: addresses.length === 0 });
    }
    setShowAddressModal(true);
  };

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    const prov = provinces.find(p => p.Id === code);
    setDistricts(prov ? prov.Districts : []); setWards([]);
    setAddressForm({ ...addressForm, province: code, provinceName: prov?.Name || '', district: '', districtName: '', ward: '', wardName: '' });
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    const dist = districts.find(d => d.Id === code);
    setWards(dist ? dist.Wards : []);
    setAddressForm({ ...addressForm, district: code, districtName: dist?.Name || '', ward: '', wardName: '' });
  };

  const handleWardChange = (e) => {
    const code = e.target.value;
    const ward = wards.find(w => w.Id === code);
    setAddressForm({ ...addressForm, ward: code, wardName: ward?.Name || '' });
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.phone || !addressForm.street) return toast.warning('Vui lòng điền đủ thông tin');

    const fullStr = addressForm.provinceName ? `${addressForm.street}, ${addressForm.wardName}, ${addressForm.districtName}, ${addressForm.provinceName}` : addressForm.street;
    
    let updatedAddresses = [...addresses];
    const newAddr = {
      id: editingAddressId || Date.now().toString(),
      name: addressForm.name,
      phone: addressForm.phone,
      fullAddress: fullStr,
      type: addressForm.type,
      isDefault: addressForm.isDefault
    };

    if (newAddr.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }

    if (editingAddressId) {
      updatedAddresses = updatedAddresses.map(a => a.id === editingAddressId ? newAddr : a);
    } else {
      updatedAddresses.push(newAddr);
    }

    if (updatedAddresses.length === 1) updatedAddresses[0].isDefault = true;

    try {
      await userApi.updateProfile({ address: JSON.stringify(updatedAddresses) });
      setAddresses(updatedAddresses);
      setShowAddressModal(false);
      toast.success('Đã lưu địa chỉ thành công!');
    } catch (err) {
      toast.error('Lỗi lưu địa chỉ');
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    const updated = addresses.filter(a => a.id !== id);
    try {
      await userApi.updateProfile({ address: JSON.stringify(updated) });
      setAddresses(updated);
      toast.success('Đã xóa địa chỉ');
    } catch (err) {
      toast.error('Lỗi khi xóa');
    }
  };

  const setDefaultAddress = async (id) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    try {
      await userApi.updateProfile({ address: JSON.stringify(updated) });
      setAddresses(updated);
      toast.success('Đã thay đổi địa chỉ mặc định');
    } catch (err) {
      toast.error('Lỗi hệ thống');
    }
  };

  // ==========================================
  // RENDER UI
  // ==========================================
  if (isFetching) return <div className="min-h-screen flex justify-center items-center bg-[#f5f5f5]"><Loader2 className="animate-spin text-[#ee4d2d]" size={40}/></div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-12 pt-6">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row gap-6">
        
        {/* CỘT TRÁI: MENU */}
        <div className="w-full md:w-[250px] shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
              {/* --- ĐÃ FIX LỖI HIỂN THỊ ẢNH TẠI ĐÂY --- */}
              <img 
                src={
                  !profileData.avatar ? 'https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg' 
                  : profileData.avatar.startsWith('http') ? profileData.avatar 
                  : `http://localhost:3000${profileData.avatar}`
                } 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-gray-800 line-clamp-1">{profileData.fullname || user?.username}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1"><User size={14}/> Sửa hồ sơ</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-sm font-medium text-gray-700">
            <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 ${activeTab === 'profile' ? 'text-[#ee4d2d]' : 'hover:text-[#ee4d2d]'}`}><User size={18} className={activeTab === 'profile' ? 'text-[#ee4d2d]' : 'text-blue-500'}/> Tài khoản của tôi</button>
            <button onClick={() => setActiveTab('address')} className={`flex items-center gap-2 pl-7 ${activeTab === 'address' ? 'text-[#ee4d2d]' : 'hover:text-[#ee4d2d]'}`}>Địa chỉ</button>
            <button onClick={() => setActiveTab('password')} className={`flex items-center gap-2 pl-7 ${activeTab === 'password' ? 'text-[#ee4d2d]' : 'hover:text-[#ee4d2d]'}`}>Đổi mật khẩu</button>
            <Link to="/orders" className="flex items-center gap-2 hover:text-[#ee4d2d]"><MapPin size={18} className="text-blue-500"/> Đơn Mua</Link>
          </div>
        </div>

        {/* CỘT PHẢI: NỘI DUNG */}
        <div className="flex-1 bg-white rounded-sm shadow-sm min-h-[500px]">
          
          {/* TAB 1: HỒ SƠ */}
          {activeTab === 'profile' && (
            <div className="p-6 md:p-8">
              <div className="border-b pb-4 mb-8">
                <h1 className="text-xl font-medium text-gray-800">Hồ Sơ Của Tôi</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>

              <div className="flex flex-col-reverse md:flex-row gap-10">
                <form onSubmit={handleUpdateProfile} className="flex-1 space-y-6">
                  <div className="flex items-center">
                    <label className="w-1/3 text-right pr-6 text-gray-500 text-sm font-medium">Tên đăng nhập</label>
                    <div className="w-2/3 text-gray-800 font-medium">{user?.username}</div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-1/3 text-right pr-6 text-gray-500 text-sm font-medium">Tên</label>
                    <div className="w-2/3">
                      <input type="text" value={profileData.fullname} onChange={(e)=>setProfileData({...profileData, fullname: e.target.value})} className="w-full px-3 py-2 border rounded-sm outline-none focus:border-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-1/3 text-right pr-6 text-gray-500 text-sm font-medium">Email</label>
                    <div className="w-2/3 text-gray-800 flex items-center gap-2">{profileData.email} <span className="text-xs text-blue-600 underline cursor-pointer">Thay Đổi</span></div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-1/3 text-right pr-6 text-gray-500 text-sm font-medium">Số điện thoại</label>
                    <div className="w-2/3 text-gray-800 flex items-center gap-2">{profileData.phone} <span className="text-xs text-blue-600 underline cursor-pointer">Thay Đổi</span></div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-1/3 text-right pr-6 text-gray-500 text-sm font-medium">Giới tính</label>
                    <div className="w-2/3 flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={profileData.gender === 'Nam'} onChange={()=>setProfileData({...profileData, gender: 'Nam'})} className="accent-[#ee4d2d]"/> Nam</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={profileData.gender === 'Nữ'} onChange={()=>setProfileData({...profileData, gender: 'Nữ'})} className="accent-[#ee4d2d]"/> Nữ</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={profileData.gender === 'Khác'} onChange={()=>setProfileData({...profileData, gender: 'Khác'})} className="accent-[#ee4d2d]"/> Khác</label>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-1/3 text-right pr-6 text-gray-500 text-sm font-medium">Ngày sinh</label>
                    <div className="w-2/3">
                      <input type="date" value={profileData.dob} onChange={(e)=>setProfileData({...profileData, dob: e.target.value})} className="px-3 py-2 border rounded-sm outline-none text-gray-700" />
                    </div>
                  </div>
                  <div className="flex items-center pt-4">
                    <div className="w-1/3"></div>
                    <div className="w-2/3">
                      <button type="submit" disabled={isLoading} className="bg-[#ee4d2d] hover:bg-[#d73211] text-white px-8 py-2.5 rounded-sm font-medium transition-colors">Lưu</button>
                    </div>
                  </div>
                </form>

                {/* Khối Avatar */}
                <div className="w-full md:w-[250px] md:border-l flex flex-col items-center justify-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                    <img 
                      src={
                        !profileData.avatar ? 'https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg' 
                        : profileData.avatar.startsWith('http') ? profileData.avatar 
                        : `http://localhost:3000${profileData.avatar}`
                      } 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <input 
                    type="file" 
                    id="avatarInput" 
                    accept="image/jpeg, image/png" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      
                      // Kiểm tra kích thước file
                      if (file.size > 2 * 1024 * 1024) {
                        toast.warning('Dung lượng ảnh tối đa là 2MB');
                        return;
                      }

                      // Tạo FormData để gửi file
                      const formData = new FormData();
                      formData.append('avatar', file);

                      // Gửi file đến BE
                      try {
                        const toastId = toast.loading('Đang tải ảnh lên...');
                        const res = await userApi.uploadAvatar(formData);
                        
                        setProfileData({...profileData, avatar: res.data.user.avatar});
                        setUser(res.data.user);
                        localStorage.setItem('user', JSON.stringify(res.data.user));
                        
                        toast.update(toastId, { render: 'Cập nhật ảnh thành công!', type: 'success', isLoading: false, autoClose: 2000 });
                      } catch (error) {
                        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải ảnh');
                      }
                    }}
                  />
                  <label htmlFor="avatarInput" className="border border-gray-300 px-4 py-2 text-sm text-gray-600 bg-white hover:bg-gray-50 rounded-sm cursor-pointer transition-colors">Chọn Ảnh</label>
                  
                  <div className="text-center text-xs text-gray-400">
                    <p>Dung lượng file tối đa 2 MB</p>
                    <p>Định dạng: .JPEG, .PNG</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ĐỊA CHỈ */}
          {activeTab === 'address' && (
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-xl font-medium text-gray-800">Địa chỉ của tôi</h1>
                <button onClick={() => openModal()} className="bg-[#ee4d2d] hover:bg-[#d73211] text-white px-4 py-2 rounded-sm font-medium text-sm flex items-center gap-1 transition-colors">
                  <Plus size={16}/> Thêm địa chỉ mới
                </button>
              </div>

              <div className="space-y-6">
                {addresses.length === 0 ? (
                  <div className="text-center text-gray-500 py-10">Bạn chưa có địa chỉ nào.</div>
                ) : (
                  addresses.map((addr, index) => (
                    <div key={addr.id} className={`flex justify-between items-start pb-6 ${index !== addresses.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-gray-800 text-base">{addr.name}</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-500">{addr.phone}</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-[500px]">{addr.fullAddress}</p>
                        {addr.isDefault && <span className="mt-2 inline-block border border-[#ee4d2d] text-[#ee4d2d] text-[10px] px-1.5 py-0.5 rounded-sm">Mặc định</span>}
                        {addr.type && <span className="mt-2 ml-2 inline-block border border-gray-300 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-sm">{addr.type}</span>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3 text-sm">
                          <button onClick={() => openModal(addr)} className="text-blue-600 hover:text-blue-800 font-medium">Cập nhật</button>
                          {!addr.isDefault && <button onClick={() => deleteAddress(addr.id)} className="text-gray-500 hover:text-red-500 font-medium">Xóa</button>}
                        </div>
                        <button 
                          onClick={() => setDefaultAddress(addr.id)} 
                          disabled={addr.isDefault}
                          className={`px-3 py-1 text-sm border rounded-sm transition-colors ${addr.isDefault ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                        >
                          Thiết lập mặc định
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ĐỔI MẬT KHẨU */}
          {activeTab === 'password' && (
            <div className="p-6 md:p-8">
              <div className="border-b pb-4 mb-8">
                <h1 className="text-xl font-medium text-gray-800">Đổi Mật Khẩu</h1>
                <p className="text-sm text-gray-500 mt-1">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
              </div>

              <form onSubmit={handleChangePassword} className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center">
                  <label className="w-1/3 text-right pr-6 text-gray-500 text-sm font-medium">Mật khẩu hiện tại</label>
                  <div className="w-2/3">
                    <input type="password" required value={passwordData.oldPassword} onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} className="w-full px-3 py-2 border rounded-sm outline-none focus:border-gray-400" />
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 text-right pr-6 text-gray-500 text-sm font-medium">Mật khẩu mới</label>
                  <div className="w-2/3">
                    <input type="password" required value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full px-3 py-2 border rounded-sm outline-none focus:border-gray-400" />
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 text-right pr-6 text-gray-500 text-sm font-medium">Xác nhận mật khẩu</label>
                  <div className="w-2/3">
                    <input type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full px-3 py-2 border rounded-sm outline-none focus:border-gray-400" />
                  </div>
                </div>
                <div className="flex items-center pt-4">
                  <div className="w-1/3"></div>
                  <div className="w-2/3 flex flex-col items-start gap-3">
                    <button type="submit" disabled={isLoading} className="bg-[#ee4d2d] hover:bg-[#d73211] text-white px-8 py-2.5 rounded-sm font-medium transition-colors">
                      {isLoading ? <Loader2 className="animate-spin" size={20}/> : 'Xác Nhận'}
                    </button>
                    <p className="text-xs text-gray-400 italic">Sau khi đổi mật khẩu thành công, vui lòng ghi nhớ mật khẩu mới.</p>
                  </div>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL THÊM/SỬA ĐỊA CHỈ                    */}
      {/* ========================================= */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-md w-[500px] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-medium text-gray-800">{editingAddressId ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h2>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <form onSubmit={saveAddress} className="p-6">
              <div className="flex gap-4 mb-4">
                <input required type="text" placeholder="Họ và tên" value={addressForm.name} onChange={e=>setAddressForm({...addressForm, name: e.target.value})} className="w-1/2 px-3 py-2 border rounded-sm outline-none focus:border-gray-500 text-sm"/>
                <input required type="text" placeholder="Số điện thoại" value={addressForm.phone} onChange={e=>setAddressForm({...addressForm, phone: e.target.value})} className="w-1/2 px-3 py-2 border rounded-sm outline-none focus:border-gray-500 text-sm"/>
              </div>

              {!editingAddressId ? (
                <div className="flex gap-2 mb-4">
                  <select required value={addressForm.province} onChange={handleProvinceChange} className="w-1/3 px-2 py-2 border rounded-sm outline-none text-sm bg-white text-gray-600">
                    <option value="">Tỉnh/Thành phố</option>
                    {provinces.map(p => <option key={p.Id} value={p.Id}>{p.Name}</option>)}
                  </select>
                  <select required disabled={!addressForm.province} value={addressForm.district} onChange={handleDistrictChange} className="w-1/3 px-2 py-2 border rounded-sm outline-none text-sm bg-white text-gray-600">
                    <option value="">Quận/Huyện</option>
                    {districts.map(d => <option key={d.Id} value={d.Id}>{d.Name}</option>)}
                  </select>
                  <select required disabled={!addressForm.district} value={addressForm.ward} onChange={handleWardChange} className="w-1/3 px-2 py-2 border rounded-sm outline-none text-sm bg-white text-gray-600">
                    <option value="">Phường/Xã</option>
                    {wards.map(w => <option key={w.Id} value={w.Id}>{w.Name}</option>)}
                  </select>
                </div>
              ) : (
                <div className="mb-4 text-xs text-blue-600 italic">Đang ở chế độ chỉnh sửa. Nếu muốn đổi Tỉnh/Huyện, vui lòng xóa và tạo địa chỉ mới.</div>
              )}

              <div className="mb-4">
                <textarea required rows="2" placeholder="Địa chỉ cụ thể (Số nhà, đường...)" value={addressForm.street} onChange={e=>setAddressForm({...addressForm, street: e.target.value})} className="w-full px-3 py-2 border rounded-sm outline-none focus:border-gray-500 text-sm resize-none"></textarea>
              </div>

              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-2">Loại địa chỉ:</p>
                <div className="flex gap-3">
                  <button type="button" onClick={()=>setAddressForm({...addressForm, type: 'Nhà Riêng'})} className={`px-4 py-1.5 border rounded-sm text-sm ${addressForm.type === 'Nhà Riêng' ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-gray-300 text-gray-600'}`}>Nhà Riêng</button>
                  <button type="button" onClick={()=>setAddressForm({...addressForm, type: 'Văn Phòng'})} className={`px-4 py-1.5 border rounded-sm text-sm ${addressForm.type === 'Văn Phòng' ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-gray-300 text-gray-600'}`}>Văn Phòng</button>
                </div>
              </div>

              <div className="mb-8 flex items-center gap-2">
                <input type="checkbox" id="isDefault" checked={addressForm.isDefault} disabled={addressForm.isDefault && addresses.length === 1} onChange={e=>setAddressForm({...addressForm, isDefault: e.target.checked})} className="accent-[#ee4d2d] w-4 h-4 cursor-pointer"/>
                <label htmlFor="isDefault" className={`text-sm ${addressForm.isDefault && addresses.length === 1 ? 'text-gray-400' : 'text-gray-600 cursor-pointer'}`}>Đặt làm địa chỉ mặc định</label>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddressModal(false)} className="px-6 py-2 hover:bg-gray-50 text-gray-600 rounded-sm font-medium transition-colors">Trở Lại</button>
                <button type="submit" className="px-6 py-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white rounded-sm font-medium transition-colors">Hoàn thành</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;