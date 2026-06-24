"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth";
import { useLanguageStore, type Language } from "@/app/store/language";
import { useTranslation } from "@/app/hooks/useTranslation";
import { Menu, X, User, Settings, LogOut, Globe, HelpCircle } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, userProfile, logout, isLoading } = useAuthStore();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const languages: { code: Language; label: string }[] = [
    { code: "fr", label: t("common.french", "Français") },
    { code: "en", label: t("common.english", "English") },
    { code: "es", label: t("common.spanish", "Español") },
    { code: "wo", label: t("common.wolof", "Wolof") },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            📦 Livraison Pro
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              {t("nav.home", "Home")}
            </Link>
            <Link href="/tarifs" className="text-gray-700 hover:text-blue-600 transition">
              {t("nav.delivery", "Delivery")}
            </Link>
            <Link href="/boutique" className="text-gray-700 hover:text-blue-600 transition">
              {t("nav.shop", "Shop")}
            </Link>
            <Link href="/help" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              {t("help.title", "Help")}
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-semibold">{currentLanguage.toUpperCase()}</span>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10">
                  {languages.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 transition ${
                        currentLanguage === code
                          ? "bg-blue-100 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-semibold">{userProfile?.displayName}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <Link
                      href="/settings"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      <Settings className="w-4 h-4" />
                      {t("nav.settings", "Settings")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("nav.logout", "Logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-sm"
                >
                  {t("nav.login", "Login")}
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                >
                  {t("nav.register", "Register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Language Selector Mobile */}
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Globe className="w-5 h-5 text-gray-700" />
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t pt-4">
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
              {t("nav.home", "Home")}
            </Link>
            <Link href="/tarifs" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
              {t("nav.delivery", "Delivery")}
            </Link>
            <Link href="/boutique" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
              {t("nav.shop", "Shop")}
            </Link>
            <Link href="/help" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
              {t("help.title", "Help")}
            </Link>

            {/* Language Menu Mobile */}
            {isLanguageMenuOpen && (
              <div className="px-4 py-2 bg-gray-50 rounded-lg space-y-1">
                {languages.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code);
                      setIsLanguageMenuOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded transition ${
                      currentLanguage === code
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Auth Mobile */}
            <div className="border-t pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 font-semibold text-gray-700">{userProfile?.displayName}</div>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    {t("nav.settings", "Settings")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    {t("nav.logout", "Logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
                  >
                    {t("nav.login", "Login")}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    {t("nav.register", "Register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
