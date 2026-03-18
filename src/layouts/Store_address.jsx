import React, { useState } from 'react';
import { Truck, RefreshCcw, CreditCard, Headphones, MapPin, Phone, Mail, Map } from 'lucide-react';
import { mockShowrooms } from '../mock/storeData';

const Store_address = () => {
  const [showrooms, setShowrooms] = useState(mockShowrooms);

  return (
    <div className="w-full">

      {/* CHÍNH SÁCH BÁN HÀNG - Đồng bộ nền pattern với Home */}
      <section className="bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Box 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-[0_10px_20px_rgba(6,182,212,0.1)] hover:-translate-y-1 transition-all duration-300">
              <div className="bg-cyan-50 p-4 rounded-full text-cyan-600 flex-shrink-0">
                <Truck size={32} />
              </div>
              <div>
                <h4 className="font-bold text-[15px] uppercase text-gray-900 mb-1">
                  Chính sách giao hàng
                </h4>
                <p className="text-[14px] text-gray-500 font-medium">
                  Nhận hàng và thanh toán tại nhà
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-[0_10px_20px_rgba(6,182,212,0.1)] hover:-translate-y-1 transition-all duration-300">
              <div className="bg-cyan-50 p-4 rounded-full text-cyan-600 flex-shrink-0">
                <RefreshCcw size={32} />
              </div>
              <div>
                <h4 className="font-bold text-[15px] uppercase text-gray-900 mb-1">
                  Đổi trả dễ dàng
                </h4>
                <p className="text-[14px] text-gray-500 font-medium">
                  1 đổi 1 trong 15 ngày
                </p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-[0_10px_20px_rgba(6,182,212,0.1)] hover:-translate-y-1 transition-all duration-300">
              <div className="bg-cyan-50 p-4 rounded-full text-cyan-600 flex-shrink-0">
                <CreditCard size={32} />
              </div>
              <div>
                <h4 className="font-bold text-[15px] uppercase text-gray-900 mb-1">
                  Thanh toán tiện lợi
                </h4>
                <p className="text-[14px] text-gray-500 font-medium">
                  Tiền mặt, chuyển khoản, trả góp 0%
                </p>
              </div>
            </div>

            {/* Box 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-[0_10px_20px_rgba(6,182,212,0.1)] hover:-translate-y-1 transition-all duration-300">
              <div className="bg-cyan-50 p-4 rounded-full text-cyan-600 flex-shrink-0">
                <Headphones size={32} />
              </div>
              <div>
                <h4 className="font-bold text-[15px] uppercase text-gray-900 mb-1">
                  Hỗ trợ nhiệt tình
                </h4>
                <p className="text-[14px] text-gray-500 font-medium">
                  Tư vấn và giải đáp mọi thắc mắc
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SHOWROOM - Chuyển sang phong cách Modern Slate, bỏ cắt xéo */}
      <section className="bg-slate-900 py-16 text-white relative border-t border-slate-800">
        <div className="container mx-auto px-4 relative z-10">

          {/* Tiêu đề */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase inline-block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider">
              Hệ thống showroom BUILDVN
            </h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
          </div>

          {/* Grid showroom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {showrooms.map((room) => (
              <div key={room.id} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-7 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 flex flex-col gap-5">

                {/* Header showroom đơn giản, sang trọng */}
                <h3 className="font-bold text-[18px] uppercase text-cyan-400 border-b border-slate-700 pb-3">
                  {room.name}
                </h3>

                {/* Thông tin */}
                <ul className="space-y-4 text-[15px] text-gray-300">
                  <li className="flex gap-3 items-start">
                    <MapPin size={18} className="text-cyan-500 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">Địa chỉ: {room.address}</span>
                  </li>

                  <li className="flex gap-3 items-start">
                    <Phone size={18} className="text-cyan-500 flex-shrink-0 mt-0.5" />
                    <span>Số điện thoại: <span className="text-white font-medium">{room.phone}</span></span>
                  </li>

                  <li className="flex gap-3 items-start">
                    <Mail size={18} className="text-cyan-500 flex-shrink-0 mt-0.5" />
                    <span>Email: {room.email}</span>
                  </li>

                  <li className="flex gap-3 items-center pt-2">
                    <Map size={18} className="text-cyan-500 flex-shrink-0" />
                    <a
                      href={room.mapLink}
                      className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline underline-offset-4 transition-colors"
                    >
                      Xem bản đồ đường đi &rarr;
                    </a>
                  </li>
                </ul>

              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Store_address;