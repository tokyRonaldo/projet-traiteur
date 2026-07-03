'use client';

export default function StatCard({ title, value, icon, highlight }: any) {
  return (
    <div
      className={`p-4 rounded-xl border flex items-center gap-3 ${
        highlight ? 'bg-primary text-white' : 'bg-surface-container-low'
      }`}
    >
      <span className="material-symbols-outlined">{icon}</span>

      <div>
        <p className="text-xs uppercase opacity-70">{title}</p>
        <p className="font-bold text-lg">{value}</p>
      </div>
    </div>
  );
}