interface StatsCardProps {
  icon: string;
  value: string;
  label: string;
  variant: 'primary' | 'secondary' | 'tertiary';
}

export const StatsCard = ({ icon, value, label, variant }: StatsCardProps) => {
  const themes = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    tertiary: "bg-tertiary/10 text-tertiary",
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-outline-variant/5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${themes[variant]}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-black text-on-surface">{value}</p>
        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
};