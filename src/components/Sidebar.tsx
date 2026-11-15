import React from 'react';
import {
  Home,
  CreditCard,
  Receipt,
  Send,
  PlusCircle,
  FileQuestion,
  Settings,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';
import { UserAccount } from '../types/index.ts';
import { sounds } from '../utils/audio.ts';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  user,
  currentTab,
  onSelectTab,
  onLogout,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'cards', label: 'View Card', icon: CreditCard },
    { id: 'transactions', label: 'Transaction', icon: Receipt },
    { id: 'transfer', label: 'Instant Transfer', icon: Send },
    { id: 'deposit', label: 'Deposit Funds', icon: PlusCircle },
    { id: 'services', label: 'Service Requests', icon: FileQuestion },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    sounds.playClick();
    onSelectTab(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer matching screenshot 18 */}
      <aside className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
        <div>
          {/* Header textured banner with avatar matching screenshot 18 */}
          <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 text-white p-6 pb-8 text-center overflow-hidden">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Subtle background lines */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Avatar matching screenshot 18 */}
            <div className="relative inline-block mx-auto mt-2 mb-3">
              <div className="w-20 h-20 rounded-full p-1 bg-white/30 backdrop-blur-md shadow-xl">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            {/* User Details */}
            <h3 className="text-base font-extrabold tracking-wide uppercase text-white drop-shadow-xs">
              {user.name}
            </h3>
            <span className="text-xs text-blue-200 font-medium capitalize block mt-0.5">
              {user.role}
            </span>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-blue-100 backdrop-blur-xs">
              {user.accountNumber}
            </span>
          </div>

          {/* Navigation Links matching screenshot 18 */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2b50ed] text-white shadow-md shadow-blue-600/30 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Log out button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
