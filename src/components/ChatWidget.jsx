import React, { useState, useEffect, useContext, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Image as ImageIcon, Smile } from 'lucide-react';
import { io } from 'socket.io-client';
import { AppContext } from '../context/AppContext';
import { chatApi } from '../services/chatApi';
import { toast } from 'react-toastify';

const ChatWidget = () => {
  const { user, isChatOpen, setIsChatOpen, chatProduct, setChatProduct } = useContext(AppContext);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); 
  const isChatOpenRef = useRef(isChatOpen);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
    if (isChatOpen) {
      setUnreadCount(0);
    }
  }, [isChatOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen, chatProduct]);

  // SỬA LẠI ĐOẠN NÀY: Giữ Socket luôn kết nối dù đóng hay mở khung chat
  useEffect(() => {
    // Chỉ kết nối khi có user đăng nhập, và user KHÔNG PHẢI là admin
    if (user && user.role !== 'admin' && user.role?.name !== 'admin') {
      socketRef.current = io("http://localhost:3000");

      const initChat = async () => {
        setIsLoading(true);
        try {
          const chatRes = await chatApi.createChat();
          const currentChatId = chatRes.data.chat._id;
          setChatId(currentChatId);
          socketRef.current.emit("join_chat", currentChatId);

          const msgRes = await chatApi.getMessages(currentChatId);
          // FIX LỖI SỐ 1: Đổi .message thành .messages (có s) để lấy được lịch sử
          setMessages(msgRes.data.messages || []);
        } catch (error) {
          console.error("Lỗi khởi tạo chat:", error);
        } finally {
          setIsLoading(false);
        }
      };

      initChat();

      socketRef.current.on("receive_message", (data) => {
        // FIX LỖI SỐ 2: Chống nhân đôi tin nhắn bên phía User
        setMessages((prev) => {
           if (prev.some(m => m._id === data._id)) return prev;
           return [...prev, data];
        });

        // Báo số đỏ (Unread Count) hoạt động cực mượt vì Socket không bị ngắt nữa
        if (!isChatOpenRef.current) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [user]); // Bỏ isChatOpen ra khỏi danh sách theo dõi

  // HÀM XỬ LÝ ẢNH
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    if (img.startsWith('http')) return img;
    return `http://localhost:3000/images/${img.replace(/^\/+/, '').replace('images/', '')}`;
  };

  // HÀM FORMAT THỜI GIAN (VD: 14:30)
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const tempMessage = newMessage;
    const tempComputerId = chatProduct ? chatProduct._id : null;
    
    setNewMessage(''); 

    try {
      const res = await chatApi.sendMessage(chatId, { 
        content: tempMessage,
        computerId: tempComputerId
      });
      const savedMessage = res.data.message;

      // Nạp thêm thông tin computer vào tin nhắn vừa gửi để UI hiển thị ngay lập tức
      const messageToEmit = {
        ...savedMessage,
        chatId: chatId,
        computer: chatProduct ? { 
            _id: chatProduct._id, 
            name: chatProduct.name, 
            price: chatProduct.price, 
            image: chatProduct.image 
        } : null
      };

      socketRef.current.emit("send_message", messageToEmit);
      
      // Gửi xong thì xóa thông tin sản phẩm đang đính kèm đi
      if (chatProduct) setChatProduct(null);
      
    } catch (error) {
      toast.error("Không thể gửi tin nhắn");
      setNewMessage(tempMessage); 
    }
  };

  if (!user) return null; 
  
  if (user.role === 'admin' || user.role?.name === 'admin') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      {isChatOpen && (
        <div className="bg-white w-[360px] h-[550px] rounded-2xl shadow-2xl border border-gray-200 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex justify-between items-center text-white shadow-sm z-10">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse border border-white"></div>
              <span className="font-bold text-lg">BUILDVN Chat</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:text-gray-200 transition-colors bg-white/10 p-1.5 rounded-full">
              <X size={20} />
            </button>
          </div>

          {/* Cảnh báo */}
          <div className="bg-[#fff8e1] px-4 py-2 text-[11px] text-[#ff8f00] text-center border-b border-[#ffe082]">
            LƯU Ý: Tuyệt đối không chuyển tiền hoặc giao dịch bên ngoài hệ thống để tránh bị lừa đảo!
          </div>

          {/* Vùng hiển thị tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-600" size={24} />
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm text-center">
                <MessageCircle size={40} className="mb-2 opacity-50 text-cyan-500" />
                <p>Chưa có tin nhắn nào.<br/>Hãy gửi lời chào đến Shop!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMine = msg.senderRole === user.role?.name || msg.senderRole === 'user';
                return (
                  <div key={msg._id || index} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-full`}>
                    
                    {/* Nếu tin nhắn có đính kèm Máy tính -> Hiển thị Card máy tính */}
                    {msg.computer && (
                        <div className={`mb-1.5 p-2 rounded-xl flex items-center gap-3 w-[260px] shadow-sm border ${isMine ? 'bg-cyan-50 border-cyan-100' : 'bg-white border-gray-100'}`}>
                            <img src={getImageUrl(msg.computer.image)} alt={msg.computer.name} className="w-12 h-12 object-cover rounded bg-white border border-gray-100" />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold text-gray-800 truncate">{msg.computer.name}</p>
                                <p className="text-xs font-bold text-[#ee4d2d] mt-0.5">{msg.computer.price?.toLocaleString('vi-VN')} đ</p>
                            </div>
                        </div>
                    )}

                    {/* Nội dung tin nhắn & Thời gian */}
                    <div className="flex items-end gap-1.5">
                        {isMine && <span className="text-[10px] text-gray-400 mb-0.5">{formatTime(msg.createdAt)}</span>}
                        <div className={`max-w-[260px] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm break-words ${
                            isMine ? 'bg-cyan-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                        }`}>
                            {msg.content}
                        </div>
                        {!isMine && <span className="text-[10px] text-gray-400 mb-0.5">{formatTime(msg.createdAt)}</span>}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Khung nhập tin */}
          <div className="bg-white border-t border-gray-200">
            
            {/* THẺ ĐÍNH KÈM SẢN PHẨM (Nổi lên khi bấm từ ProductDetail) */}
            {chatProduct && (
                <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-start relative">
                    <div className="text-[12px] text-gray-500 absolute -top-3 left-3 bg-white px-2 border border-gray-200 rounded-full shadow-sm font-medium">Bạn đang hỏi về sản phẩm này</div>
                    <div className="flex gap-3 items-center mt-2">
                        <img src={getImageUrl(chatProduct.image)} className="w-10 h-10 object-cover rounded border border-gray-200" alt=""/>
                        <div>
                            <p className="text-[13px] font-bold text-gray-800 line-clamp-1">{chatProduct.name}</p>
                            <p className="text-[12px] font-bold text-[#ee4d2d]">{chatProduct.price?.toLocaleString('vi-VN')} đ</p>
                        </div>
                    </div>
                    <button onClick={() => setChatProduct(null)} className="text-gray-400 hover:text-red-500 mt-2">
                        <X size={18}/>
                    </button>
                </div>
            )}

            {/* Form chat */}
            <form onSubmit={handleSendMessage} className="p-3 flex items-center gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={chatProduct ? "Nhập câu hỏi của bạn..." : "Nhập tin nhắn..."} 
                className="flex-1 bg-gray-100 px-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim() && !chatProduct}
                className="p-2.5 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* nút bong bóng */}
      {!isChatOpen && (
        <div className="relative">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 hover:scale-110 transition-transform active:scale-95"
          >
            <MessageCircle size={28} />
          </button>

          {/* Thông báo (Chỉ hiển thị khi unreadCount > 0 )*/}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e30019] text-[11px] font-bold text-white shadow-md animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;