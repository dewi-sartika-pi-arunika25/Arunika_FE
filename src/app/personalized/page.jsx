"use client";

import { Suspense } from "react";
import PersonalizedPage from "./PersonalizedPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-10 text-neutral-500">Memuat data pribadi...</div>}>
      <PersonalizedPage />
    </Suspense>
  );
}
