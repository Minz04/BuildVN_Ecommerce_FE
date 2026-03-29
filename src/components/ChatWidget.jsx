import React, { useState, useEffect, useContext, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
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
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Cuộn xuống cuối mỗi khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  // Khởi tạo Socket và Load tin nhắn khi mở khung chat
  useEffect(() => {
    if (isChatOpen && user) {
      // Kết nối tới Backend
      socketRef.current = io("http://localhost:3000");

      const initChat = async () => {
        setIsLoading(true);
        try {
          // 1. Lấy hoặc Tạo phòng chat
          const chatRes = await chatApi.createChat();
          const currentChatId = chatRes.data.chat._id;
          setChatId(currentChatId);

          // 2. Vào phòng Socket
          socketRef.current.emit("join_chat", currentChatId);

          // 3. Lấy lịch sử tin nhắn
          const msgRes = await chatApi.getMessages(currentChatId);
          setMessages(msgRes.data.message || []);

        } catch (error) {
          console.error("Lỗi khởi tạo chat:", error);
        } finally {
          setIsLoading(false);
        }
      };

      initChat();

      // 4. Lắng nghe tin nhắn mới từ Socket
      socketRef.current.on("receive_message", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [isChatOpen, user]);

  useEffect(() => {
    if (isChatOpen && chatProduct) {
      setNewMessage(`Cho mình hỏi thêm về sản phẩm: ${chatProduct.name}`);
    }
  }, [isChatOpen, chatProduct]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const tempMessage = newMessage;
    setNewMessage(''); // Xóa ô input ngay cho mượt

    try {
      // 1. Lưu vào Database (Backend)
      const res = await chatApi.sendMessage(chatId, { 
        content: tempMessage,
        computerId: chatProduct ? chatProduct._id : null 
      });
      const savedMessage = res.data.message;

      // 2. Bắn qua Socket để báo cho Admin (hoặc chính mình cập nhật UI)
      socketRef.current.emit("send_message", {
        ...savedMessage,
        chatId: chatId
      });
      
    } catch (error) {
      toast.error("Không thể gửi tin nhắn");
      setNewMessage(tempMessage); // Phục hồi nếu lỗi
    }
  };

  // NẾU CHƯA ĐĂNG NHẬP -> ẨN LUÔN HOẶC HIỆN THÔNG BÁO TÙY BẠN
  if (!user) return null; 

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      {/* KHUNG CHAT (Chỉ hiện khi isChatOpen = true) */}
      {isChatOpen && (
        <div className="bg-white w-[350px] h-[450px] rounded-2xl shadow-2xl border border-gray-200 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="font-bold">Hỗ trợ trực tuyến</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:text-gray-200 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Vùng hiển thị tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-600" size={24} />
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm text-center">
                <MessageCircle size={40} className="mb-2 opacity-50" />
                <p>Chưa có tin nhắn nào.<br/>Hãy gửi lời chào đến Shop nhé!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMine = msg.senderRole === user.role?.name || msg.senderRole === 'user'; // Tùy logic role của bạn
                return (
                  <div key={msg._id || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2 text-sm rounded-2xl ${
                      isMine ? 'bg-cyan-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập tin nhắn */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..." 
              className="flex-1 bg-gray-100 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="p-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* NÚT BONG BÓNG (Luôn nổi) */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 hover:scale-110 transition-transform active:scale-95"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;