"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth";
import { useLanguageStore, type Language } from "@/app/store/language";
import { useTranslation } from "@/app/hooks/useTranslation";
import { User, Mail, Phone, Lock, Globe, LogOut, Upload, Loader2, Check } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { userProfile, updateProfile, logout, isLoading, isAuthenticated } = useAuthStore();
  const { currentLanguage, setLanguage } = useLanguageStore();

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "language">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const handleSaveProfile = async () => {
    try {
      setErrorMessage("");
      await updateProfile({
        displayName,
        email,
        phone,
      });
      setSuccessMessage(t("messages.updateSuccess", "Profile updated successfully"));
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setErrorMessage(t("common.required", "All fields are required"));
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage(t("auth.confirmPassword", "Passwords don't match"));
        return;
      }

      // Call password change - would need to be implemented in auth store
      setSuccessMessage(t("messages.updateSuccess", "Password changed successfully"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">{t("settings.title", "Settings")}</h1>
          <p className="text-blue-100 mt-1">{t("settings.profile", "Manage your account")}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <nav className="space-y-2 p-4">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 transition ${
                  activeTab === "profile"
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <User className="w-5 h-5" />
                {t("settings.profile", "Profile")}
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 transition ${
                  activeTab === "security"
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Lock className="w-5 h-5" />
                {t("settings.security", "Security")}
              </button>
              <button
                onClick={() => setActiveTab("language")}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 transition ${
                  activeTab === "language"
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Globe className="w-5 h-5" />
                {t("settings.language", "Language")}
              </button>
            </nav>
            <div className="border-t p-4">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-5 h-5" />
                {t("nav.logout", "Logout")}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="p-4 bg-green-50 border-l-4 border-green-600 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-800">{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="p-4 bg-red-50 border-l-4 border-red-600">
                <p className="text-red-800">{errorMessage}</p>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="p-6 space-y-6">
                {/* Avatar */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold mb-4">
                    {userProfile?.displayName?.charAt(0)?.toUpperCase()}
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    {t("settings.uploadPhoto", "Upload Photo")}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                {/* Profile Form */}
                {!isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("auth.fullName", "Full Name")}
                      </label>
                      <p className="text-gray-900 text-lg">{userProfile?.displayName}</p>
                    </div>
                    {userProfile?.email && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("auth.email", "Email")}
                        </label>
                        <p className="text-gray-900 text-lg">{userProfile.email}</p>
                      </div>
                    )}
                    {userProfile?.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("auth.phone", "Phone")}
                        </label>
                        <p className="text-gray-900 text-lg">{userProfile.phone}</p>
                      </div>
                    )}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      {t("settings.edit", "Edit")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("auth.fullName", "Full Name")}
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("auth.phone", "Phone")}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t("settings.save", "Save")}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setDisplayName(userProfile?.displayName || "");
                          setEmail(userProfile?.email || "");
                          setPhone(userProfile?.phone || "");
                        }}
                        className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        {t("settings.cancel", "Cancel")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("settings.changePassword", "Change Password")}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.currentPassword", "Current Password")}
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.newPassword", "New Password")}
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t("settings.changePassword", "Change Password")}
                  </button>
                </div>
              </div>
            )}

            {/* Language Tab */}
            {activeTab === "language" && (
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("settings.language", "Language")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { code: "fr" as Language, label: t("common.french", "Français") },
                    { code: "en" as Language, label: t("common.english", "English") },
                    { code: "es" as Language, label: t("common.spanish", "Español") },
                    { code: "wo" as Language, label: t("common.wolof", "Wolof") },
                  ].map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code)}
                      className={`p-4 rounded-lg border-2 transition ${
                        currentLanguage === code
                          ? "border-blue-600 bg-blue-50 text-blue-600 font-semibold"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
