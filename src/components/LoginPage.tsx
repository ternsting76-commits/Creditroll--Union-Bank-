import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ScanFace, Fingerprint, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { UserAccount } from '../types/index.ts';
import { CredrollLogo } from './CredrollLogo.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { BiometricModal } from './BiometricModal.tsx';
import { sounds } from '../utils/audio.ts';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  onGoToRegister: () => void;
  onGoToHome: () => void;
  currentUser: UserAccount;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onGoToHome,
  currentUser,
}) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setError(null);

    const cleanAcc = accountNumber.trim().toUpperCase();
    const cleanCurrent = currentUser.accountNumber.trim().toUpperCase();

    if (!cleanAcc) {
      setError('Please enter your account number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    // Allow CR-774902194, 774902194, or registered account number
    if (
      cleanAcc === cleanCurrent ||
      cleanAcc === 'CR-774902194' ||
      cleanAcc === '774902194' ||
      cleanAcc === cleanCurrent.replace('CR-', '')
    ) {
      sounds.playSuccess();
      onLoginSuccess(currentUser);
    } else {
      sounds.playBeep();
      setError('Account number not recognized. Use: ' + currentUser.accountNumber);
    }
  };

  const handleBiometricLogin = () => {
    sounds.playClick();
    setShowBioModal(true);
  };

  const handleBioSuccess = () => {
    setShowBioModal(false);
    sounds.playSuccess();
    onLoginSuccess(currentUser);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-between p-4 sm:p-6 relative">
      {/* Top Header bar with Language selector matching screenshot 11 */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <button
          onClick={onGoToHome}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
        >
          ← Explore Public Bank
        </button>
        <LanguageSelector variant="red" />
      </div>

      {/* Main Sign In Modal Card matching screenshot 11 */}
      <div className="max-w-md w-full mx-auto my-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100 space-y-6">
        {/* Title & Subtitle */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Sign In</h1>
          <p className="text-xs text-slate-500">Log in to your account to continue.</p>
        </div>

        {/* Central Geometric Credroll Logo in Red matching screenshot 11 */}
        <div className="flex justify-center py-2">
          <CredrollLogo variant="crimson" showText={false} size="lg" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Number */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Account Number
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Account number"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}

          {/* Primary Log In Button - matching royal blue in screenshot 11 */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#3b59ff] hover:bg-[#2b49ef] text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="grow border-t border-slate-200" />
          <span className="shrink mx-3 text-[11px] uppercase font-bold text-slate-400">
            or instant access
          </span>
          <div className="grow border-t border-slate-200" />
        </div>

        {/* Biometric Quick Login with Amelia Robert Picture */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleBiometricLogin}
            className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 font-bold text-xs transition-all flex items-center justify-between cursor-pointer shadow-xs group"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-800">{currentUser.name}</span>
                <span className="block text-[10px] text-slate-400 font-normal">Face ID / Touch ID Enrolled</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ScanFace className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Biometric Login</span>
            </div>
          </button>
        </div>

        {/* Register Account Link */}
        <div className="pt-2 text-center border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an online banking account?{' '}
            <button
              onClick={onGoToRegister}
              className="font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
            >
              Register with Biometrics
            </button>
          </p>
        </div>
      </div>

      {/* Footer copyright matching screenshot 10 */}
      <div className="text-center py-3 text-xs text-slate-400">
        Copyright © 2021 - 2026 Credroll Credit Union. All rights reserved.
      </div>

      {/* Biometric Scan Trigger Modal */}
      {showBioModal && (
        <BiometricModal
          isOpen={showBioModal}
          onClose={() => setShowBioModal(false)}
          onSuccess={handleBioSuccess}
          title="Biometric Login"
          subtitle={`Verifying biometric profile for ${currentUser.name}`}
          userName={currentUser.name}
          mode="authenticate"
        />
      )}
    </div>
  );
};
