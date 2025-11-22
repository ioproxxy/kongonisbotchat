import React from 'react';
import { MENU_ITEMS } from '../constants';
import { MenuItem } from '../types';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Group items by category
  const groupedMenu = MENU_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl border border-amber-500/30 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 rounded-t-xl">
          <h2 className="text-2xl font-marker text-amber-500">The Full Menu</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xl font-bold text-amber-400 mb-3 uppercase tracking-wider border-b border-amber-500/20 pb-1 inline-block">
                {category}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <div key={item.item} className="bg-slate-700/50 p-3 rounded-lg border border-slate-700 hover:border-amber-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-200">{item.item}</span>
                      <span className="font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded text-sm">{item.price}</span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-400 mt-1 italic">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900 rounded-b-xl text-center text-slate-500 text-sm">
          * Prices subject to change based on bartender's mood.
        </div>
      </div>
    </div>
  );
};