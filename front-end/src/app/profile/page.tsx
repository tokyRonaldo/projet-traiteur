import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ConciergeCard } from "@/components/dashboard/ConsciergeCard";
import { RequestCard } from "@/components/profile/RequestCard";
export default function DashboardPage() {
  return (
    <>
      {/* ZONE CENTRALE */}
      <div className="flex-1 p-6 lg:p-10 space-y-12">
        {/* ... (Header & RequestCards comme précédemment) */}
        <section className="space-y-4">
           <RequestCard title="Wedding Dinner" details="Sept 24, 2024 • 120 Guests" status="Confirmed" image="https://lh3.googleusercontent.com/aida-public/AB6AXuDyFFr-pfj0rmqdM0rp_NTtmgUcehwHDfekdPV6UupmisXGADOJPHPldULQ1-ftv_VkokQEN1yKIKXArYrR23hmJVGT7Vbv1f48__ofq9gnck_IaUYUg1WD4z3ZSpSCsOegX70F3PLcQzZVdHU_WO2p6stWIUNrzFLN3TQs2ri-orbGmySAHFPU6k8dLFB5OiB2PItBqC6GuB3w3KqwqgVd8H2DV2fPTa6a3ZHasj56lIH5tQTJrDvNFo7vUFtQlN7tC92l-P0wYw8-" />
           {/* etc... */}
        </section>
      </div>

      {/* BARRE LATÉRALE DROITE COMPLÈTE */}
      <aside className="w-full lg:w-96 bg-white/40 backdrop-blur-sm border-l border-orange-100 p-8 space-y-10">
        
        <ProfileCard 
          name="Julian Marc-Antony" 
          status="Platinum Client since 2022" 
          completion={85} 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ2Szy7aN2Noe1WLyQLeKtGhBQsPbN9qfgkCsYRoBT33pOXbXiATDTqscT1ngnQ7qsbSvwctEIKT6V1qeTSxqa3EtSdpdMdv32OqcQqWHzjndoBejAcPJEwVc1yNmc2VDUWK84ohzHe_AdAPjX5guJz4FeUwKJzfn9Yb_tjJG4bQZK-uifVfowpfxge_LxmL8UaZR6kB_j2yO9b_8vLybwO7BKn_YcTuyw98QWPW-BCP-6PZmC83DS29ifkFOIeW_K_5gZD-rphssm" 
        />

        <div className="grid grid-cols-1 gap-4">
          <StatsCard icon="restaurant" value="24" label="Total Requests" variant="primary" />
          <StatsCard icon="bookmark" value="12" label="Saved Caterers" variant="secondary" />
          <StatsCard icon="event" value="02" label="Upcoming Events" variant="tertiary" />
        </div>

        <ConciergeCard userName="Julian Marc-Antony" />

        {/* Petit rappel d'événement (Inline car très spécifique) */}
        <div className="p-4 rounded-2xl border-2 border-dashed border-orange-200">
          <p className="text-xs font-bold text-on-surface-variant mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">notifications_active</span>
            NEXT EVENT REMINDER
          </p>
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-lg text-white font-black text-center min-w-[40px]">
              <span className="block text-xs leading-none">SEP</span>
              <span className="text-lg leading-none">24</span>
            </div>
            <div>
              <p className="font-bold text-sm">Wedding Dinner Prep</p>
              <p className="text-xs text-on-surface-variant">Check final menu selection</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}