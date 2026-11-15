import React from 'react';
import { Bell, CheckCheck, X, ShieldAlert, ArrowDownLeft, Send } from 'lucide-react';
import { UserAccount } from '../types/index.ts';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  user,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Biometric Access Authorized',
      desc: 'Face ID confirmed signature for session token.',
      time: '12 mins ago',
      icon: ShieldAlert,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 2,
      title: 'Real Estate Dividend Received',
      desc: '+$2,600,000 credit posted to account balance.',
      time: 'Nov 08, 2026',
      icon: ArrowDownLeft,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 3,
      title: 'Corporate Wire Release',
      desc: 'Annual insurance premium tranche dispatched.',
      time: 'Nov 05, 2026',
      icon: Send,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-emerald-300" />
            <h3 className="text-base font-bold">Inbox & Security Alerts</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:bg-slate-100/70 transition-colors"
            >
              <div className={`p-2 rounded-xl shrink-0 ${n.color}`}>
                <n.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
          <button
            onClick={onClearAll}
            className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
