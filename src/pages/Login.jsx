import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Phone, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { authApi } from '../services/authApi';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext); 

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = 'Vui lòng nhập email';
      else if (!emailRegex.test(value)) error = 'Email không đúng định dạng';
    }
    if (name === 'password' && !value) {
      error = 'Vui lòng nhập mật khẩu';
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailErr = validateField('email', formData.email);
    const passErr = validateField('password', formData.password);
    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setIsLoading(true);

    authApi.login({
      email: formData.email.trim(),
      password: formData.password
    })
    authApi.login({
      email: formData.email.trim(),
      password: formData.password
    })
    .then(response => {
      // Xử lý token và user từ response.
      const tokenToSave = response.data.token || response.data.accessToken; 
      const userToSave = response.data.user;

      // Kiểm tra nếu không nhận được token thì không tiếp tục và hiển thị lỗi
      if (!tokenToSave) {
         toast.error("Lỗi: Không nhận được Token từ Backend!");
         return;
      }

      // Lưu token và user vào localStorage hoặc sessionStorage
      if (formData.rememberMe) {
        localStorage.setItem('token', tokenToSave);
        localStorage.setItem('user', JSON.stringify(userToSave));
      } else {
        sessionStorage.setItem('token', tokenToSave);
        sessionStorage.setItem('user', JSON.stringify(userToSave));
      }

      // Cập nhật user vào context để các component khác biết đã đăng nhập
      setUser(userToSave); 
      toast.success('Đăng nhập thành công!');
      navigate('/');
    })
    .catch(error => {
      const errorMessage = error.response?.data?.message || 'Sai tài khoản hoặc mật khẩu';
      toast.error(errorMessage);
    })
    .finally(() => setIsLoading(false));
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="max-w-[734px] w-full bg-white rounded-xl sm:p-20 p-6 shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-4xl font-extrabold text-cyan-500 italic tracking-tighter mb-6">
            BUILDVN<span className="text-gray-900">VN</span>
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Log in to BUILDVN</h2>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-[320px] mx-auto mb-8">
          <button className="flex items-center justify-center gap-3 w-full py-3 px-6 rounded-full border border-gray-300 hover:border-gray-800 text-gray-700 font-bold transition-colors bg-white">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <button className="flex items-center justify-center gap-3 w-full py-3 px-6 rounded-full border border-gray-300 hover:border-gray-800 text-gray-700 font-bold transition-colors bg-white">
            <Phone size={20} className="text-gray-700" />
            Continue with phone number
          </button>
        </div>

        <div className="flex items-center w-full max-w-[320px] mx-auto mb-8">
          <div className="flex-grow h-[1px] bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-500 font-medium">OR</span>
          <div className="flex-grow h-[1px] bg-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-[320px] mx-auto flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-900">
              Email address <span className="text-red-500 ml-1">*</span>
            </label>
            <input 
              type="email" name="email" placeholder="name@domain.com"
              value={formData.email} onChange={handleChange} onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-white border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors
                ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 hover:border-gray-400'}`}
            />
            {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-sm font-bold text-gray-900">
              Password <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} name="password" placeholder="Password"
                value={formData.password} onChange={handleChange} onBlur={handleBlur}
                className={`w-full px-4 py-3 bg-white border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors pr-12
                  ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 hover:border-gray-400'}`}
              />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password}</span>}
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" name="rememberMe"
                checked={formData.rememberMe} onChange={handleChange}
                className="w-4 h-4 text-cyan-500 rounded border-gray-300 focus:ring-cyan-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>
            <button type="button" onClick={() => toast.info('Vui lòng liên hệ Hotline: 098.655.2233 hoặc Admin để được cấp lại mật khẩu mới.')} 
              className="text-gray-600 hover:text-cyan-600 hover:underline font-semibold text-sm transition-colors"
            >
              Forgot your password?
            </button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 mt-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-400 text-white font-bold rounded-full transition-all flex justify-center items-center gap-2 shadow-md shadow-cyan-500/30"
          >
            {isLoading ? (
              <><Loader2 size={20} className="animate-spin" /> Đang xử lý...</>
            ) : "Log In"}
          </button>
        </form>

        <div className="flex items-center w-full max-w-[734px] mx-auto mt-10 mb-8">
          <div className="flex-grow h-[1px] bg-gray-200"></div>
        </div>

        <div className="text-center text-gray-600 font-medium flex justify-center items-center gap-2">
          Don't have an account? 
          <Link to="/register" className="text-cyan-600 font-bold hover:text-cyan-700 hover:underline transition-colors">
            Sign up for BUILDVN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;