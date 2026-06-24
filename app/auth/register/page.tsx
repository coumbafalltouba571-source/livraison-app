"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth";
import { useTranslation } from "@/app/hooks/useTranslation";
import { Mail, Phone, User, Lock, Loader2, ChevronRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signUpWithEmail, signUpWithPhone, isLoading, error, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState<"method" | "email" | "phone">("method");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phonePassword, setPhonePassword] = useState("");
  const [phoneConfirmPassword, setPhoneConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setLocalError(t("common.required", "Required field"));
      return;
    }

    if (password !== confirmPassword) {
      setLocalError(t("auth.confirmPassword", "Passwords don't match"));
      return;
    }

    try {
      await signUpWithEmail(email, password, fullName);
      router.push("/auth/verify-email");
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  const handlePhoneSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!fullName || !phone || !phonePassword || !phoneConfirmPassword) {
      setLocalError(t("common.required", "Required field"));
      return;
    }

    if (phonePassword !== phoneConfirmPassword) {
      setLocalError(t("auth.confirmPassword", "Passwords don't match"));
      return;
    }

    try {
      await signUpWithPhone(phone, phonePassword, fullName);
      router.push("/auth/verify-otp");
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white text-center">{t("auth.register", "Sign Up")}</h1>
          <p className="text-blue-100 text-center text-sm mt-2">
            {step === "method" ? t("auth.register", "Create your account") : ""}
          </p>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {(localError || error) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{localError || error}</p>
            </div>
          )}

          {/* Step 1: Choose Method */}
          {step === "method" && (
            <div className="space-y-3">
              <button
                onClick={() => setStep("email")}
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">{t("auth.registerWithEmail", "Sign Up with Email")}</p>
                    <p className="text-xs text-gray-500">Email + Mot de passe</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => setStep("phone")}
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">{t("auth.registerWithPhone", "Sign Up with Phone")}</p>
                    <p className="text-xs text-gray-500">Téléphone + Mot de passe</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </button>
            </div>
          )}

          {/* Step 2: Email Registration */}
          {step === "email" && (
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("auth.fullName", "Full Name")}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("auth.confirmPassword", "Confirm Password")}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {t("auth.signUp", "Sign Up")}
              </button>
              <button
                type="button"
                onClick={() => setStep("method")}
                className="w-full text-gray-600 py-2 hover:text-gray-800"
              >
                ← {t("common.cancel", "Cancel")}
              </button>
            </form>
          )}

          {/* Step 2: Phone Registration */}
          {step === "phone" && (
            <form onSubmit={handlePhoneSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("auth.fullName", "Full Name")}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("auth.phone", "Phone Number")}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 77 123 45 67"
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
                  value={phonePassword}
                  onChange={(e) => setPhonePassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("auth.confirmPassword", "Confirm Password")}
                </label>
                <input
                  type="password"
                  value={phoneConfirmPassword}
                  onChange={(e) => setPhoneConfirmPassword(e.target.value)}
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
                {t("auth.signUp", "Sign Up")}
              </button>
              <button
                type="button"
                onClick={() => setStep("method")}
                className="w-full text-gray-600 py-2 hover:text-gray-800"
              >
                ← {t("common.cancel", "Cancel")}
              </button>
            </form>
          )}

          {/* Links */}
          <div className="mt-6 text-center text-gray-600">
            {t("auth.haveAccount", "Already have an account?")}{" "}
            <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
              {t("auth.login", "Login")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
