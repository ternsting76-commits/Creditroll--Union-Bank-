import React from 'react';
import { User, Mail, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { UserAccount } from '../types/index.ts';
import { sounds } from '../utils/audio.ts';

interface ProfileDropdownProps {
  user: UserAccount;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenInbox: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  isOpen,
  onClose,
  onLogout,
  onOpenProfile,
  onOpenInbox,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* User Card Header matching screenshot 17 */}
        <div className="bg-gradient-to-r from-slate-700 to-indigo-900 p-4 text-white flex items-center gap-3">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold tracking-wide uppercase">{user.name}</h4>
            <span className="text-[11px] text-blue-200 capitalize font-medium">{user.role}</span>
          </div>
        </div>

        {/* Options matching screenshot 17 */}
        <div className="p-2 space-y-1">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
              onOpenProfile();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>My Profile</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
              onOpenInbox();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>My Inbox</span>
            </div>
            {user.inboxUnreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {user.inboxUnreadCount}
              </span>
            )}
          </button>

          <div className="border-t border-slate-100 my-1" />

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};
