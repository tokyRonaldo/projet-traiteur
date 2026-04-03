interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  isFilledIcon?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, iconBg, iconColor, isFilledIcon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bf3a2b]/5 hover:shadow-xl hover:shadow-[#bf3a2b]/5 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 ${iconBg} ${iconColor} rounded-lg`}>
        <span className="material-symbols-outlined" style={isFilledIcon ? { fontVariationSettings: "'FILL' 1" } : {}}>
          {icon}
        </span>
      </div>
      <span className={`${trend.includes('+') ? 'text-emerald-600' : 'text-[#bf3a2b]'} text-xs font-bold`}>
        {trend}
      </span>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-3xl font-black text-[#333333] mt-1">{value}</h3>
  </div>
);

export default StatCard;