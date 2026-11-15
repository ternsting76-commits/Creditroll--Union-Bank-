import React, { useState } from 'react';
import {
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { UserAccount, Transaction } from '../types/index.ts';
import { TransactionHistory } from './TransactionHistory.tsx';
import { sounds } from '../utils/audio.ts';

interface DashboardProps {
  user: UserAccount;
  transactions: Transaction[];
  onOpenTransfer: () => void;
  onOpenDeposit: () => void;
  onOpenProfile: () => void;
  onQuickAddBalance?: (amount: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  transactions,
  onOpenTransfer,
  onOpenDeposit,
  onOpenProfile,
  onQuickAddBalance,
}) => {
  const [quickAddedNotice, setQuickAddedNotice] = useState<string | null>(null);

  const handleQuickAdd = (amount: number) => {
    sounds.playSuccess();
    if (onQuickAddBalance) {
      onQuickAddBalance(amount);
    }
    setQuickAddedNotice(`+$${amount.toLocaleString()} Added to Amelia's Balance!`);
    setTimeout(() => setQuickAddedNotice(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Primary Blue Balance Card matching screenshot 12 & 14 */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#2b50ed] via-[#2143d6] to-[#1a36b5] text-white p-6 sm:p-8 shadow-xl shadow-blue-600/20 overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top User Pill & Add (+) Button matching screenshot 12 */}
        <div className="flex items-center justify-between relative z-10 mb-6">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-3 bg-white/15 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 transition-all cursor-pointer"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-white/60"
            />
            <div className="text-left">
              <span className="text-xs sm:text-sm font-extrabold tracking-wide uppercase block leading-none">
                {user.name}
              </span>
              <span className="text-[10px] text-blue-200 capitalize font-medium">Corporate</span>
            </div>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenDeposit();
            }}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer"
            title="Add Funds / Instant Deposit"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Balance Display matching screenshot 12 */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 relative z-10 mb-6">
          <div>
            <span className="text-sm font-medium text-blue-100 tracking-wide block">
              Balance
            </span>
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl text-blue-200 font-bold">$</span>
              <span>
                {user.balance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Biometric Protected • FDIC Insured</span>
            </span>
          </div>
        </div>

        {/* Quick Balance Adders requested by user: "add balances to it" */}
        <div className="relative z-10 mb-6 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              Instant Balance Boosters for {user.name}:
            </span>
            {quickAddedNotice && (
              <span className="text-xs font-bold text-emerald-300 animate-in fade-in">
                {quickAddedNotice}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {[50000, 250000, 500000, 1000000, 5000000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAdd(val)}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1"
              >
                <span>+${(val / 1000).toFixed(0)}k</span>
              </button>
            ))}
            <button
              type="button"
              onClick={onOpenDeposit}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-xs cursor-pointer ml-auto"
            >
              Custom Deposit...
            </button>
          </div>
        </div>

        {/* Action Widgets matching screenshot 12: Deposit & Transfer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mb-6">
          {/* Deposit Widget matching screenshot 12 */}
          <div
            onClick={() => {
              sounds.playClick();
              onOpenDeposit();
            }}
            className="bg-white rounded-2xl p-4 text-slate-800 shadow-md cursor-pointer hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700">
              <span className="text-slate-800 font-bold group-hover:text-emerald-600 transition-colors">Deposit</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>
            <button
              type="button"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#10b981] hover:bg-[#059669] text-white shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Deposit</span>
            </button>
          </div>

          {/* Transfer Widget matching screenshot 12 */}
          <div
            onClick={() => {
              sounds.playClick();
              onOpenTransfer();
            }}
            className="bg-white rounded-2xl p-4 text-slate-800 shadow-md cursor-pointer hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700">
              <span className="text-slate-800 font-bold group-hover:text-blue-600 transition-colors">Transfer</span>
              <ChevronUp className="w-4 h-4 text-blue-600" />
            </div>
            <button
              type="button"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#3b59ff] hover:bg-[#2b49ef] text-white shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* Credits and Debits Breakdown matching screenshot 12 */}
        <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row justify-between text-xs sm:text-sm gap-2 relative z-10">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <span className="text-blue-100 font-medium">Credits</span>
            <span className="font-extrabold tracking-tight text-white sm:text-base">
              ${user.credits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <span className="text-blue-100 font-medium">Debits</span>
            <span className="font-extrabold tracking-tight text-[#fca5a5] sm:text-base">
              ${user.debits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction History Section matching screenshot 12 & 14 */}
      <TransactionHistory transactions={transactions} user={user} />
    </div>
  );
};
