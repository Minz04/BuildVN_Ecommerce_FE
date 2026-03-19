import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
// XÓA DÒNG NÀY: import { mockAuthAPI } from '../mock/authMock'; 
// THÊM DÒNG NÀY:
import { authApi } from '../services/authApi'; 

// FIX LỖI VĂNG FOCUS: Di chuyển InputField ra ngoài Component chính
const InputField = ({ label, type, name, placeholder, value, onChange, onBlur, error }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-bold text-gray-900">
      {label} <span className="text-red-500 ml-1">*</span>
    </label>
    <input 
      type={type} name={name} placeholder={placeholder}
      value={value} onChange={onChange} onBlur={onBlur}
      className={`w-full px-4 py-3 bg-white border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors
        ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 hover:border-gray-400'}`}
    />
    {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullname: '', username: '', email: '', phone: '', address: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const getPasswordStrength = (pass) => {
    if (!pass) return { width: 'w-0', color: 'bg-gray-200', text: '' };
    let strength = 0;

    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;

    if (strength <= 2) {
      return { width: 'w-1/3', color: 'bg-red-500', text: 'Yếu' };
    }
    if (strength === 3 || strength === 4) {
      return { width: 'w-2/3', color: 'bg-yellow-500', text: 'Trung bình' };
    }
    return { width: 'w-full', color: 'bg-green-500', text: 'Mạnh' };
  };
  const passStrength = getPasswordStrength(formData.password);

  const validateField = (name, value) => {
    let error = '';
    if (!value) return 'Vui lòng không để trống trường này';
    
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = 'Email không hợp lệ (VD: name@domain.com)';
    }

    if (name === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!passwordRegex.test(value)) {
        error = 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt';
      }
    }

    if (name === 'confirmPassword' && value !== formData.password) {
      error = 'Mật khẩu xác nhận không khớp';
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    
    if (name === 'password' && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let newErrors = {};
    let hasError = false;
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) {
        newErrors[key] = err;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    const { confirmPassword, ...registerData } = formData; 

    // GỌI API THẬT
    authApi.register(registerData)
    .then(response => {
      toast.success('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 1500); 
    })
    .catch(error => {
      // Lấy lỗi từ Backend trả về (VD: "Email đã tồn tại")
      const errorMessage = error.response?.data?.message || 'Lỗi kết nối đến máy chủ';
      toast.error(errorMessage);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="max-w-[734px] w-full bg-white rounded-xl sm:p-14 p-6 shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-extrabold text-cyan-500 italic tracking-tighter mb-4">
            BUILD<span className="text-gray-900">VN</span>
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center">Sign up to start shopping</h2>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-[500px] mx-auto flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Full Name" type="text" name="fullname" placeholder="Họ và tên" value={formData.fullname} onChange={handleChange} onBlur={handleBlur} error={errors.fullname} />
            <InputField label="Username" type="text" name="username" placeholder="Tên đăng nhập" value={formData.username} onChange={handleChange} onBlur={handleBlur} error={errors.username} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Email address" type="email" name="email" placeholder="name@domain.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
            <InputField label="Phone number" type="tel" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} onBlur={handleBlur} error={errors.phone} />
          </div>

          <InputField label="Delivery Address" type="text" name="address" placeholder="Địa chỉ giao hàng chi tiết" value={formData.address} onChange={handleChange} onBlur={handleBlur} error={errors.address} />

          {/* Ô Mật khẩu */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-sm font-bold text-gray-900">Create a Password <span className="text-red-500 ml-1">*</span></label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} name="password" placeholder="Mật khẩu (ít nhất 8 ký tự)"
                value={formData.password} onChange={handleChange} onBlur={handleBlur}
                className={`w-full px-4 py-3 bg-white border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors pr-12
                  ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan-500 hover:border-gray-400'}`}
              />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}  
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password}</span>}
            
            {/* Thanh đo độ mạnh mật khẩu */}
            {formData.password && (
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
                  <div className={`h-full transition-all duration-300 ${passStrength.width} ${passStrength.color}`}></div>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase w-16 text-right">{passStrength.text}</span>
              </div>
            )}
          </div>

          {/* Ô Xác nhận mật khẩu */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-sm font-bold text-gray-900">Confirm Password <span className="text-red-500 ml-1">*</span></label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                className={`w-full px-4 py-3 bg-white border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors pr-12
                  ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan-500 hover:border-gray-400'}`}
              />
              <button 
                type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="text-xs text-red-500 font-medium">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full py-3.5 mt-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-400 text-white font-bold rounded-full transition-all flex justify-center items-center gap-2 shadow-md shadow-cyan-500/30"
          >
            {isLoading ? <><Loader2 size={20} className="animate-spin" /> Đang xử lý...</> : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center w-full max-w-[734px] mx-auto mt-8 mb-6">
          <div className="flex-grow h-[1px] bg-gray-200"></div>
        </div>

        <div className="text-center text-gray-600 font-medium flex justify-center items-center gap-2">
          Already have an account? 
          <Link to="/login" className="text-cyan-600 font-bold hover:text-cyan-700 hover:underline transition-colors">
            Log In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;