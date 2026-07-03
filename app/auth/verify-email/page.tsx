"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth";
import { useTranslation } from "@/app/hooks/useTranslation";
import { Mail, Loader2, Check } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { userProfile, isLoading } = useAuthStore();
  const [verified, setVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    // Simulated verification check - in real app, check Firebase
    const timer = setTimeout(() => {
      setVerified(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (verified) {
      const redirectTimer = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(redirectTimer);
    }
  }, [verified, router]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleResend = () => {
    setResendCountdown(60);
    // Trigger resend logic here
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-lg">
            <Check className="w-12 h-12 text-white mx-auto" />
            <h1 className="text-2xl font-bold text-white mt-2">{t("auth.verifyEmail", "Email Verified!")}</h1>
          </div>
          <div className="p-6">
            <p className="text-green-600 mb-4">{t("messages.emailVerified", "Your email has been verified")}</p>
            <p className="text-gray-600">Redirection en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-lg text-center">
          <Mail className="w-12 h-12 text-white mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">{t("auth.verifyEmail", "Verify Email")}</h1>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              {t("common.pleaseWait", "Please wait...")} Un email de vérification a été envoyé à:
            </p>
            <p className="font-semibold text-blue-600">{userProfile?.email}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              📧 Veuillez cliquer sur le lien de vérification dans l&apos;email pour activer votre compte.
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>

          <button
            onClick={handleResend}
            disabled={resendCountdown > 0 || isLoading}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
          >
            {resendCountdown > 0
              ? `${t("auth.resendCode", "Resend Code")} (${resendCountdown}s)`
              : t("auth.resendCode", "Resend Email")}
          </button>
        </div>
      </div>
    </div>
  );
}
