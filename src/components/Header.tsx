import React, { useState } from 'react';
import { Menu, Bell, Settings, X } from 'lucide-react';
import { UserAccount } from '../types/index.ts';
import { CredrollLogo } from './CredrollLogo.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { ProfileDropdown } from './ProfileDropdown.tsx';
import { sounds } from '../utils/audio.ts';

interface HeaderProps {
  user: UserAccount;
  onOpenSidebar: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenSidebar,
  onLogout,
  onOpenSettings,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Green Welcome Alert Banner matching screenshot 12 */}
      {showWelcomeBanner && (
        <div className="bg-[#10b981] text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-bold tracking-wide transition-all">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="truncate">
              Welcome Back {user.name.toUpperCase()} !
            </span>
          </div>
          <button
            onClick={() => setShowWelcomeBanner(false)}
            className="text-[11px] font-black tracking-wider uppercase text-white hover:text-emerald-100 px-2 py-0.5 rounded-sm hover:bg-black/10 transition-colors cursor-pointer shrink-0"
          >
            CLOSE
          </button>
        </div>
      )}

      {/* Main Navbar matching screenshot 12 & 14 */}
      <div className="bg-[#244fe5] text-white px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Credroll logo and hamburger */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenSidebar();
            }}
            className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          <div className="cursor-pointer" onClick={onOpenSidebar}>
            <CredrollLogo variant="white" size="sm" showText={false} />
          </div>
        </div>

        {/* Right: Notifications, Settings, Language, and Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenNotifications();
            }}
            className="relative p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {user.inboxUnreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-[#244fe5]" />
            )}
          </button>

          {/* Settings Gear */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
            title="Account Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Language Selector Pill with UK Flag matching screenshot 12 */}
          <LanguageSelector variant="red" />

          {/* User Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sounds.playClick();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              className="flex items-center p-0.5 rounded-full ring-2 ring-white/50 hover:ring-white transition-all cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            <ProfileDropdown
              user={user}
              isOpen={profileDropdownOpen}
              onClose={() => setProfileDropdownOpen(false)}
              onLogout={onLogout}
              onOpenProfile={onOpenProfile}
              onOpenInbox={onOpenNotifications}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
