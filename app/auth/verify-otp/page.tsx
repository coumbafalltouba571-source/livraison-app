"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth";
import { useTranslation } from "@/app/hooks/useTranslation";
import { Phone, Loader2, Check } from "lucide-react";

export default function VerifyOTPPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { userProfile, isLoading } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [error, setError] = useState("");

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

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError(t("auth.verificationCode", "Please enter all 6 digits"));
      return;
    }

    // Simulate verification
    setVerified(true);
  };

  const handleResend = () => {
    setResendCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    // Trigger resend logic here
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-lg">
            <Check className="w-12 h-12 text-white mx-auto" />
            <h1 className="text-2xl font-bold text-white mt-2">{t("messages.phoneVerified", "Phone Verified!")}</h1>
          </div>
          <div className="p-6">
            <p className="text-green-600 mb-4">Votre téléphone a été vérifié</p>
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
          <Phone className="w-12 h-12 text-white mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">{t("auth.verifyPhone", "Verify Phone")}</h1>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              {t("auth.enterCode", "Enter the code you received")} sur:
            </p>
            <p className="font-semibold text-blue-600">{userProfile?.phone}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              {t("auth.verificationCode", "6-Digit Code")}
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && index > 0) {
                      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
                      prevInput?.focus();
                    }
                  }}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:border-blue-600 focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("auth.continuee", "Continue")}
          </button>

          <button
            onClick={handleResend}
            disabled={resendCountdown > 0 || isLoading}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
          >
            {resendCountdown > 0
              ? `${t("auth.resendCode", "Resend Code")} (${resendCountdown}s)`
              : t("auth.resendCode", "Resend Code")}
          </button>
        </div>
      </div>
    </div>
  );
}
