import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, MapPin, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { orderApi } from '../services/orderApi';

const Checkout = () => {
  const { cart, user, setCart } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Bảo vệ routes
  useEffect(() => {
    if (!user) navigate('/login');
    if (cart.length === 0) navigate('/cart');
  }, [user, cart, navigate]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/coupons', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setAvailableCoupons(res.data));
  }, []);

  // State điều hướng bước thanh toán
  const [step, setStep] = useState(1); // 1: Thông tin, 2: Thanh toán
  const [isLoading, setIsLoading] = useState(false);
  
  // State địa chỉ
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  
  const [formData, setFormData] = useState({
    gender: 'anh',
    fullname: user?.fullname || user?.email || '',
    phone: user?.phone || '',
    province: '',
    provinceName: '',
    district: '',
    districtName: '',
    ward: '',
    wardName: '',
    street: '',
    note: ''
  });

  
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  // TÍNH TỔNG TIỀN
  const totalPrice = cart.reduce((total, item) => {
    if (!item.computer) return total;
    return total + (item.computer.price * item.quantity);
  }, 0);
  
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const calculateDiscount = (coupon) => {
    if (!coupon) return 0;
    if (coupon.discountType === 'FIXED') return coupon.discountValue;
    if (coupon.discountType === 'PERCENTAGE') {
        let discount = totalPrice * (coupon.discountValue / 100);
        if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
            return coupon.maxDiscountAmount;
        }
        return discount;
    }
    return 0;
  };
  
  const discountAmount = calculateDiscount(selectedCoupon);
  const finalPrice = totalPrice - discountAmount;

  // LẤY DỮ LIỆU TỈNH THÀNH KHI LOAD TRANG
  useEffect(() => {
    axios.get('https://provinces.open-api.vn/api/?depth=3')
      .then(res => setProvinces(res.data))
      .catch(err => console.error("Lỗi tải API Địa chỉ:", err));
  }, []);

  
  
  // Nếu user đã có địa chỉ hiển thị lựa chọn địa chỉ đã lưu hoặc nhập mới
  useEffect(() => {
    if (user && user.address) {
      try {
        // Đọc và parse địa chỉ từ user.address, nếu có lỗi sẽ nhảy vào catch (trường hợp dữ liệu cũ chưa được cập nhật)
        const parsed = JSON.parse(user.address);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedAddresses(parsed);
          const defaultAddr = parsed.find(a => a.isDefault) || parsed[0];
          setSelectedAddressId(defaultAddr.id);
        }
      } catch (e) { 
        // Trường hợp dữ liệu cũ chưa được cập nhật lên định dạng mới, tạo một địa chỉ tạm thời từ thông tin có sẵn
        const legacyAddress = [{
          id: 'legacy_default',
          name: user.fullname || user.username || 'Khách hàng',
          phone: user.phone || '',
          fullAddress: user.address,
          type: 'Nhà riêng',
          isDefault: true
        }];
        setSavedAddresses(legacyAddress);
        setSelectedAddressId('legacy_default');
      }
    }
  }, [user]);
  
  // XỬ LÝ KHI CHỌN TỈNH -> TẢI HUYỆN
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const selectedProv = provinces.find(p => p.code == provinceCode);
    
    setDistricts(selectedProv ? selectedProv.districts : []);
    setWards([]);
    setFormData({
      ...formData,
      province: provinceCode,
      provinceName: selectedProv ? selectedProv.name : '',
      district: '', districtName: '',
      ward: '', wardName: ''
    });
  };

  // XỬ LÝ KHI CHỌN HUYỆN -> TẢI XÃ
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const selectedDist = districts.find(d => d.code == districtCode);
    
    setWards(selectedDist ? selectedDist.wards : []);
    setFormData({
      ...formData,
      district: districtCode,
      districtName: selectedDist ? selectedDist.name : '',
      ward: '', wardName: ''
    });
  };

  // XỬ LÝ KHI CHỌN XÃ
  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const selectedWard = wards.find(w => w.code == wardCode);
    setFormData({
      ...formData,
      ward: wardCode,
      wardName: selectedWard ? selectedWard.name : ''
    });
  };

  // Hàm xử lý khi nhấn nút "Tiếp tục đến thanh toán" ở bước 1
  const handleNextStep = (e) => {
    e.preventDefault();
    
    // Nếu có địa chỉ đã lưu được chọn và qua bước 2 mà không cần nhập lại thông tin
    if (selectedAddressId !== 'new') {
       setStep(2);
       window.scrollTo(0, 0);
       return;
    }

    if (!formData.fullname || !formData.phone || !formData.province || !formData.district || !formData.ward || !formData.street) {
      toast.warning("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ! Vui lòng nhập số di động 10 số.");
      return;
    }
    
    setStep(2);
    window.scrollTo(0, 0);
  };

  // Hàm submit đơn hàng (được gọi khi chọn phương thức thanh toán ở bước 2)
  const handleSubmitOrder = async () => {
    setIsLoading(true);
    try {
      let finalAddress = '';
      let finalPhone = '';

      // Kiểm tra xem khách chọn địa chỉ có sẵn hay nhập mới
      if (selectedAddressId !== 'new') {
        const chosenAddr = savedAddresses.find(a => a.id === selectedAddressId);
        finalAddress = formData.note.trim() ? `${chosenAddr.fullAddress} (Ghi chú: ${formData.note.trim()})` : chosenAddr.fullAddress;
        finalPhone = chosenAddr.phone;
      } else {
        const addressString = `${formData.street}, ${formData.wardName}, ${formData.districtName}, ${formData.provinceName}`;
        finalAddress = formData.note.trim() ? `${addressString} (Ghi chú: ${formData.note.trim()})` : addressString;
        finalPhone = formData.phone;
      }

      const res = await orderApi.createOrder({
        shippingAddress: finalAddress,
        phone: finalPhone,
        couponCode: selectedCoupon ? selectedCoupon.code : null,
        discountAmount: selectedCoupon ? calculateDiscount(selectedCoupon) : 0
      });

      const orderId = res.data.orderId;
      setCart([]); 
      localStorage.removeItem('cart'); // Xóa giỏ hàng

      // XỬ LÝ VNPAY NẾU CÓ
      if (paymentMethod === 'VNPAY') {
        toast.info('Đang chuyển hướng sang VNPAY...');
        const paymentRes = await orderApi.createPaymentUrl(orderId);
        if (paymentRes.data.paymentUrl) {
           window.location.href = paymentRes.data.paymentUrl; 
           return;
        }
      }

      // NẾU LÀ COD
      toast.success('Đặt hàng thành công!');
      navigate('/'); 

    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsLoading(false);
    }
  };

  // Nếu giỏ hàng trống thì không render form
  if (cart.length === 0) return null;

  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-12 pt-6">
      <div className="container mx-auto px-4 max-w-[800px]">
        
        {/* Nút quay lại */}
        <button 
          onClick={() => step === 1 ? navigate('/cart') : setStep(1)} 
          className="inline-flex items-center gap-1 text-[#0071e3] hover:text-blue-800 font-medium mb-4 text-sm transition-colors"
        >
          <ChevronLeft size={18} /> {step === 1 ? 'Trở về giỏ hàng' : 'Trở về thông tin đặt hàng'}
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* HEADER WIZARD */}
          <div className="bg-[#fff0f1] p-5 md:p-6 border-b border-red-100 relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10 max-w-[600px] mx-auto">
              
              <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-red-200 -translate-y-1/2 -z-10 border-t border-dashed border-red-300"></div>

              <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => navigate('/cart')}>
                <div className="w-8 h-8 rounded-full bg-[#e30019] text-white flex items-center justify-center font-bold text-sm shadow-sm"><ShoppingBag size={14} /></div>
                <span className="text-[11px] md:text-xs font-bold text-[#e30019]">Giỏ hàng</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${step >= 1 ? 'bg-[#e30019] text-white' : 'bg-white text-gray-400 border-2 border-gray-200'}`}>
                  <MapPin size={14} />
                </div>
                <span className={`text-[11px] md:text-xs font-bold ${step >= 1 ? 'text-[#e30019]' : 'text-gray-400'}`}>Thông tin đặt hàng</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${step >= 2 ? 'bg-[#e30019] text-white' : 'bg-white text-gray-400 border-2 border-gray-200'}`}>
                  <CreditCard size={14} />
                </div>
                <span className={`text-[11px] md:text-xs font-bold ${step >= 2 ? 'text-[#e30019]' : 'text-gray-400'}`}>Thanh toán</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white text-gray-400 border-2 border-gray-200 flex items-center justify-center font-bold text-sm"><CheckCircle size={14} /></div>
                <span className="text-[11px] md:text-xs font-bold text-gray-400">Hoàn tất</span>
              </div>
            </div>
          </div>

          {/* Bước 1: ĐIỀN THÔNG TIN */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="p-5 md:p-8">
              
              <h2 className="text-lg font-bold text-gray-800 mb-4">Địa Chỉ Nhận Hàng</h2>

              {/* HIỂN THỊ SỔ ĐỊA CHỈ NẾU CÓ */}
              {savedAddresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  {savedAddresses.map(addr => (
                    <label key={addr.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-[#0071e3] bg-blue-50/30 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="addressSelect" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1 w-4 h-4 text-[#0071e3] accent-[#0071e3]" />
                      <div className="ml-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800">{addr.name}</span>
                          <span className="text-gray-400 text-sm">|</span>
                          <span className="text-gray-600 font-medium text-sm">{addr.phone}</span>
                          {addr.isDefault && <span className="ml-2 text-[10px] border border-[#e30019] text-[#e30019] px-1.5 py-0.5 rounded-sm">Mặc định</span>}
                          {addr.type && <span className="ml-1 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-sm">{addr.type}</span>}
                        </div>
                        <p className="text-sm text-gray-500">{addr.fullAddress}</p>
                      </div>
                    </label>
                  ))}

                  {/* Nút chọn nhập địa chỉ khác */}
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === 'new' ? 'border-[#0071e3] bg-blue-50/30 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="addressSelect" checked={selectedAddressId === 'new'} onChange={() => setSelectedAddressId('new')} className="w-4 h-4 text-[#0071e3] accent-[#0071e3]" />
                    <span className="ml-3 font-bold text-gray-800">Giao đến địa chỉ khác...</span>
                  </label>
                </div>
              )}

              {/* FORM NHẬP TAY (Chỉ hiện khi ko có địa chỉ hoặc chọn Nhập mới) */}
              {selectedAddressId === 'new' && (
                <div className="bg-gray-50 p-4 md:p-5 rounded-xl border border-gray-200 mb-6 animate-in fade-in slide-in-from-top-2">
                  <h3 className="font-bold text-gray-700 mb-4">Thông tin người nhận</h3>
                  
                  <div className="flex items-center gap-6 mb-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value="anh" checked={formData.gender === 'anh'} onChange={(e)=>setFormData({...formData, gender: e.target.value})} className="w-4 h-4 text-[#0071e3] accent-[#0071e3]" />
                      <span className="text-sm font-medium">Anh</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value="chi" checked={formData.gender === 'chi'} onChange={(e)=>setFormData({...formData, gender: e.target.value})} className="w-4 h-4 text-[#0071e3] accent-[#0071e3]" />
                      <span className="text-sm font-medium">Chị</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input 
                      type="text" placeholder="Nhập họ tên" required
                      value={formData.fullname} onChange={(e)=>setFormData({...formData, fullname: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none transition-colors text-sm"
                    />
                    <input 
                      type="tel" placeholder="Nhập số điện thoại di động" required
                      value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none transition-colors text-sm"
                    />
                  </div>

                  <h3 className="font-bold text-gray-700 mb-4">Địa chỉ giao hàng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tỉnh/Thành phố */}
                    <select required value={formData.province} onChange={handleProvinceChange} className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-[#0071e3]">
                      <option value="">Chọn Tỉnh, Thành phố</option>
                      {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>

                    {/* Quận/Huyện */}
                    <select required value={formData.district} onChange={handleDistrictChange} disabled={!formData.province} className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-[#0071e3] disabled:bg-gray-100 disabled:cursor-not-allowed">
                      <option value="">Chọn Quận, Huyện</option>
                      {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>

                    {/* Phường/Xã */}
                    <select required value={formData.ward} onChange={handleWardChange} disabled={!formData.district} className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-[#0071e3] disabled:bg-gray-100 disabled:cursor-not-allowed">
                      <option value="">Chọn Phường, Xã</option>
                      {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>

                    {/* Số nhà, tên đường */}
                    <input type="text" required placeholder="Số nhà, tên đường" value={formData.street} onChange={(e)=>setFormData({...formData, street: e.target.value})} className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-[#0071e3]" />
                  </div>
                </div>
              )}

              {/* Ô Nhập ghi chú */}
              <input type="text" placeholder="Lưu ý, yêu cầu khác (Không bắt buộc)" value={formData.note} onChange={(e)=>setFormData({...formData, note: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-[#0071e3] mb-6" />

              <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
                <span className="font-bold text-gray-800 text-lg">Tổng tiền:</span>
                <span className="text-2xl font-black text-[#e30019]">{totalPrice.toLocaleString('vi-VN')}<span className="underline ml-1">đ</span></span>
              </div>

              <button type="submit" className="w-full bg-[#e30019] hover:bg-red-700 text-white font-black py-4 rounded-lg uppercase tracking-wider transition-colors shadow-lg shadow-red-500/30">
                TIẾP TỤC ĐẾN THANH TOÁN
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">Bạn có thể chọn hình thức thanh toán ở bước sau</p>
            </form>
          )}

          {/* Bước 2: CHỌN MÃ GIẢM GIÁ VÀ PHƯƠNG THỨC THANH TOÁN */}
          {step === 2 && (
            <div className="p-5 md:p-8">
              
              {/* --- DANH SÁCH MÃ GIẢM GIÁ --- */}
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                Mã giảm giá của bạn
              </h2>
              <div className="mb-8">
                {availableCoupons.length === 0 ? (
                  <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-xl border border-gray-100">
                    Chưa có mã giảm giá nào khả dụng cho đơn hàng này.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {availableCoupons.map(coupon => {
                      // Kiểm tra xem đơn hàng có đủ điều kiện dùng mã này không
                      const isEligible = totalPrice >= coupon.minOrderValue;

                      return (
                        <label 
                          key={coupon._id} 
                          className={`flex items-start p-4 border rounded-xl transition-all ${
                            !isEligible ? 'opacity-60 cursor-not-allowed border-gray-200 bg-gray-50' 
                            : selectedCoupon?._id === coupon._id ? 'border-[#0071e3] bg-blue-50/50 shadow-sm cursor-pointer' 
                            : 'border-gray-200 hover:bg-gray-50 cursor-pointer'
                          }`}
                        >
                          <input
                            type="radio"
                            name="couponSelect"
                            disabled={!isEligible}
                            checked={selectedCoupon?._id === coupon._id}
                            onChange={() => setSelectedCoupon(coupon)}
                            className="mt-1 w-4 h-4 text-[#0071e3] accent-[#0071e3] disabled:cursor-not-allowed"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-gray-800 uppercase bg-white border border-gray-200 px-2 py-0.5 rounded text-sm shadow-sm">
                                {coupon.code}
                              </span>
                              <span className="text-[#e30019] font-bold text-sm">
                                {coupon.discountType === 'FIXED' 
                                  ? `- ${coupon.discountValue.toLocaleString('vi-VN')}đ` 
                                  : `- ${coupon.discountValue}%`}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5">
                              Đơn tối thiểu {coupon.minOrderValue.toLocaleString('vi-VN')}đ
                              {coupon.maxDiscountAmount ? `. Giảm tối đa ${coupon.maxDiscountAmount.toLocaleString('vi-VN')}đ` : ''}
                            </p>
                            {!isEligible && (
                              <p className="text-xs text-red-500 mt-1">Mua thêm {(coupon.minOrderValue - totalPrice).toLocaleString('vi-VN')}đ để sử dụng mã này.</p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                    {selectedCoupon && (
                      <button onClick={() => setSelectedCoupon(null)} className="text-sm text-red-500 hover:underline mt-2 font-medium">
                        Bỏ chọn mã
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* --- PHƯƠNG THỨC THANH TOÁN --- */}
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="text-[#0071e3]" /> Chọn phương thức thanh toán
              </h2>

              <div className="space-y-4 mb-8"> 
                {/* Thanh toán VNPAY */}
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'VNPAY' ? 'border-[#0071e3] bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={() => setPaymentMethod('VNPAY')} className="w-5 h-5 text-[#0071e3] accent-[#0071e3]" />
                  <div className="ml-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="bg-blue-100 w-fit p-1.5 rounded text-blue-800 font-black text-lg px-2 italic">VN<span className="text-red-500">PAY</span></div>
                    <div>
                      <h4 className="font-bold text-gray-800">Thanh toán Online qua VNPAY</h4>
                      <p className="text-sm text-gray-500">Quét mã QR, Thẻ ATM, Internet Banking.</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* --- TỔNG KẾT TIỀN (Đã tích hợp biến finalPrice) --- */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6 flex flex-col gap-3">
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Tạm tính:</span>
                  <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
                </div>
                
                {selectedCoupon && (
                  <div className="flex justify-between items-center text-green-600 font-medium">
                    <span>Mã giảm giá ({selectedCoupon.code}):</span>
                    <span>- {discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-gray-200 mt-2 pt-4">
                  <span className="font-bold text-gray-800 text-lg">Tổng thanh toán:</span>
                  <span className="text-3xl font-black text-[#e30019]">{finalPrice.toLocaleString('vi-VN')}<span className="underline ml-1">đ</span></span>
                </div>
              </div>

              <button 
                onClick={handleSubmitOrder} 
                disabled={isLoading} 
                className="w-full bg-[#e30019] hover:bg-red-700 disabled:bg-gray-400 text-white font-black py-4 rounded-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
              >
                {isLoading ? <><Loader2 size={24} className="animate-spin" /> Đang xử lý...</> : 'XÁC NHẬN ĐẶT HÀNG'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Checkout;