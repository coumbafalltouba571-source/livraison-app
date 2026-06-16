"use client";

import { useState } from "react";
import AdminProtection from "@/app/components/AdminProtection";
import AdminPremiumDashboard from "@/app/components/AdminPremiumDashboard";

export default function AdminPage() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("adminAccess") === "true") {
      return true;
    }
    return false;
  });

  return (
    <>
      <AdminProtection onUnlock={() => setIsUnlocked(true)} />
      {isUnlocked && <AdminPremiumDashboard />}
    </>
  );
}