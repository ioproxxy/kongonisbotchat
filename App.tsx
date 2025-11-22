import React, { useState, useEffect, useRef } from 'react';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import { Message } from './types';
import { ChatMessage } from './components/ChatMessage';
import { MenuModal } from './components/MenuModal';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initial greeting
  useEffect(() => {
    if (!hasInitialized.current) {
      initializeChat();
      // Add initial greeting
      setMessages([
        {
          id: 'init-1',
          role: 'model',
          text: "Welcome to Kongoni's! I'm the barman. Have a seat. What can I get you to drink? We've got plenty of cold ones.",
          timestamp: new Date(),
        },
      ]);
      hasInitialized.current = true;
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userText);
      
      const newModelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, newModelMsg]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200 relative overflow-hidden">
      {/* Background ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-full shadow-lg shadow-amber-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m8-2a2 2 0 104 0m-4 0a2 2 0 11-4 0m6-10V9a2 2 0 00-2-2h-1a2 2 0 00-2 2v1m-4 0a2 2 0 11-4 0m4 0v1m-4 0v1" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-marker text-amber-500 leading-none">Kongoni's</h1>
              <p className="text-xs text-slate-400">Best drinks in town</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-sm font-bold text-amber-500 hover:text-amber-400 border border-amber-500/50 hover:border-amber-500 rounded-lg px-3 py-1.5 transition-all"
          >
            See Menu
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto p-4 overflow-y-auto pb-32">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-slate-700 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-600 flex items-center space-x-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's the price of..."
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-none h-[52px] max-h-32 scrollbar-hide"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-3 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 h-[52px] w-[52px] flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </footer>

      {/* Modal */}
      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}

export default App;