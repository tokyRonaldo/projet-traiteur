import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function DocumentUploadStep() {
  const [activeTab, setActiveTab] = useState("license");

  return (
    <div className="space-y-8">
      {/* Tabs internes pour les documents */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-surface-container p-1 rounded-2xl">
          <TabsTrigger value="license" className="rounded-xl py-3 font-medium">Business License</TabsTrigger>
          <TabsTrigger value="safety" className="rounded-xl py-3 font-medium">Food Safety</TabsTrigger>
          <TabsTrigger value="insurance" className="rounded-xl py-3 font-medium">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="license" className="mt-8">
          {/* Contenu Business License (upload vide) */}
          <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Business License</h3>
                <p className="text-sm text-slate-500">Official document issued by your local authority.</p>
              </div>
            </div>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-4xl text-outline mb-2 group-hover:text-primary transition-colors">cloud_upload</span>
              <p className="text-sm font-semibold text-on-surface">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (max. 10MB)</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="safety" className="mt-8">
          {/* Contenu Food Safety (uploading) - même code que précédemment */}
          <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">health_and_safety</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Food Safety Certificate</h3>
                <p className="text-sm text-slate-500">Active ServSafe or equivalent certification.</p>
              </div>
            </div>
            <div className="border border-outline-variant rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface-container-low rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">description</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold truncate max-w-[220px]">food_safety_2024.pdf</p>
                    <p className="text-xs text-slate-400">1.2 MB • Uploading...</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-3/4"></div>
                  </div>
                  <button className="text-slate-400 hover:text-error">
                    <span className="material-symbols-outlined">cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="mt-8">
          {/* Contenu Insurance (success) - même code que précédemment */}
          <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Insurance Documents</h3>
                <p className="text-sm text-slate-500">Proof of General Liability insurance.</p>
              </div>
            </div>
            <div className="border border-green-100 rounded-xl p-4 bg-green-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-green-600">check_circle</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">liability_coverage.pdf</p>
                    <p className="text-xs text-green-600 font-medium">Successfully uploaded</p>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-primary flex items-center gap-1 text-sm font-medium">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Replace
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Boutons finaux */}
      <div className="flex flex-col sm:flex-row gap-4 pt-8">
        <Button variant="secondary" className="flex-1" onClick={() => setActiveStep("step1")}>
          ← Back to Step 1
        </Button>
        <Button className="flex-1 text-lg font-black">
          Submit Registration
        </Button>
      </div>
    </div>
  );
}