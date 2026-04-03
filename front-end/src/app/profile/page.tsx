import { RequestCard } from "@/components/profile/RequestCard";

export default function ClientDashboard() {
  return (
    <>
      <div className="flex-1 p-6 lg:p-10 space-y-12">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-on-surface leading-tight tracking-tight">
              Catering<br /><span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-on-surface-variant mt-2 max-w-md">Welcome back to your hearth.</p>
          </div>
          <button className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span> New Inquiry
          </button>
        </header>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-on-surface">My Requests</h2>
          </div>
          <div className="space-y-4">
            <RequestCard title="Wedding Dinner" details="Sept 24, 2024 • 120 Guests" status="Confirmed" image="https://lh3.googleusercontent.com/aida-public/AB6AXuDyFFr-pfj0rmqdM0rp_NTtmgUcehwHDfekdPV6UupmisXGADOJPHPldULQ1-ftv_VkokQEN1yKIKXArYrR23hmJVGT7Vbv1f48__ofq9gnck_IaUYUg1WD4z3ZSpSCsOegX70F3PLcQzZVdHU_WO2p6stWIUNrzFLN3TQs2ri-orbGmySAHFPU6k8dLFB5OiB2PItBqC6GuB3w3KqwqgVd8H2DV2fPTa6a3ZHasj56lIH5tQTJrDvNFo7vUFtQlN7tC92l-P0wYw8-" />
            <RequestCard title="Birthday Bash" details="Oct 12, 2024 • 45 Guests" status="Pending" image="https://lh3.googleusercontent.com/aida-public/AB6AXuDM99q6DDrmVZ2i0cTNUxPn2eI-oau7weiTpNgS-vEC8wKq69Sx83r2YnvWSq-tSOGfn0jU7hCbSmArGsRilt9M_C2bbU-z_vflD1uwz_dnjzW11-3ij9tkrHlF8yCw6AZH1VV7Ksp8qf24QBhve_4gF1hJwgVHe1RddK4KbFCnPBtuHjWSy99u_0sNheczgTQnMV6AdibYgUXj77sa_8ti6kI3MzSiZShAjXGpSkFp0nuDBIqp4soZf2E0RcA2EQUzA36SafyKug9d" />
            <RequestCard title="Corporate Gala" details="Aug 05, 2024 • 300 Guests" status="Completed" image="https://lh3.googleusercontent.com/aida-public/AB6AXuAMNw1ocPBCMTUFkNhfHCtQXh8wzwIn1awXcweEPs1--V1PcqiaOud0AHn-hsUuM6-wXLrIV8LJb0AU7XNLB9uWKPoVjTR-KdT_M7Fh3jSdU7OKDavtYHKn-of_gDgQy0pyPq9njUFUjk-3VwUodqqOFxZoEbBwsp-NSf-rQ-VtIypFaNQNwbAuVOmxNv8BEP1Rw3WXqSIq4x9MqJPeMTBVhdYncvn5FVgra828k_7dRe1UbxhHYyR4iVyzTQ5CfFOuKt_M1-9nYP9B" />
          </div>
        </section>
      </div>

      {/* Barre de droite (Profil & Stats) */}
      <aside className="w-full lg:w-96 bg-white/40 backdrop-blur-sm border-l border-orange-100 p-8 space-y-10">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ2Szy7aN2Noe1WLyQLeKtGhBQsPbN9qfgkCsYRoBT33pOXbXiATDTqscT1ngnQ7qsbSvwctEIKT6V1qeTSxqa3EtSdpdMdv32OqcQqWHzjndoBejAcPJEwVc1yNmc2VDUWK84ohzHe_AdAPjX5guJz4FeUwKJzfn9Yb_tjJG4bQZK-uifVfowpfxge_LxmL8UaZR6kB_j2yO9b_8vLybwO7BKn_YcTuyw98QWPW-BCP-6PZmC83DS29ifkFOIeW_K_5gZD-rphssm" className="w-24 h-24 rounded-full border-4 border-white shadow-xl mx-auto" alt="Profile" />
            <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
          </div>
          <h3 className="text-xl font-black text-on-surface">Julian Marc-Antony</h3>
          <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: 'restaurant', val: '24', label: 'Requests', color: 'text-primary', bg: 'bg-primary/10' },
            { icon: 'bookmark', val: '12', label: 'Saved', color: 'text-secondary', bg: 'bg-secondary/10' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-5 rounded-2xl shadow-sm border border-outline-variant/5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <div><p className="text-2xl font-black">{stat.val}</p><p className="text-xs uppercase font-medium">{stat.label}</p></div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}