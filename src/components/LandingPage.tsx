import React, { useState } from 'react';
import {
  Menu,
  X,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Shield,
  CreditCard,
  Building,
  TrendingUp,
  Headphones,
  FileDown,
  MessageSquareWarning,
  Lock,
  Sparkles,
} from 'lucide-react';
import { CredrollLogo } from './CredrollLogo.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { sounds } from '../utils/audio.ts';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onGoToDashboard: () => void;
  isLoggedIn: boolean;
  userName: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onGoToRegister,
  onGoToDashboard,
  isLoggedIn,
  userName,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [individualOpen, setIndividualOpen] = useState(true);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-slate-800 font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Banner Navigation matching screenshot 3 and 7 */}
      <header className="sticky top-0 z-40 bg-[#be123c] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Credroll Logo */}
          <div className="flex items-center gap-2">
            <CredrollLogo variant="white" size="md" />
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <LanguageSelector variant="glass" />

            {isLoggedIn ? (
              <button
                onClick={onGoToDashboard}
                className="px-3.5 py-1.5 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Dashboard ({userName.split(' ')[0]})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={onGoToLogin}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={onGoToRegister}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-colors"
                >
                  Open Account
                </button>
              </div>
            )}

            {/* Hamburger button */}
            <button
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Red Sidebar Drawer Menu matching screenshot 3 */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#be123c] text-white z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              {/* Header with Credroll logo and X */}
              <div className="flex items-center justify-between pb-6 border-b border-rose-700">
                <CredrollLogo variant="white" size="md" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation list matching screenshot 3 */}
              <nav className="py-4 space-y-1 text-sm font-bold">
                <a
                  href="#home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Home
                </a>
                <div className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                  <span>Services</span>
                  <ChevronRight className="w-4 h-4 bg-black/20 p-0.5 rounded-md" />
                </div>
                <div className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                  <span>About</span>
                  <ChevronRight className="w-4 h-4 bg-black/20 p-0.5 rounded-md" />
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGoToRegister();
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="w-4 h-4 bg-black/20 p-0.5 rounded-md" />
                </button>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Get In Touch
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGoToLogin();
                  }}
                  className="w-full text-left block px-3 py-3 rounded-xl hover:bg-white/10 transition-colors text-white font-extrabold"
                >
                  Login
                </button>
              </nav>

              {/* Contact info matching screenshot 3 */}
              <div className="pt-6 border-t border-rose-700 space-y-3 text-xs">
                <a
                  href="mailto:info@credroll.com"
                  className="flex items-center gap-3 text-rose-100 hover:text-white"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>info@credroll.com</span>
                </a>
                <a
                  href="tel:+4592403018"
                  className="flex items-center gap-3 text-rose-100 hover:text-white"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>+45 924 03018</span>
                </a>
              </div>
            </div>

            <div className="pt-6 text-[11px] text-rose-300">
              © 2026 Credroll Credit Union.
            </div>
          </aside>
        </>
      )}

      {/* HERO SECTION matching screenshot 7 */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
            Credroll Credit Union Global
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Bank with the Most Satisfied Customers Around the Globe
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Join thousands who trust us for transparent, secure, and rewarding financial experiences with instant fund transfers and biometric security.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setAppointmentModal(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-xl transition-all cursor-pointer"
            >
              Make An Appointment
            </button>
            <button
              onClick={onGoToRegister}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Register Account (Amelia Robert)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION matching screenshot 4 & 2: DIAMOND CARDS */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Bank For A Better tomorrow
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Committed to helping our customers succeed with intelligent wealth management and high-yield plans.
          </p>
        </div>

        {/* 3 Diamond Cards matching screenshot 4, 2, 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 01: Fixed Deposit */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative group">
            {/* Diamond shape badge matching screenshot 4 */}
            <div className="w-20 h-20 bg-rose-50/80 rounded-2xl rotate-45 flex items-center justify-center mb-8 border border-rose-100 group-hover:scale-105 transition-transform">
              <span className="-rotate-45 font-black text-rose-600 text-xl">01</span>
            </div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
              Fixed Deposit
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Secure Your Future with Guaranteed Returns
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Enjoy stable, risk-free returns with our flexible fixed deposit plans tailored to your financial goals.
            </p>
            <button
              onClick={onGoToRegister}
              className="mt-auto font-bold text-xs text-slate-800 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
            >
              <span>Read More</span>
              <span className="text-rose-600">+</span>
            </button>
          </div>

          {/* Card 02: Current Account */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative group">
            <div className="w-20 h-20 bg-rose-50/80 rounded-2xl rotate-45 flex items-center justify-center mb-8 border border-rose-100 group-hover:scale-105 transition-transform">
              <span className="-rotate-45 font-black text-rose-600 text-xl">02</span>
            </div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
              Current Account
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Smart Banking for Growing Businesses
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Manage daily transactions with ease, enjoy higher limits, and seamless access to your funds anytime.
            </p>
            <button
              onClick={onGoToRegister}
              className="mt-auto font-bold text-xs text-slate-800 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
            >
              <span>Read More</span>
              <span className="text-rose-600">+</span>
            </button>
          </div>

          {/* Card 03: Mutual Funds */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative group">
            <div className="w-20 h-20 bg-rose-50/80 rounded-2xl rotate-45 flex items-center justify-center mb-8 border border-rose-100 group-hover:scale-105 transition-transform">
              <span className="-rotate-45 font-black text-rose-600 text-xl">03</span>
            </div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
              Mutual Funds
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Diversified Investments, Smarter Returns
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Grow your wealth with professionally managed portfolios designed to match your financial goals and risk appetite.
            </p>
            <button
              onClick={onGoToRegister}
              className="mt-auto font-bold text-xs text-slate-800 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
            >
              <span>Read More</span>
              <span className="text-rose-600">+</span>
            </button>
          </div>
        </div>
      </section>

      {/* BANKING FOR INDIVIDUALS & COMPANIES matching screenshot 6 & 8 */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">Banking For Your Needs</h2>
            <p className="text-xs text-slate-400">The bank that builds better relationships</p>
          </div>

          {/* Accordion headers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Banking for</span>
                <h4 className="text-lg font-bold text-white">Individuals</h4>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>

            <div className="bg-white rounded-2xl p-4 text-slate-900 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Banking for</span>
                <h4 className="text-lg font-bold text-slate-900">Companies</h4>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-600" />
            </div>
          </div>

          {/* Service Cards matching screenshot 6 & 8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Consumer Loans Card matching screenshot 6 */}
            <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
                <button
                  onClick={onGoToRegister}
                  className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Consumer Loans</h3>
                <div className="w-16 h-0.5 bg-rose-500 my-2" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Access flexible consumer loans with competitive interest rates, designed to help you manage life's expenses with ease.
                </p>
                <p className="text-[11px] text-rose-400 font-semibold mt-3">
                  * Check today's Interest Rates
                </p>
              </div>
            </div>

            {/* Savings & CDs Card matching screenshot 8 */}
            <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <button
                  onClick={onGoToRegister}
                  className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Savings & CDs</h3>
                <div className="w-16 h-0.5 bg-rose-500 my-2" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Secure your future with our high-yield savings and CD accounts, designed to grow your wealth with guaranteed returns.
                </p>
                <p className="text-[11px] text-rose-400 font-semibold mt-3">
                  * Interest rate up to 5% p.a
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVATE BANKING CALL BANNER matching screenshot 9 */}
      <section className="bg-slate-900 py-12 px-4 sm:px-6 border-t border-slate-800 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto md:mx-0">
              <Headphones className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold">Call for Private Banking</h3>
            <a
              href="tel:+4592403018"
              className="text-2xl sm:text-3xl font-extrabold text-rose-500 block hover:underline"
            >
              +45 924 03018
            </a>
            <p className="text-xs text-slate-400">
              Dedicated portfolio managers available 24 hours a day
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToRegister}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition-all"
            >
              Open Amelia Robert Account
            </button>
            <button
              onClick={onGoToLogin}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              Sign In Portal
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER matching screenshot 10 */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <CredrollLogo variant="crimson" size="md" />

            <div className="space-y-1">
              <a
                href="tel:+4592403018"
                className="text-xl font-bold text-white hover:text-rose-400 block"
              >
                +45 924 03018
              </a>
              <span className="text-xs text-slate-500 block">Customer Care</span>
              <p className="text-xs text-slate-300 font-semibold">
                Mon – Fri: 9.00am to 5.00pm <span className="text-slate-500 font-normal">Banking Hours</span>
              </p>
            </div>

            {/* Quick Action Buttons matching screenshot 10 */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => alert('Official Credroll PDF disclosure and enrollment forms package downloaded.')}
                className="px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-slate-400" />
                <span>Download Forms</span>
              </button>
              <button
                onClick={() => alert('Consumer grievance desk accessed. Ref: TICKET-2026-REG')}
                className="px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquareWarning className="w-4 h-4 text-slate-400" />
                <span>Register Your Complaint</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2021 - 2026 Credroll Credit Union. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#about" className="hover:text-white transition-colors">About Us</a>
              <a href="#accounts" className="hover:text-white transition-colors">All Accounts</a>
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Appointment Modal */}
      {appointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Make an Appointment</h3>
            {appointmentSubmitted ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs font-bold text-emerald-600">Appointment Scheduled!</p>
                <p className="text-xs text-slate-500">A Credroll VIP banker will reach out at +45 924 03018.</p>
                <button
                  onClick={() => {
                    setAppointmentSubmitted(false);
                    setAppointmentModal(false);
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Amelia Robert)"
                  defaultValue="Amelia Robert"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <input
                  type="date"
                  defaultValue="2026-11-15"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs">
                  <option>Corporate Treasury Consultation</option>
                  <option>Private Wealth Portfolio</option>
                  <option>Commercial Loan Application</option>
                </select>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setAppointmentModal(false)}
                    className="flex-1 py-2 rounded-xl border text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setAppointmentSubmitted(true)}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
