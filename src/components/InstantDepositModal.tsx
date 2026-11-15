import React, { useState } from 'react';
import { PlusCircle, X, CheckCircle2, ArrowDownLeft, ShieldCheck, Camera } from 'lucide-react';
import { UserAccount, Transaction } from '../types/index.ts';
import { sounds } from '../utils/audio.ts';

interface InstantDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onDepositComplete: (newBalance: number, newCredits: number, txn: Transaction) => void;
}

export const InstantDepositModal: React.FC<InstantDepositModalProps> = ({
  isOpen,
  onClose,
  user,
  onDepositComplete,
}) => {
  const [depositMethod, setDepositMethod] = useState<'wire' | 'check' | 'direct'>('wire');
  const [amount, setAmount] = useState<string>('500000');
  const [source, setSource] = useState('Vanguard Global Equity Fund');
  const [reference, setReference] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;

    const refId = reference.trim() || `DEP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      sn: 1,
      id: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      amount: numericAmount,
      type: 'credit',
      description: `Instant Deposit via ${depositMethod.toUpperCase()} (${source})`,
      date: 'Just now',
      category: 'Deposit',
      reference: refId,
      status: 'Completed',
      beneficiary: user.name,
      bankName: 'Credroll Federal Reserve Settlement',
    };

    const newBalance = user.balance + numericAmount;
    const newCredits = user.credits + numericAmount;

    sounds.playSuccess();
    setIsSuccess(true);
    setTimeout(() => {
      onDepositComplete(newBalance, newCredits, newTxn);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-white/20">
              <ArrowDownLeft className="w-4 h-4 text-emerald-100" />
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100">
              Credroll Instant Treasury
            </span>
          </div>
          <h2 className="text-xl font-bold">Deposit Funds Instantly</h2>
          <p className="text-xs text-emerald-50">
            Credited directly to {user.name} ({user.accountNumber})
          </p>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Funds Deposited!</h3>
              <p className="text-sm font-bold text-emerald-600">
                +${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500">Your new balance is now available.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setDepositMethod('wire');
                    setSource('Vanguard Global Equity Fund');
                  }}
                  className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                    depositMethod === 'wire' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Bank Wire
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDepositMethod('check');
                    setSource('Mobile Remote Check #8819');
                  }}
                  className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                    depositMethod === 'check' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Remote Check
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDepositMethod('direct');
                    setSource('Corporate Treasury Allocation');
                  }}
                  className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                    depositMethod === 'direct' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Direct Treasury
                </button>
              </div>

              {depositMethod === 'check' && (
                <div className="p-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-700">Digital Check Image Captured</p>
                  <p className="text-[11px] text-slate-400">Front & back endorsements verified by OCR</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Source / Originating Entity
                </label>
                <input
                  type="text"
                  required
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Deposit Amount (USD) *
                  </label>
                  <span className="text-[11px] text-emerald-600 font-semibold">Immediate Availability</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[50000, 250000, 500000, 1000000, 5000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setAmount(val.toString());
                        sounds.playClick();
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors"
                    >
                      +${(val / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Reference Note (Optional)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. Dividend payment Q4"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={numericAmount <= 0}
                  className="w-2/3 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Credit Deposit Now</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
