import React, { useState } from 'react';
import { Send, Bot, User, Plus, Menu, X } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isUser: false },
    { id: 2, text: "Hi! I have a question", isUser: true },
  ]);
  
  const [chats, setChats] = useState([
    { id: 1, name: "General Chat", active: true },
    { id: 2, name: "Support Chat", active: false },
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: inputText,
      isUser: true
    }]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Thanks for your message! This is a simulated response.",
        isUser: false
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-[400px] bg-gray-100">
      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'block' : 'hidden'} 
        md:block
        w-64 
        bg-white border-r
        flex flex-col
      `}>
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Chats</h2>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Plus size={20} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {chats.map(chat => (
            <div 
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${chat.active ? 'bg-blue-50' : ''}`}
            >
              {chat.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b flex-shrink-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="font-semibold">AI Chat</h1>
          <div className="w-8" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto min-h-0">
          {messages.map(msg => (
            <div key={msg.id} className={`flex mb-4 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-start max-w-[80%]">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-2 
                  ${msg.isUser ? 'bg-blue-500 order-last ml-2' : 'bg-gray-500'}`}>
                  {msg.isUser ? <User size={18} color="white" /> : <Bot size={18} color="white" />}
                </div>
                <div className={`px-4 py-2 rounded-lg break-words 
                  ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex space-x-2 p-4">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white flex-shrink-0">
          <form onSubmit={handleSend} className="flex space-x-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center space-x-2 whitespace-nowrap
                ${(!inputText.trim() || isLoading) ? 'opacity-50' : 'hover:bg-blue-600'}`}
            >
              <span className="hidden sm:inline">Send</span>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;