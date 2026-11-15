/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  getStoredUser,
  saveStoredUser,
  getStoredTransactions,
  saveStoredTransactions,
  getStoredServiceRequests,
  saveStoredServiceRequests,
  resetAllData,
} from './utils/storage.ts';
import { UserAccount, Transaction, ServiceRequest, BankCard } from './types/index.ts';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { TransactionHistory } from './components/TransactionHistory.tsx';
import { CardManagement } from './components/CardManagement.tsx';
import { InstantTransferModal } from './components/InstantTransferModal.tsx';
import { InstantDepositModal } from './components/InstantDepositModal.tsx';
import { ServiceRequestsModal } from './components/ServiceRequestsModal.tsx';
import { LoginPage } from './components/LoginPage.tsx';
import { RegisterPage } from './components/RegisterPage.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { NotificationsModal } from './components/NotificationsModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { BankingChatbot } from './components/BankingChatbot.tsx';
import { CredrollLogo } from './components/CredrollLogo.tsx';
import {
  Smartphone,
  Monitor,
  UserCheck,
  Send,
  PlusCircle,
  ScanFace,
  Lock,
  Globe,
  RotateCcw,
} from 'lucide-react';
import { sounds } from './utils/audio.ts';

export default function App() {
  const [user, setUser] = useState<UserAccount>(getStoredUser);
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(getStoredServiceRequests);

  // App Top-Level View
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'dashboard'>('dashboard');

  // Sub tab in dashboard view
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Phone Frame toggle (matches the mobile screenshots aspect ratio)
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  // Modals state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [initialServiceType, setInitialServiceType] = useState<ServiceRequest['type'] | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync to localStorage and ensure Amelia avatar is always up-to-date with uploaded picture
  useEffect(() => {
    if (user.avatar !== '/assets/aistudio/IMG-20261111-WA0142_4bc41855.jpg') {
      setUser((prev) => ({ ...prev, avatar: '/assets/aistudio/IMG-20261111-WA0142_4bc41855.jpg' }));
    } else {
      saveStoredUser(user);
    }
  }, [user]);

  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveStoredServiceRequests(serviceRequests);
  }, [serviceRequests]);

  // Handlers
  const handleTransferComplete = (newBalance: number, newDebits: number, txn: Transaction) => {
    const updatedUser = {
      ...user,
      balance: newBalance,
      debits: newDebits,
    };
    setUser(updatedUser);

    const reindexedTxns = [txn, ...transactions].map((t, idx) => ({
      ...t,
      sn: idx + 1,
    }));
    setTransactions(reindexedTxns);
  };

  const handleDepositComplete = (newBalance: number, newCredits: number, txn: Transaction) => {
    const updatedUser = {
      ...user,
      balance: newBalance,
      credits: newCredits,
    };
    setUser(updatedUser);

    const reindexedTxns = [txn, ...transactions].map((t, idx) => ({
      ...t,
      sn: idx + 1,
    }));
    setTransactions(reindexedTxns);
  };

  const handleQuickAddBalance = (amount: number) => {
    const newTxn: Transaction = {
      sn: 1,
      id: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      amount: amount,
      type: 'credit',
      description: `Instant Balance Boost for ${user.name}`,
      date: 'Just now',
      category: 'Treasury Addition',
      reference: `BOOST-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Completed',
      beneficiary: user.name,
      bankName: 'Credroll Federal Settlement',
    };

    handleDepositComplete(user.balance + amount, user.credits + amount, newTxn);
  };

  const handleUpdateCard = (card: BankCard) => {
    setUser((prev) => ({
      ...prev,
      card,
    }));
  };

  const handleCreateServiceRequest = (req: ServiceRequest) => {
    setServiceRequests((prev) => [req, ...prev]);
    if (req.type === 'Block Card') {
      setUser((prev) => ({
        ...prev,
        card: { ...prev.card, isFrozen: true },
      }));
    } else if (req.type === 'Unlock Card') {
      setUser((prev) => ({
        ...prev,
        card: { ...prev.card, isFrozen: false },
      }));
    }
  };

  const handleRequestServiceFromCard = (type: ServiceRequest['type']) => {
    setInitialServiceType(type);
    setIsServiceModalOpen(true);
  };

  const handleResetData = () => {
    resetAllData();
    setUser(getStoredUser());
    setTransactions(getStoredTransactions());
    setServiceRequests(getStoredServiceRequests());
  };

  const handleClearNotifications = () => {
    setUser((prev) => ({ ...prev, inboxUnreadCount: 0 }));
  };

  // Render Inner Content depending on view
  const renderMainContent = () => {
    if (view === 'landing') {
      return (
        <LandingPage
          onGoToLogin={() => setView('login')}
          onGoToRegister={() => setView('register')}
          onGoToDashboard={() => setView('dashboard')}
          isLoggedIn={true}
          userName={user.name}
        />
      );
    }

    if (view === 'login') {
      return (
        <LoginPage
          onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setView('dashboard');
          }}
          onGoToRegister={() => setView('register')}
          onGoToHome={() => setView('landing')}
          currentUser={user}
        />
      );
    }

    if (view === 'register') {
      return (
        <RegisterPage
          onRegisterComplete={(newUser) => {
            setUser(newUser);
            setView('dashboard');
          }}
          onGoToLogin={() => setView('login')}
          onGoToHome={() => setView('landing')}
        />
      );
    }

    // DASHBOARD VIEW
    return (
      <div className="min-h-screen bg-[#f3f4f6] text-slate-800 flex flex-col selection:bg-rose-500 selection:text-white">
        {/* Header matching screenshot 12 & 14 */}
        <Header
          user={user}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onLogout={() => setView('login')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Main Dashboard Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto pb-24">
          {/* Sub Navigation Tabs Bar */}
          <div className="flex items-center justify-between pb-6 mb-2 overflow-x-auto gap-2 scrollbar-none">
            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl shadow-xs border border-slate-200/80">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'cards', label: 'View Card' },
                { id: 'transactions', label: 'Transactions' },
                { id: 'services', label: 'Service Requests' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setCurrentTab(tab.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    currentTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsDepositModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                + Add Balance
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsTransferModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Instant Transfer
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {currentTab === 'dashboard' && (
            <Dashboard
              user={user}
              transactions={transactions}
              onOpenTransfer={() => setIsTransferModalOpen(true)}
              onOpenDeposit={() => setIsDepositModalOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              onQuickAddBalance={handleQuickAddBalance}
            />
          )}

          {currentTab === 'cards' && (
            <CardManagement
              user={user}
              onUpdateCard={handleUpdateCard}
              onRequestService={handleRequestServiceFromCard}
            />
          )}

          {currentTab === 'transactions' && (
            <div className="space-y-4">
              <TransactionHistory transactions={transactions} user={user} />
            </div>
          )}

          {currentTab === 'services' && (
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Card & Account Service Requests</h3>
                  <p className="text-xs text-slate-500">Manage card security, PIN changes, and limits</p>
                </div>
                <button
                  onClick={() => setIsServiceModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  + New Service Request
                </button>
              </div>

              <div className="space-y-3">
                {serviceRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">{req.type}</span>
                        <span className="font-mono text-xs text-slate-400">({req.id})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{req.details}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Logged: {req.createdAt}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Floating Banking AI Chatbot Assistant matching screenshot 12 */}
        <BankingChatbot
          user={user}
          transactions={transactions}
          onOpenTransfer={() => setIsTransferModalOpen(true)}
          onOpenDeposit={() => setIsDepositModalOpen(true)}
        />

        {/* Sidebar Drawer matching screenshot 18 */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          user={user}
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'transfer') {
              setIsTransferModalOpen(true);
            } else if (tab === 'deposit') {
              setIsDepositModalOpen(true);
            } else if (tab === 'services') {
              setIsServiceModalOpen(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          onLogout={() => setView('login')}
        />

        {/* Instant Transfer Modal */}
        {isTransferModalOpen && (
          <InstantTransferModal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            user={user}
            onTransferComplete={handleTransferComplete}
          />
        )}

        {/* Instant Deposit Modal */}
        {isDepositModalOpen && (
          <InstantDepositModal
            isOpen={isDepositModalOpen}
            onClose={() => setIsDepositModalOpen(false)}
            user={user}
            onDepositComplete={handleDepositComplete}
          />
        )}

        {/* Service Requests Modal matching screenshot 5 */}
        {isServiceModalOpen && (
          <ServiceRequestsModal
            isOpen={isServiceModalOpen}
            onClose={() => {
              setIsServiceModalOpen(false);
              setInitialServiceType(null);
            }}
            user={user}
            existingRequests={serviceRequests}
            onSubmitRequest={handleCreateServiceRequest}
            initialType={initialServiceType}
          />
        )}

        {/* Profile Modal */}
        {isProfileOpen && (
          <ProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            user={user}
            onUpdateUser={setUser}
          />
        )}

        {/* Notifications Modal */}
        {isNotificationsOpen && (
          <NotificationsModal
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            user={user}
            onClearAll={handleClearNotifications}
          />
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            user={user}
            onUpdateUser={setUser}
            onResetData={handleResetData}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Top Universal Quick Switcher Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-lg">
        {/* Brand identity */}
        <div className="flex items-center gap-2">
          <CredrollLogo variant="crimson" size="sm" showText={true} textClassName="text-white font-extrabold text-sm" />
          <span className="hidden md:inline-block px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-300 font-mono text-[10px] border border-blue-700/50">
            {user.name} • ${user.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* Quick View Switches */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <button
            onClick={() => {
              sounds.playClick();
              setView('dashboard');
              setCurrentTab('dashboard');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              view === 'dashboard' && currentTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setView('dashboard');
              setIsTransferModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Transfer</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setView('dashboard');
              setIsDepositModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Balance</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setView('register');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              view === 'register'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ScanFace className="w-3.5 h-3.5 text-rose-400" />
            <span>Register (Biometrics)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setView('login');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              view === 'login'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-indigo-300" />
            <span>Secure Login</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setView('landing');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              view === 'landing'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>Public Portal</span>
          </button>
        </div>

        {/* Layout & Reset toggles */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setIsPhoneFrame(!isPhoneFrame);
            }}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer ${
              isPhoneFrame
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Toggle Mobile Phone frame view"
          >
            {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPhoneFrame ? 'Desktop Mode' : 'Mobile Phone Frame'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              handleResetData();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset data to Amelia Robert ($4.99M)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Main viewport */}
      <div className="flex-1 flex justify-center items-start overflow-x-hidden">
        {isPhoneFrame ? (
          /* Phone Frame simulation matching the mobile screenshots */
          <div className="my-6 w-full max-w-[420px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-white/10 overflow-hidden">
            {/* Phone Speaker & Camera Notch */}
            <div className="w-32 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-800 mr-2" />
              <div className="w-12 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* Mobile Screen Content */}
            <div className="rounded-[36px] overflow-hidden bg-[#f3f4f6] max-h-[820px] overflow-y-auto relative scrollbar-none">
              {/* Android Status Bar matching screenshot timestamp 07:56 */}
              <div className="bg-slate-900 text-white px-6 py-1 flex items-center justify-between text-[11px] font-mono tracking-wider select-none shrink-0">
                <span>07:56</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>4G</span>
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {renderMainContent()}

              {/* Android Bottom Navigation Bar matching screenshot 1, 3, 12 */}
              <div className="bg-slate-900 text-white/60 py-2.5 flex items-center justify-around text-base select-none sticky bottom-0 z-30 border-t border-slate-800">
                <span>‹</span>
                <span>○</span>
                <span>≡</span>
              </div>
            </div>
          </div>
        ) : (
          /* Fullscreen Responsive View */
          <div className="w-full flex-1">
            {renderMainContent()}
          </div>
        )}
      </div>
    </div>
  );
}
