import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, User, ShieldCheck, Sparkles } from 'lucide-react';
import { UserAccount, Transaction } from '../types/index.ts';
import { sounds } from '../utils/audio.ts';

interface BankingChatbotProps {
  user: UserAccount;
  transactions: Transaction[];
  onOpenTransfer: () => void;
  onOpenDeposit: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const BankingChatbot: React.FC<BankingChatbotProps> = ({
  user,
  transactions,
  onOpenTransfer,
  onOpenDeposit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Hello ${user.name}! I am Credroll's 24/7 Digital Banking Assistant. How can I assist you with your accounts or instant transfers today?`,
      timestamp: 'Just now',
    },
  ]);

  const toggleOpen = () => {
    sounds.playClick();
    setIsOpen(!isOpen);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sounds.playClick();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: 'Just now',
    };

    const userText = input.toLowerCase();
    setInput('');
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let reply = '';
      let action: { label: string; onClick: () => void } | undefined = undefined;

      if (userText.includes('balance') || userText.includes('how much') || userText.includes('funds')) {
        reply = `Your current available balance is $${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD. Total lifetime credits stand at $${user.credits.toLocaleString()} and debits at $${user.debits.toLocaleString()}.`;
      } else if (userText.includes('transfer') || userText.includes('send money') || userText.includes('wire')) {
        reply = `You can execute zero-fee Instant RTP Transfers directly from your corporate account to Credroll members or global SWIFT IBANs.`;
        action = {
          label: 'Launch Instant Transfer',
          onClick: onOpenTransfer,
        };
      } else if (userText.includes('deposit') || userText.includes('add money') || userText.includes('fund')) {
        reply = `You can deposit funds instantaneously via remote check or federal wire reservation.`;
        action = {
          label: 'Make Instant Deposit',
          onClick: onOpenDeposit,
        };
      } else if (userText.includes('card') || userText.includes('freeze') || userText.includes('block') || userText.includes('pin')) {
        reply = `Your ${user.card.type} (ending in ${user.card.cardNumber.slice(-4)}) is currently ${user.card.isFrozen ? 'FROZEN' : 'ACTIVE'}. You can freeze/unfreeze or change your PIN anytime in the View Card panel.`;
      } else if (userText.includes('biometric') || userText.includes('face id') || userText.includes('touch id')) {
        reply = `Biometric multi-factor authentication is active (${user.biometricType}) on your device. Every outbound wire over $100,000 prompts for Face ID / Touch ID verification.`;
      } else if (userText.includes('statement') || userText.includes('history') || userText.includes('recent')) {
        const last = transactions[0];
        reply = `Your most recent transaction was "${last.description}" for $${last.amount.toLocaleString()} (${last.type}). You can download full statements from the dashboard.`;
      } else {
        reply = `I can help you review your balances, initiate instant fund transfers, freeze/unfreeze your card, or generate account statements. What would you like to do?`;
      }

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply,
        timestamp: 'Just now',
        action,
      };

      sounds.playBeep();
      setMessages((prev) => [...prev, botReply]);
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Bubble Button matching screenshot 12 & 14 */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-xl shadow-blue-600/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Open Credroll Banking Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-96 max-w-[calc(100vw-2rem)] h-[480px] bg-white rounded-3xl shadow-2xl border border-slate-200 z-40 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#244fe5] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Credroll AI Support</h4>
                <span className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Live Assistant • 24/7 Priority
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.action && (
                    <button
                      onClick={() => {
                        m.action?.onClick();
                        setIsOpen(false);
                      }}
                      className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>{m.action.label}</span>
                    </button>
                  )}
                  <span
                    className={`block text-[9px] mt-1 ${
                      m.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
            {['Check Balance', 'Send Transfer', 'Deposit Funds', 'Freeze Card'].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                }}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-medium transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about transfers, balances..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
