"use client";

import { Suspense } from "react";
import CommandHistoryContent from "./CommandHistoryContent";

export default function CommandHistoryPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px 20px", textAlign: "center" }}>Chargement...</div>}>
      <CommandHistoryContent />
    </Suspense>
  );
}
