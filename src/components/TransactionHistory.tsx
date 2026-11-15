import React, { useState } from 'react';
import {
  Download,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Printer,
} from 'lucide-react';
import { Transaction, UserAccount } from '../types/index.ts';
import { sounds } from '../utils/audio.ts';

interface TransactionHistoryProps {
  transactions: Transaction[];
  user: UserAccount;
  onRefresh?: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  user,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.beneficiary && t.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDownloadStatement = () => {
    sounds.playClick();
    // Generate CSV file for instant download
    const headers = ['S/N', 'Reference', 'Date', 'Type', 'Amount (USD)', 'Description', 'Category', 'Status', 'Beneficiary'];
    const rows = filteredTxns.map((t) => [
      t.sn,
      t.reference,
      `"${t.date}"`,
      t.type.toUpperCase(),
      t.type === 'debit' ? `-${t.amount}` : `${t.amount}`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.status,
      `"${t.beneficiary || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      `"Credroll Credit Union - Account Statement for ${user.name} (${user.accountNumber})"\n` +
      `"Generated on: ${new Date().toLocaleString()}"\n` +
      `"Total Balance: $${user.balance.toFixed(2)}"\n\n` +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Credroll_Statement_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header section matching screenshot 12 */}
      <div className="p-6 pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Recent Transactions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ledger synced with Credroll Global Settlement Network
          </p>
        </div>

        {/* Download Statement Button - distinct blue style matching screenshot 12 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadStatement}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Statement</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setTypeFilter('debit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'debit'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            Debits (-)
          </button>
          <button
            onClick={() => setTypeFilter('credit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'credit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            Credits (+)
          </button>
        </div>
      </div>

      {/* Table Section matching screenshot 12 & 14 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sky-50/60 border-b border-sky-100 text-[11px] font-bold text-sky-900 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">S/N</th>
              <th className="py-3 px-4">AMOUNT</th>
              <th className="py-3 px-3">TYPE</th>
              <th className="py-3 px-4">DESCRIPTION</th>
              <th className="py-3 px-4 hidden md:table-cell">DATE</th>
              <th className="py-3 px-3 text-center">STATUS</th>
              <th className="py-3 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredTxns.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No transactions match your search criteria.
                </td>
              </tr>
            ) : (
              filteredTxns.map((t, idx) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTxn(t)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* S/N */}
                  <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-400">
                    {idx + 1}
                  </td>

                  {/* AMOUNT (Red with - for debit, Emerald with + for credit matching screenshots) */}
                  <td className="py-3.5 px-4 font-bold text-sm whitespace-nowrap">
                    {t.type === 'debit' ? (
                      <span className="text-rose-600">
                        -${t.amount.toLocaleString('en-US')}
                      </span>
                    ) : (
                      <span className="text-emerald-600">
                        +${t.amount.toLocaleString('en-US')}
                      </span>
                    )}
                  </td>

                  {/* TYPE tag */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[11px] font-semibold lowercase ${
                        t.type === 'debit' ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>

                  {/* DESCRIPTION */}
                  <td className="py-3.5 px-4 text-slate-800 font-medium">
                    <div className="flex flex-col">
                      <span className="truncate max-w-xs md:max-w-md font-semibold">
                        {t.description}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Ref: {t.reference}
                      </span>
                    </div>
                  </td>

                  {/* DATE */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap hidden md:table-cell">
                    {t.date}
                  </td>

                  {/* STATUS */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {t.status}
                    </span>
                  </td>

                  {/* VIEW SLIP */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTxn(t);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="View Transaction Slip"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>
          Showing <strong>{filteredTxns.length}</strong> of <strong>{transactions.length}</strong> records
        </span>
        <div className="flex items-center gap-4">
          <span>
            Total Debits: <strong className="text-rose-600">-${user.debits.toLocaleString()}</strong>
          </span>
          <span>
            Total Credits: <strong className="text-emerald-600">+${user.credits.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {/* Detailed Transaction Slip Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white relative">
              <button
                onClick={() => setSelectedTxn(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200">
                Official Transaction Slip
              </span>
              <h3 className="text-lg font-bold mt-1">{selectedTxn.description}</h3>
              <p className="text-xs text-blue-100 font-mono mt-0.5">{selectedTxn.reference}</p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="text-center py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-slate-400 font-medium">Transaction Value</p>
                <p
                  className={`text-2xl font-black mt-1 ${
                    selectedTxn.type === 'debit' ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {selectedTxn.type === 'debit' ? '-' : '+'}$
                  {selectedTxn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {selectedTxn.status}
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Date & Timestamp</span>
                  <span className="font-semibold text-slate-800">{selectedTxn.date}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Account Holder</span>
                  <span className="font-semibold text-slate-800">{user.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Account Number</span>
                  <span className="font-mono font-semibold text-slate-800">{user.accountNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Classification</span>
                  <span className="font-semibold text-slate-800">{selectedTxn.category}</span>
                </div>
                {selectedTxn.beneficiary && (
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Counterparty</span>
                    <span className="font-semibold text-slate-800">{selectedTxn.beneficiary}</span>
                  </div>
                )}
                {selectedTxn.bankName && (
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Clearing Network</span>
                    <span className="font-semibold text-slate-800">{selectedTxn.bankName}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
