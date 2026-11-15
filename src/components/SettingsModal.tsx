import React from 'react';
import { Settings, ShieldCheck, ScanFace, Fingerprint, RotateCcw, X, Moon, Bell } from 'lucide-react';
import { UserAccount } from '../types/index.ts';
import { sounds } from '../utils/audio.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onUpdateUser: (u: UserAccount) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onResetData,
}) => {
  if (!isOpen) return null;

  const handleToggleBio = () => {
    sounds.playClick();
    onUpdateUser({
      ...user,
      hasBiometrics: !user.hasBiometrics,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-emerald-300" />
            <h3 className="text-base font-bold">Account Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800">Biometric & Security Controls</h4>

            <div className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ScanFace className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-bold text-slate-800">Biometric Authorization</p>
                  <p className="text-[10px] text-slate-400">Require Face ID / Touch ID for wire transfers</p>
                </div>
              </div>
              <button
                onClick={handleToggleBio}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  user.hasBiometrics ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    user.hasBiometrics ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-800">Data Management</h4>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Reset Initial State</p>
                <p className="text-[10px] text-slate-500">Restore Amelia Robert with $4,990,000.00 & seed history</p>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  onResetData();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
