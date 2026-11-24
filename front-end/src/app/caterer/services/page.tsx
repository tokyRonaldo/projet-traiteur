// src/app/caterer/services/page.tsx
import { Suspense } from "react";
import CatererLayout from "@/components/caterer/CatererLayout";
import Services from "@/components/caterer/service/Service";

export default function CatererService() {
  return (
    <Suspense fallback={<div className="p-6">Chargement...</div>}>
      <CatererLayout>
        <Services />
      </CatererLayout>
    </Suspense>
  );
}