import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { Send, MessageSquare, Search, User } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminChat = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Lấy ảnh 
  const getImageUrl = (img) => {
    if (!img) return 'https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg'; // Ảnh mặc định
    if (img.startsWith('http')) return img;
    return `http://localhost:3000/images/${img.replace(/^\/+/, '').replace('images/', '')}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/chats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const chatList = res.data.chats || [];
        setChats(chatList);

        chatList.forEach(chat => {
          socketRef.current.emit("join_chat", chat._id);
        });
      } catch (error) {
        toast.error("Lỗi tải danh sách tin nhắn");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    socketRef.current.on("receive_message", (data) => {
      setChats(prevChats => {
        let updatedChats = [...prevChats];
        const chatIndex = updatedChats.findIndex(c => c._id === data.chatId);
        
        if (chatIndex > -1) {
          updatedChats[chatIndex].lastMessage = data.content;
          updatedChats[chatIndex].lastUpdatedAt = new Date(); 
          updatedChats.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt));
        }
        return updatedChats;
      });

      setActiveChat(prevActive => {
        if (prevActive && prevActive._id === data.chatId) {
          setMessages(prevMsgs => {
             // Kẻ gác cổng: Nếu tin nhắn có ID này đã tồn tại rồi thì bỏ qua
             const isExist = prevMsgs.some(m => m._id === data._id);
             if (isExist) return prevMsgs;
             
             // Nếu là tin nhắn mới thì mới thêm vào danh sách
             return [...prevMsgs, data];
          });
        }
        return prevActive;
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/api/chats/messages/${chat._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages || []);
    } catch (error) {
      toast.error("Lỗi tải nội dung tin nhắn");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const tempMessage = newMessage;
    setNewMessage('');

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await axios.post(`http://localhost:3000/api/chats/send/${activeChat._id}`, 
        { content: tempMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedMessage = res.data.message;
      const messageToEmit = { ...savedMessage, chatId: activeChat._id };

      socketRef.current.emit("send_message", messageToEmit);
    } catch (error) {
      toast.error("Không thể gửi tin nhắn");
      setNewMessage(tempMessage);
    }
  };

  // Lọc danh sách chat
  const filteredChats = chats.filter(chat => {
    // Chỉ hiển thị người đã từng nhắn tin
    if (!chat.lastMessage) return false;
    
    // Không hiển thị account Admin tự chat
    const role = chat.user?.role?.name || chat.user?.role;
    if (role === 'admin') return false;

    // Lọc theo thanh tìm kiếm
    const searchLower = searchTerm.toLowerCase();
    const userName = (chat.user?.fullname || chat.user?.username || 'Khách hàng').toLowerCase();
    return userName.includes(searchLower);
  });

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-6 md:p-8 h-[calc(100vh-60px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
          <MessageSquare className="text-cyan-600" size={28} /> Quản lý Tin nhắn
        </h1>
        <p className="text-gray-500 font-medium mt-1">Hỗ trợ và tư vấn khách hàng trực tiếp</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
        
        {/* CỘT TRÁI: DANH SÁCH KHÁCH HÀNG */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên khách hàng..." 
                className="w-full bg-gray-100 pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none focus:ring-1 focus:ring-cyan-500" 
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredChats.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">Không tìm thấy cuộc hội thoại nào</div>
            ) : (
                filteredChats.map(chat => (
                <div 
                    key={chat._id} 
                    onClick={() => handleSelectChat(chat)}
                    className={`p-4 cursor-pointer transition-colors flex items-center gap-3 ${activeChat?._id === chat._id ? 'bg-cyan-50 border-l-4 border-cyan-500' : 'hover:bg-gray-100 border-l-4 border-transparent'}`}
                >
                    {/* Hiển thị Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                        <img src={getImageUrl(chat.user?.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-gray-900 truncate">{chat.user?.fullname || chat.user?.username || 'Khách hàng'}</h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{formatTime(chat.lastUpdatedAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

        {/* Khung chat*/}
        <div className="w-2/3 flex flex-col bg-[#f8fafc]">
          {activeChat ? (
            <>
              {/* Header Khung Chat */}
              <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-white">
                    <img src={getImageUrl(activeChat.user?.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-800 text-lg">{activeChat.user?.fullname || activeChat.user?.username || 'Khách hàng'}</h3>
                 </div>
              </div>

              {/* Body Messages */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                {messages.map((msg, idx) => {
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div key={msg._id || idx} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} max-w-full`}>
                      
                      {msg.computer && (
                        <div className={`mb-1.5 p-2 rounded-xl flex items-center gap-3 w-[260px] shadow-sm border ${isAdmin ? 'bg-cyan-50 border-cyan-100' : 'bg-white border-gray-100'}`}>
                            <img src={getImageUrl(msg.computer.image)} alt="Product" className="w-12 h-12 object-cover rounded bg-white border border-gray-100" />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold text-gray-800 truncate">{msg.computer.name}</p>
                                <p className="text-xs font-bold text-[#ee4d2d] mt-0.5">{msg.computer.price?.toLocaleString('vi-VN')} đ</p>
                            </div>
                        </div>
                      )}

                      <div className="flex items-end gap-1.5">
                          {isAdmin && <span className="text-[10px] text-gray-400 mb-0.5">{formatTime(msg.createdAt)}</span>}
                          <div className={`max-w-[400px] px-4 py-2.5 text-[14.5px] leading-relaxed shadow-sm break-words ${
                              isAdmin ? 'bg-cyan-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm'
                          }`}>
                              {msg.content}
                          </div>
                          {!isAdmin && <span className="text-[10px] text-gray-400 mb-0.5">{formatTime(msg.createdAt)}</span>}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Footer Input */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn phản hồi..." 
                    className="flex-1 bg-gray-100 border-none px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                  <button type="submit" disabled={!newMessage.trim()} className="px-6 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                    Gửi <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <MessageSquare size={64} className="opacity-20 mb-4" />
               <p className="font-bold text-lg text-gray-500">Chọn một cuộc hội thoại</p>
               <p className="text-sm">Bấm vào khách hàng ở danh sách bên trái để bắt đầu chat</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminChat;