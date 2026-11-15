import React, { useState } from 'react';
import {
  Send,
  X,
  ShieldCheck,
  Building2,
  Globe2,
  ArrowRight,
  CheckCircle2,
  Download,
  AlertCircle,
  ScanFace,
  UserCheck,
} from 'lucide-react';
import { UserAccount, Transaction } from '../types/index.ts';
import { BiometricModal } from './BiometricModal.tsx';
import { sounds } from '../utils/audio.ts';

interface InstantTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onTransferComplete: (newBalance: number, newDebits: number, txn: Transaction) => void;
}

const FREQUENT_BENEFICIARIES = [
  { name: 'Wilson Anderson', account: 'CR-882019441', bank: 'Credroll Credit Union', icon: 'WA' },
  { name: 'Manhattan Tower Holdings', account: 'US89-CITI-449102', bank: 'Citibank N.A.', icon: 'MT' },
  { name: 'Bain & Partners LLC', account: 'US22-CHAS-992144', bank: 'JPMorgan Chase', icon: 'BP' },
  { name: 'Zurich Financial AG', account: 'CH93-UBS-882103', bank: 'UBS Zurich', icon: 'ZF' },
];

export const InstantTransferModal: React.FC<InstantTransferModalProps> = ({
  isOpen,
  onClose,
  user,
  onTransferComplete,
}) => {
  const [transferType, setTransferType] = useState<'internal' | 'domestic' | 'international'>('internal');
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingOrSwift, setRoutingOrSwift] = useState('');
  const [bankName, setBankName] = useState('Credroll Credit Union');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Business Payment');
  const [step, setStep] = useState<'form' | 'receipt'>('form');
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);
  const [showBiometric, setShowBiometric] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;
  const isOverBalance = numericAmount > user.balance;
  const remainingBalance = user.balance - numericAmount;

  const handleSelectBeneficiary = (b: typeof FREQUENT_BENEFICIARIES[0]) => {
    setRecipientName(b.name);
    setAccountNumber(b.account);
    setBankName(b.bank);
    sounds.playClick();
  };

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recipientName.trim()) {
      setError('Please provide the recipient name.');
      return;
    }
    if (!accountNumber.trim()) {
      setError('Please provide destination account number or IBAN.');
      return;
    }
    if (numericAmount <= 0) {
      setError('Transfer amount must be greater than $0.00.');
      return;
    }
    if (numericAmount > user.balance) {
      setError(`Insufficient funds. Your available balance is $${user.balance.toLocaleString()}.`);
      return;
    }

    // Open Biometric confirmation for instant transfer authorization
    setShowBiometric(true);
  };

  const handleBiometricSuccess = (authType: 'Face ID' | 'Touch ID') => {
    setShowBiometric(false);

    const refId = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      sn: 1, // will be re-indexed in storage
      id: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      amount: numericAmount,
      type: 'debit',
      description: description.trim() || `Instant Transfer to ${recipientName} (${authType} Verified)`,
      date: 'Just now',
      category: category,
      reference: refId,
      status: 'Completed',
      beneficiary: recipientName,
      bankName: bankName,
    };

    const newBalance = user.balance - numericAmount;
    const newDebits = user.debits + numericAmount;

    setCompletedTxn(newTxn);
    setStep('receipt');
    sounds.playSuccess();
    onTransferComplete(newBalance, newDebits, newTxn);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleReset = () => {
    setStep('form');
    setCompletedTxn(null);
    setAmount('');
    setDescription('');
    setRecipientName('');
    setAccountNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 text-white shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-white/20">
              <Send className="w-4 h-4 text-emerald-300" />
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">
              Credroll Instant RTP Wire
            </span>
          </div>
          <h2 className="text-xl font-bold">Instant Fund Transfer</h2>
          <p className="text-xs text-blue-100">
            Available Balance: <span className="font-bold text-emerald-300">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {step === 'form' ? (
            <form onSubmit={handleInitiate} className="space-y-4">
              {/* Transfer Mode Switcher */}
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setTransferType('internal');
                    setBankName('Credroll Credit Union');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    transferType === 'internal'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Credroll To</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTransferType('domestic');
                    setBankName('Domestic RTP Bank');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    transferType === 'domestic'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Domestic ACH</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTransferType('international');
                    setBankName('Global SWIFT Member');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    transferType === 'international'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>SWIFT Wire</span>
                </button>
              </div>

              {/* Frequent Beneficiaries chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Frequent Beneficiaries
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                  {FREQUENT_BENEFICIARIES.map((ben) => (
                    <button
                      key={ben.name}
                      type="button"
                      onClick={() => handleSelectBeneficiary(ben)}
                      className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                        {ben.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-none">{ben.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{ben.bank}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Beneficiary Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Wilson Anderson"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {transferType === 'international' ? 'IBAN / Account Number *' : 'Account Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={transferType === 'international' ? 'GB29 NWBK 6016 1331' : 'CR-882019441'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-mono"
                  />
                </div>
              </div>

              {/* Bank & Routing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Receiving Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Credroll Credit Union"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {transferType === 'international' ? 'SWIFT / BIC Code' : 'Routing Number (ABA)'}
                  </label>
                  <input
                    type="text"
                    value={routingOrSwift}
                    onChange={(e) => setRoutingOrSwift(e.target.value)}
                    placeholder={transferType === 'international' ? 'CREDDIS1XXX' : '021000021'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-mono uppercase"
                  />
                </div>
              </div>

              {/* Amount with Fast Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Transfer Amount (USD) *
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Fee: <strong className="text-emerald-600">$0.00 (Instant Zero-Fee)</strong>
                  </span>
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
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-3 rounded-xl border text-xl font-bold focus:outline-none focus:ring-2 transition-all ${
                      isOverBalance
                        ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/50 text-rose-700'
                        : 'border-slate-200 focus:ring-blue-500 bg-white text-slate-900'
                    }`}
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[10000, 50000, 100000, 500000, 1000000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setAmount(preset.toString());
                        sounds.playClick();
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors"
                    >
                      +${(preset / 1000).toFixed(0)}k
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setAmount(user.balance.toString());
                      sounds.playClick();
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors"
                  >
                    All (${(user.balance / 1000000).toFixed(2)}M)
                  </button>
                </div>

                {/* Real-time remaining balance */}
                {numericAmount > 0 && !isOverBalance && (
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Remaining balance after transfer: <strong className="text-slate-800">${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </p>
                )}
                {isOverBalance && (
                  <p className="text-xs text-rose-600 font-semibold mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Amount exceeds available balance!
                  </p>
                )}
              </div>

              {/* Purpose & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Transfer Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  >
                    <option value="Business Payment">Business Payment</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Contract Retainer">Contract Retainer</option>
                    <option value="Consulting">Consulting Services</option>
                    <option value="Personal Transfer">Personal Transfer</option>
                    <option value="Investment">Investment Yield</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Note / Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Invoice #9021-X or personal note"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Security Banner */}
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
                <ScanFace className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-900 leading-tight">
                  Authorized transfers are protected with Credroll Face ID / Touch ID biometric authentication.
                </p>
              </div>

              {/* Action Buttons */}
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
                  disabled={isOverBalance || numericAmount <= 0}
                  className="w-2/3 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Authorize & Transfer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* RECEIPT VIEW */
            completedTxn && (
              <div className="space-y-5 animate-in fade-in zoom-in-95">
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Transfer Completed Successfully!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Funds have been instantly dispatched via Credroll RTP Real-Time Settlement.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 font-sans text-xs">
                  <div className="flex justify-between pb-3 border-b border-slate-200">
                    <span className="text-slate-500">Transaction Reference</span>
                    <span className="font-mono font-bold text-slate-800">{completedTxn.reference}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-slate-200">
                    <span className="text-slate-500">Sender Account</span>
                    <span className="font-semibold text-slate-800">{user.name} ({user.accountNumber})</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-slate-200">
                    <span className="text-slate-500">Beneficiary</span>
                    <span className="font-semibold text-slate-800">{completedTxn.beneficiary}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-slate-200">
                    <span className="text-slate-500">Destination Institution</span>
                    <span className="font-semibold text-slate-800">{completedTxn.bankName}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-slate-200">
                    <span className="text-slate-500">Transfer Category</span>
                    <span className="font-semibold text-slate-800">{completedTxn.category}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-base">
                    <span className="font-bold text-slate-800">Amount Debited</span>
                    <span className="font-bold text-rose-600 text-lg">
                      -${completedTxn.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 text-xs">
                    <span className="text-slate-500">New Available Balance</span>
                    <span className="font-bold text-emerald-700">
                      ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePrintReceipt}
                    className="flex-1 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download / Print Receipt</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-md shadow-blue-500/20 transition-colors cursor-pointer"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Biometric Scan Trigger Modal */}
        {showBiometric && (
          <BiometricModal
            isOpen={showBiometric}
            onClose={() => setShowBiometric(false)}
            onSuccess={handleBiometricSuccess}
            title="Authorize Fund Transfer"
            subtitle={`Confirm release of $${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${recipientName}`}
            userName={user.name}
            mode="authenticate"
          />
        )}
      </div>
    </div>
  );
};
