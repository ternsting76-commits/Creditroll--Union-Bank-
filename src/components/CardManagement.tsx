import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldAlert,
  Sparkles,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Globe,
  ShoppingBag,
} from 'lucide-react';
import { BankCard, UserAccount } from '../types/index.ts';
import { CredrollLogo } from './CredrollLogo.tsx';
import { sounds } from '../utils/audio.ts';

interface CardManagementProps {
  user: UserAccount;
  onUpdateCard: (updatedCard: BankCard) => void;
  onRequestService?: (type: 'Block Card' | 'Generate PIN' | 'Unlock Card' | 'Reissue Card') => void;
}

export const CardManagement: React.FC<CardManagementProps> = ({
  user,
  onUpdateCard,
  onRequestService,
}) => {
  const [showCvv, setShowCvv] = useState(false);
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [activeColor, setActiveColor] = useState<'crimson' | 'navy' | 'gold' | 'emerald'>(
    user.card.color || 'crimson'
  );
  const [limit, setLimit] = useState(user.card.spendingLimit || 250000);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const card = user.card;

  const handleToggleFreeze = () => {
    sounds.playClick();
    const updated: BankCard = {
      ...card,
      isFrozen: !card.isFrozen,
    };
    onUpdateCard(updated);
  };

  const handleColorChange = (color: 'crimson' | 'navy' | 'gold' | 'emerald') => {
    sounds.playClick();
    setActiveColor(color);
    onUpdateCard({ ...card, color });
  };

  const handleLimitChange = (newVal: number) => {
    setLimit(newVal);
    onUpdateCard({ ...card, spendingLimit: newVal });
  };

  const handleToggleOnline = () => {
    sounds.playClick();
    onUpdateCard({ ...card, onlinePaymentsEnabled: !card.onlinePaymentsEnabled });
  };

  const handleToggleInternational = () => {
    sounds.playClick();
    onUpdateCard({ ...card, internationalEnabled: !card.internationalEnabled });
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      sounds.playSuccess();
      setPinSuccess(true);
      setTimeout(() => {
        setPinSuccess(false);
        setPinModalOpen(false);
        setNewPin('');
      }, 1200);
    }
  };

  const getCardBg = () => {
    switch (activeColor) {
      case 'navy':
        return 'bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 text-white';
      case 'gold':
        return 'bg-gradient-to-tr from-amber-700 via-yellow-600 to-amber-900 text-white';
      case 'emerald':
        return 'bg-gradient-to-tr from-emerald-900 via-teal-800 to-slate-900 text-white';
      case 'crimson':
      default:
        // Matches the screenshot 13 red card
        return 'bg-gradient-to-tr from-[#9f1239] via-[#be123c] to-[#e11d48] text-white';
    }
  };

  const displayNumber = showFullNumber
    ? card.cardNumber
    : `•••• •••• •••• ${card.cardNumber.slice(-4)}`;

  return (
    <div className="space-y-6">
      {/* Intro Header matching screenshot 13 */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 tracking-wider uppercase">
            Debit & Credit Card Suite
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Personalize Your Card And Stand Out From The Crowd
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Control limits, customize luxury card skins, instantly freeze or reissue lost cards with high-assurance biometric protection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRequestService && onRequestService('Reissue Card')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Reissue Card
          </button>
          <button
            onClick={() => setPinModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            Change PIN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CARD PREVIEW COLUMN */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm">
            {/* Realistic Physical Card */}
            <div
              className={`relative aspect-[1.586/1] rounded-3xl p-6 shadow-2xl transition-all duration-500 transform hover:scale-[1.02] flex flex-col justify-between overflow-hidden border border-white/20 ${getCardBg()}`}
            >
              {/* Frozen Overlay */}
              {card.isFrozen && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs z-20 flex flex-col items-center justify-center text-white animate-in fade-in">
                  <Lock className="w-10 h-10 text-rose-400 mb-1" />
                  <span className="text-sm font-black uppercase tracking-wider">Card Frozen</span>
                  <span className="text-[10px] text-slate-300">Tap unfreeze below to restore transactions</span>
                </div>
              )}

              {/* Card Holographic Watermark Pattern */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 opacity-10 pointer-events-none">
                <CredrollLogo variant="white" showText={false} size="xl" />
              </div>

              {/* Card Top Row */}
              <div className="flex items-center justify-between z-10">
                <CredrollLogo variant="white" showText={true} size="sm" textClassName="text-white tracking-wide" />
                <span className="text-[11px] font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  {card.type}
                </span>
              </div>

              {/* Card Chip & Contactless */}
              <div className="flex items-center gap-4 my-auto z-10">
                {/* EMV Chip */}
                <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-500 border border-amber-600/40 shadow-inner flex flex-col justify-around p-1">
                  <div className="h-0.5 bg-amber-700/40 rounded-full" />
                  <div className="h-0.5 bg-amber-700/40 rounded-full" />
                </div>
                {/* Contactless waves */}
                <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.905-3.905 10.237-3.905 14.142 0M1.393 9.393c5.857-5.857 15.355-5.857 21.214 0" />
                </svg>
              </div>

              {/* Card Number */}
              <div className="z-10">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg sm:text-xl font-bold tracking-widest drop-shadow-sm">
                    {displayNumber}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowFullNumber(!showFullNumber)}
                    className="p-1 text-white/70 hover:text-white"
                  >
                    {showFullNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-end justify-between mt-3 text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/60 block">Card Holder</span>
                    <span className="font-bold tracking-wider uppercase text-white drop-shadow-sm">{card.cardHolder}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/60 block">Expires</span>
                    <span className="font-mono font-bold text-white drop-shadow-sm">{card.expiry}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/60 block">CVV</span>
                    <span
                      onClick={() => setShowCvv(!showCvv)}
                      className="font-mono font-bold text-white drop-shadow-sm cursor-pointer hover:underline"
                    >
                      {showCvv ? card.cvv : '•••'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Palette Switcher */}
            <div className="mt-4 p-3 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-xs">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500" />
                Card Style Theme:
              </span>
              <div className="flex items-center gap-2">
                {[
                  { id: 'crimson', bg: 'bg-[#be123c]', label: 'Crimson' },
                  { id: 'navy', bg: 'bg-slate-900', label: 'Navy' },
                  { id: 'gold', bg: 'bg-amber-600', label: 'Gold' },
                  { id: 'emerald', bg: 'bg-emerald-700', label: 'Emerald' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleColorChange(c.id as 'crimson' | 'navy' | 'gold' | 'emerald')}
                    className={`w-6 h-6 rounded-full ${c.bg} transition-transform ${
                      activeColor === c.id ? 'ring-2 ring-blue-600 ring-offset-2 scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS COLUMN */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            Security & Transaction Preferences
          </h3>

          {/* Freeze / Unfreeze Switch */}
          <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  card.isFrozen ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                {card.isFrozen ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {card.isFrozen ? 'Card Is Currently Frozen' : 'Card Is Active & Operational'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {card.isFrozen
                    ? 'All POS, ATM, and online transactions are temporarily paused.'
                    : 'Tap switch to temporarily lock your card if misplaced.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleFreeze}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                card.isFrozen
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {card.isFrozen ? 'Unfreeze' : 'Freeze Card'}
            </button>
          </div>

          {/* Daily Limit Slider */}
          <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Daily Spending Limit</span>
              <span className="font-mono font-bold text-blue-600 text-sm">
                ${limit.toLocaleString()} USD
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>$5,000</span>
              <span>$250,000</span>
              <span>$500,000 (Platinum Max)</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Online Transactions */}
            <div className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Online Payments</p>
                  <p className="text-[10px] text-slate-400">E-commerce & Web</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleOnline}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  card.onlinePaymentsEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    card.onlinePaymentsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* International usage */}
            <div className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Global Roaming</p>
                  <p className="text-[10px] text-slate-400">Overseas & FX</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleInternational}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  card.internationalEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    card.internationalEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PIN Change Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-900">Set New Card PIN</h4>
            <p className="text-xs text-slate-500">
              Enter a secure 4-digit PIN for ATM withdrawals and POS verification.
            </p>

            {pinSuccess ? (
              <div className="py-4 text-center text-emerald-600 space-y-1">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <p className="text-xs font-bold">PIN Updated Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSavePin} className="space-y-4">
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full text-center tracking-[1em] text-2xl font-mono py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPinModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={newPin.length !== 4}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-xs font-bold text-white shadow-xs"
                  >
                    Confirm PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
