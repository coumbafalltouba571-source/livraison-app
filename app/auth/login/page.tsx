"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth";
import { useTranslation } from "@/app/hooks/useTranslation";
import { Mail, Phone, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signInWithEmail, sendOTP, signInWithGoogle, isLoading, error, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"email" | "phone" | "google">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [localError, setLocalError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError(t("common.required", "Required field"));
      return;
    }

    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message);
      } else {
        setLocalError(String(err));
      }
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    console.log("🔵 [LOGIN] Phone login initiated with phone:", phone);

    if (!phone) {
      setLocalError(t("common.required", "Required field"));
      return;
    }

    try {
      console.log("🔵 [LOGIN] Sending OTP for phone login...");
      await sendOTP(phone);
      console.log("✅ [LOGIN] OTP sent, redirecting to verify page...");
      
      // Store phone for potential use after verification
      sessionStorage.setItem('pendingPhoneLogin', phone);
      router.push("/auth/verify-otp");
    } catch (err: unknown) {
      console.error("❌ [LOGIN] Phone login failed:", err);
      if (err instanceof Error) {
        setLocalError(err.message);
      } else {
        setLocalError(String(err));
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError("");
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message);
      } else {
        setLocalError(String(err));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white text-center">{t("auth.login", "Login")}</h1>
          <p className="text-blue-100 text-center text-sm mt-2">{t("common.pleaseWait", "Please wait...")}</p>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {(localError || error) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{localError || error}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeTab === "email"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600"
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              {t("auth.email", "Email")}
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeTab === "phone"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600"
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              {t("auth.phone", "Phone")}
            </button>
            <button
              onClick={() => setActiveTab("google")}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeTab === "google"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600"
              }`}
            >
              <svg className="w-4 h-4 inline mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z" />
              </svg>
              Google
            </button>
          </div>

          {/* Email Tab */}
          {activeTab === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("auth.email", "Email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("auth.password", "Password")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("auth.signIn", "Sign In")}
              </button>
            </form>
          )}

          {/* Phone Tab */}
          {activeTab === "phone" && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("auth.phone", "Phone")}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="773629075 ou +221773629075"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Entrez votre numéro Sénégal (9 ou 12 chiffres)</p>
              </div>
              
              {/* reCAPTCHA Container - IMPORTANT! */}
              <div id="recaptcha-container" className="mb-4"></div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("auth.sendCode", "Send Verification Code")}
              </button>
            </form>
          )}

          {/* Google Tab */}
          {activeTab === "google" && (
            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {t("auth.loginWithGoogle", "Sign In with Google")}
              </button>
            </div>
          )}

          {/* Links */}
          <div className="mt-6 space-y-2">
            <p className="text-center text-gray-600">
              {t("auth.noAccount", "Don't have an account?")}{" "}
              <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
                {t("auth.register", "Sign Up")}
              </Link>
            </p>
            <p className="text-center">
              <Link href="/auth/forgot-password" className="text-sm text-gray-600 hover:text-blue-600">
                {t("auth.forgotPassword", "Forgot Password?")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
