import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-md ${
          isUser
            ? 'bg-amber-600 text-white rounded-br-none'
            : 'bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600'
        }`}
      >
        <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.text}
        </div>
        <div className={`text-[10px] mt-1 opacity-70 ${isUser ? 'text-amber-100' : 'text-slate-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};