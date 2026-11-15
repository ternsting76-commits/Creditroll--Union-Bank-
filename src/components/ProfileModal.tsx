import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Copy,
  Check,
  X,
  CreditCard,
  ScanFace,
  Fingerprint,
} from 'lucide-react';
import { UserAccount } from '../types/index.ts';
import { sounds } from '../utils/audio.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onUpdateUser: (user: UserAccount) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (field: string, val: string) => {
    sounds.playBeep();
    navigator.clipboard.writeText(val);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/60 shadow-md"
            />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200">
                Verified Account Holder
              </span>
              <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
              <p className="text-xs text-blue-100 font-mono">{user.accountNumber}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Wire & Clearing Credentials */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Direct Wire & Clearing Instructions
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200/70">
                <div>
                  <span className="text-slate-400 block text-[10px]">Account Number</span>
                  <span className="font-mono font-bold text-slate-800">{user.accountNumber}</span>
                </div>
                <button
                  onClick={() => handleCopy('acc', user.accountNumber)}
                  className="p-1 text-slate-400 hover:text-blue-600"
                >
                  {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200/70">
                <div>
                  <span className="text-slate-400 block text-[10px]">ABA Routing Transit Number</span>
                  <span className="font-mono font-bold text-slate-800">{user.routingNumber}</span>
                </div>
                <button
                  onClick={() => handleCopy('rt', user.routingNumber)}
                  className="p-1 text-slate-400 hover:text-blue-600"
                >
                  {copiedField === 'rt' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200/70">
                <div>
                  <span className="text-slate-400 block text-[10px]">SWIFT / BIC (International)</span>
                  <span className="font-mono font-bold text-slate-800">{user.swiftBic}</span>
                </div>
                <button
                  onClick={() => handleCopy('swift', user.swiftBic)}
                  className="p-1 text-slate-400 hover:text-blue-600"
                >
                  {copiedField === 'swift' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Security & Biometrics */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Biometric & Security Credentials
            </h4>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <ScanFace className="w-3.5 h-3.5 text-blue-600" /> Face ID Biometrics
              </span>
              <span className="font-bold text-emerald-600">Active (Enrolled)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-blue-600" /> Touch ID Hardware Key
              </span>
              <span className="font-bold text-emerald-600">Active (Hardware Bound)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Account Classification</span>
              <span className="font-bold text-slate-800">{user.tier}</span>
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Direct Contact Information</h4>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
              </span>
              <span className="font-semibold text-slate-800">{user.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Telephone
              </span>
              <span className="font-semibold text-slate-800">{user.phone}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
