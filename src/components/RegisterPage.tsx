import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  DollarSign,
  ScanFace,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building,
  Sparkles,
} from 'lucide-react';
import { UserAccount, BankCard } from '../types/index.ts';
import { CredrollLogo } from './CredrollLogo.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { BiometricModal } from './BiometricModal.tsx';
import { sounds } from '../utils/audio.ts';

interface RegisterPageProps {
  onRegisterComplete: (newUser: UserAccount) => void;
  onGoToLogin: () => void;
  onGoToHome: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterComplete,
  onGoToLogin,
  onGoToHome,
}) => {
  const [step, setStep] = useState<'profile' | 'biometrics' | 'success'>('profile');
  const [name, setName] = useState('Amelia Robert');
  const [email, setEmail] = useState('amelia.robert@credroll.com');
  const [phone, setPhone] = useState('+45 924 03018');
  const [accountType, setAccountType] = useState('Premier Corporate Platinum');
  const [initialBalance, setInitialBalance] = useState('4990000');
  const [password, setPassword] = useState('AmeliaSecure2026!');
  const [biometricType, setBiometricType] = useState<'Both' | 'Face ID' | 'Touch ID'>('Both');
  const [enrolledBio, setEnrolledBio] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [createdUser, setCreatedUser] = useState<UserAccount | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setStep('biometrics');
  };

  const handleStartBioEnroll = () => {
    setShowBioModal(true);
  };

  const handleBioSuccess = (type: 'Face ID' | 'Touch ID') => {
    setShowBioModal(false);
    setEnrolledBio(true);
    sounds.playSuccess();
  };

  const handleFinalizeAccount = () => {
    sounds.playSuccess();
    const balanceNum = parseFloat(initialBalance) || 4990000;
    const acctNum = `CR-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newUser: UserAccount = {
      name: name.trim() || 'Amelia Robert',
      accountNumber: acctNum,
      routingNumber: '021000021',
      swiftBic: 'CREDDIS1XXX',
      tier: accountType,
      role: 'Corporate',
      avatar: '/assets/aistudio/IMG-20261111-WA0142_4bc41855.jpg',
      email: email.trim() || 'amelia.robert@credroll.com',
      phone: phone.trim() || '+45 924 03018',
      balance: balanceNum,
      credits: balanceNum + 50000000,
      debits: 50000000,
      currency: 'USD',
      hasBiometrics: enrolledBio,
      biometricType: biometricType,
      card: {
        cardNumber: `4832 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        cardHolder: name.toUpperCase() || 'AMELIA ROBERT',
        expiry: '10/30',
        cvv: `${Math.floor(100 + Math.random() * 900)}`,
        isFrozen: false,
        type: 'Corporate Visa',
        color: 'crimson',
        spendingLimit: 250000,
        onlinePaymentsEnabled: true,
        internationalEnabled: true,
      },
      inboxUnreadCount: 2,
    };

    setCreatedUser(newUser);
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-800 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Navigation */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4">
        <button
          onClick={onGoToHome}
          className="cursor-pointer transition-opacity hover:opacity-90"
        >
          <CredrollLogo variant="white" size="md" />
        </button>
        <div className="flex items-center gap-3">
          <LanguageSelector variant="red" />
          <button
            onClick={onGoToLogin}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-xl w-full mx-auto my-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#be123c] via-[#e11d48] to-[#fb7185] p-6 text-white text-center relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Fast-Track Corporate Enrollment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Open Your Credroll Account
          </h1>
          <p className="text-xs text-rose-100 mt-1 max-w-sm mx-auto">
            High-limit digital banking with next-generation biometric authentication for Amelia Robert.
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-3 mt-4 text-xs font-bold">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                step === 'profile' ? 'bg-white text-rose-700 shadow-sm' : 'bg-white/20 text-white'
              }`}
            >
              1. Account Info
            </span>
            <span className="text-rose-200">→</span>
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                step === 'biometrics' ? 'bg-white text-rose-700 shadow-sm' : 'bg-white/20 text-white'
              }`}
            >
              2. Biometrics
            </span>
            <span className="text-rose-200">→</span>
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                step === 'success' ? 'bg-white text-rose-700 shadow-sm' : 'bg-white/20 text-white'
              }`}
            >
              3. Activated
            </span>
          </div>
        </div>

        {/* STEP 1: ACCOUNT & PERSONAL INFO */}
        {step === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
            {/* Account Holder Photo Badge */}
            <div className="flex items-center gap-3 p-3 bg-rose-50/70 border border-rose-100 rounded-2xl">
              <img
                src="/assets/aistudio/IMG-20261111-WA0142_4bc41855.jpg"
                alt="Amelia Robert"
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                  Enrolling Account Primary
                </span>
                <p className="text-sm font-extrabold text-slate-900">Amelia Robert</p>
                <p className="text-[11px] text-slate-500">Photo verified for biometric passkey binding</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name (Account Primary) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amelia Robert"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Corporate Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amelia.robert@credroll.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+45 924 03018"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Tier
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                >
                  <option value="Premier Corporate Platinum">Premier Corporate Platinum</option>
                  <option value="Private Wealth Executive">Private Wealth Executive</option>
                  <option value="High-Yield Commercial">High-Yield Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Opening Balance (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="any"
                    required
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    placeholder="4990000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Master Security Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Biometric Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: BIOMETRIC ENROLLMENT */}
        {step === 'biometrics' && (
          <div className="p-6 space-y-5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-blue-900">
                  Credroll Zero-Knowledge Biometric Authentication
                </h4>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Your biometric patterns (Face ID / Touch ID) are bound to your secure enclave hardware token for instantaneous login and instant wire transfers.
                </p>
              </div>
            </div>

            {/* Biometric Type Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Both', label: 'Face ID & Touch', icon: Sparkles },
                { id: 'Face ID', label: 'Face ID Only', icon: ScanFace },
                { id: 'Touch ID', label: 'Touch ID Only', icon: Fingerprint },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBiometricType(opt.id as 'Both' | 'Face ID' | 'Touch ID')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    biometricType === opt.id
                      ? 'border-blue-600 bg-blue-50/80 text-blue-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <opt.icon className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <span className="text-[11px] block">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Enrollment Status Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              {enrolledBio ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Biometric Credentials Successfully Enrolled!
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {name}'s biometric profile has been verified and registered.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                    <ScanFace className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Enroll Biometric Identity for {name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Perform a quick camera or fingerprint capture to complete your account security.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartBioEnroll}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    <ScanFace className="w-4 h-4" />
                    <span>Launch Biometric Scanner</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('profile')}
                className="w-1/3 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleFinalizeAccount}
                className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Finalize & Activate Account</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ACTIVATION SUCCESS */}
        {step === 'success' && createdUser && (
          <div className="p-6 text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Welcome to Credroll, {createdUser.name}!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your online banking account is active and balances are ready.
              </p>
            </div>

            {/* Account Slip */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Account Number</span>
                <span className="font-mono font-bold text-slate-800">{createdUser.accountNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Account Tier</span>
                <span className="font-bold text-slate-800">{createdUser.tier}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Biometric Protection</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Enrolled ({createdUser.biometricType})
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-base">
                <span className="font-bold text-slate-800">Initial Balance</span>
                <span className="font-black text-emerald-600 text-lg">
                  ${createdUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => onRegisterComplete(createdUser)}
                className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Banking Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="text-center py-4 text-xs text-slate-400">
        © 2021 – 2026 Credroll Credit Union. Member FDIC. Equal Housing Lender.
      </div>

      {/* Biometric Enrollment Modal */}
      {showBioModal && (
        <BiometricModal
          isOpen={showBioModal}
          onClose={() => setShowBioModal(false)}
          onSuccess={handleBioSuccess}
          title="Enroll Biometrics"
          subtitle={`Registering biometric key for ${name}`}
          userName={name}
          mode="enroll"
        />
      )}
    </div>
  );
};
