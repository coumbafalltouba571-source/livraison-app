"use client";

import { useState, useEffect } from "react";
import AdminProtection from "@/app/components/AdminProtection";
import AdminPremiumDashboard from "@/app/components/AdminPremiumDashboard";

export default function AdminPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Vérifier si déjà déverrouillé dans cette session au chargement
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("adminAccess") === "true") {
      setIsUnlocked(true);
    }
  }, []);

  return (
    <>
      <AdminProtection onUnlock={() => setIsUnlocked(true)} />
      {isUnlocked && <AdminPremiumDashboard />}
    </>
  );
}