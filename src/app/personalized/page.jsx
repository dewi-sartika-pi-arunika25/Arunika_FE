"use client";

import { Suspense } from "react";
import PersonalizedPage from "./PersonalizedPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="text-center mt-10 text-neutral-500">Memuat data pribadi...</div>}>
        <PersonalizedPage />
      </Suspense>
    </ProtectedRoute>
  );
}
