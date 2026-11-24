import { Suspense } from "react";
import CatererLayout from "@/components/caterer/CatererLayout";
import Settings from "@/components/caterer/settings/Settings";

export default function CatererSettings() {
  return (
    <Suspense fallback={<div className="p-6">Chargement...</div>}>
      <CatererLayout>
          <Settings />
      </CatererLayout>
    </Suspense>
    
  );
}