"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Crown, ChevronDown, User, LogOut, Mail, Handshake, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMembership } from "@/context/MembershipContext";
import SubscriptionModal from "./SubscriptionModal";
import { useAccount, useDisconnect, useConnectors } from "wagmi";

export default function GlobalHeader() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();

  // Access membership context
  const { tier } = useMembership();

  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Format member since date (mock: use expiry - duration or just fixed for demo if not stored)
  // For now, let's display "Member since [Month Year]" based on start date if available
  // Since we only store expiry, we'll estimate start or use "Active Member"
  // Requirement says: "Member since 2023/05"

  // For demo purposes, if they are pro, we just show a static or derived date. 
  // Let's assume start date was 1 month ago for monthly or 1 year ago for yearly if unknown.
  // Ideally context should provide this. Let's just say "Pro Member" for now and make it clickable to see details

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Protocols", href: "/protocols" },
    { name: "Strategy", href: "/strategies" },
    { name: "Research", href: "/research" },
    { name: "Game", href: "/game" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 relative">
              <Image
                src="/images/logos/logo.png"
                alt="DeFi Sentinel"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
              DeFi Sentinel
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-base font-medium transition-colors ${pathname === link.href
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              {/* Membership Badge / Link */}
              {tier === 'free' ? (
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-semibold hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                >
                  <Crown size={16} />
                  Upgrade
                </button>
              ) : (
                <Link href="/membership" className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                  <Crown size={16} />
                  Member since {new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit' })}
                </Link>
              )}

              {/* Custom Wallet Dropdown Trigger using ConnectButton.Custom */}
              <ConnectButton.Custom>
                {({ account, chain, openAccountModal, openChainModal, mounted }) => {
                  const ready = mounted;
                  if (!ready) return null;

                  return (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg font-semibold transition-colors border border-gray-200 dark:border-gray-700"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center text-[10px] text-white">
                          {account?.address?.substring(2, 4)}
                        </div>
                        <span className="text-sm">{account?.displayName}</span>
                        <ChevronDown size={14} className={`transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-gray-500 font-medium uppercase mb-1">Signed in as</p>
                            <p className="text-sm font-bold truncate">{account?.address}</p>
                          </div>

                          <div className="py-1">
                            <Link
                              href="/membership"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <User size={16} className="text-emerald-500" />
                              Membership Status
                            </Link>
                            <Link
                              href="/about#connect-with-us"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <Mail size={16} className="text-blue-500" />
                              Contact Us
                            </Link>
                            <Link
                              href="/about#connect-with-us"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <Handshake size={16} className="text-purple-500" />
                              Partner with us
                            </Link>
                          </div>

                          <div className="border-t border-gray-100 dark:border-gray-800 py-1">
                            <button
                              onClick={async () => {
                                setIsUserDropdownOpen(false);

                                // Clear all persistent storage FIRST to prevent auto-reconnect
                                if (typeof window !== 'undefined') {
                                  // Clear all wagmi-related storage
                                  const keysToRemove: string[] = [];
                                  for (let i = 0; i < window.localStorage.length; i++) {
                                    const key = window.localStorage.key(i);
                                    if (key && (key.startsWith('wagmi') || key.startsWith('rk-') || key.startsWith('walletconnect') || key.includes('wallet'))) {
                                      keysToRemove.push(key);
                                    }
                                  }
                                  keysToRemove.forEach(key => window.localStorage.removeItem(key));

                                  // Clear sessionStorage too
                                  const sessionKeysToRemove: string[] = [];
                                  for (let i = 0; i < window.sessionStorage.length; i++) {
                                    const key = window.sessionStorage.key(i);
                                    if (key && (key.startsWith('wagmi') || key.startsWith('rk-') || key.startsWith('walletconnect') || key.includes('wallet'))) {
                                      sessionKeysToRemove.push(key);
                                    }
                                  }
                                  sessionKeysToRemove.forEach(key => window.sessionStorage.removeItem(key));
                                }

                                // Disconnect all connectors
                                for (const connector of connectors) {
                                  try {
                                    await connector.disconnect();
                                  } catch (e) {
                                    // Some connectors may not be connected
                                  }
                                }

                                // Call wagmi's disconnect for cleanup
                                disconnect();
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                            >
                              <LogOut size={16} />
                              Log Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          ) : (
            <ConnectButton
              accountStatus="avatar"
              chainStatus="icon"
              showBalance={false}
            />
          )}
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-base font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            {isConnected && tier === 'free' && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsUpgradeModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-semibold mb-4"
              >
                <Crown size={16} />
                Upgrade to Pro
              </button>
            )}
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}

      <SubscriptionModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </header>
  );
}
