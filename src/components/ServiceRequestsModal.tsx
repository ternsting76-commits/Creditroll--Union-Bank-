import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  Unlock,
  KeyRound,
  RotateCcw,
  FileCheck2,
  PhoneCall,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { ServiceRequest, UserAccount } from '../types/index.ts';
import { sounds } from '../utils/audio.ts';

interface ServiceRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  existingRequests: ServiceRequest[];
  onSubmitRequest: (req: ServiceRequest) => void;
  initialType?: ServiceRequest['type'] | null;
}

export const ServiceRequestsModal: React.FC<ServiceRequestsModalProps> = ({
  isOpen,
  onClose,
  user,
  existingRequests,
  onSubmitRequest,
  initialType,
}) => {
  const [selectedType, setSelectedType] = useState<ServiceRequest['type']>(
    initialType || 'Block Card'
  );
  const [reason, setReason] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectService = (type: ServiceRequest['type']) => {
    sounds.playClick();
    setSelectedType(type);
    setSuccessMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();

    const newReq: ServiceRequest = {
      id: `SR-${Math.floor(1000 + Math.random() * 9000)}`,
      type: selectedType,
      status: 'Submitted',
      createdAt: 'Just now',
      details: reason.trim() || `Automated digital ticket generated for ${selectedType} by ${user.name}.`,
    };

    onSubmitRequest(newReq);
    setSuccessMessage(`Your request for "${selectedType}" has been processed and logged.`);
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Top Header matching screenshot 5 */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <CreditCard className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Service Requests</h2>
          <p className="text-xs text-slate-300 mt-1">
            Credit / Debit Card Related & Account Services all in one place.
          </p>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {successMessage ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Request Dispatched</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">{successMessage}</p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Submit Another
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Service list matching screenshot 5 */}
              <div className="space-y-2">
                {[
                  {
                    type: 'Block Card' as const,
                    label: 'Block Debit / ATM Card',
                    desc: 'Immediately revoke card privileges in case of theft or fraud',
                    icon: Lock,
                  },
                  {
                    type: 'Generate PIN' as const,
                    label: 'Generate Debit Card Pin Number',
                    desc: 'Issue digital encrypted instant PIN authorization',
                    icon: KeyRound,
                  },
                  {
                    type: 'Unlock Card' as const,
                    label: 'Unlock Debit / ATM Card',
                    desc: 'Restore spending and ATM withdrawal privileges',
                    icon: Unlock,
                  },
                  {
                    type: 'Reissue Card' as const,
                    label: 'Reissue Lost Debit / ATM Card',
                    desc: 'Order replacement contactless card delivered express',
                    icon: RotateCcw,
                  },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleSelectService(item.type)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      selectedType === item.type
                        ? 'border-rose-500 bg-rose-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          selectedType === item.type
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{item.label}</p>
                        <p className="text-[11px] text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 ${
                        selectedType === item.type ? 'text-rose-600 translate-x-1' : 'text-slate-300'
                      } transition-transform`}
                    />
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Additional Details / Reason for "{selectedType}"
                  </label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide any relevant reference numbers, date of incident, or branch notes..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Transmit Service Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Existing requests history */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 mb-2">Previous Service Records</h4>
            <div className="space-y-2">
              {existingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">{req.type}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">{req.id}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{req.details}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
