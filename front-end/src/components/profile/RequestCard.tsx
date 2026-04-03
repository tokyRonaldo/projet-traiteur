interface RequestProps {
  title: string;
  details: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
  image: string;
}

export const RequestCard = ({ title, details, status, image }: RequestProps) => {
  const statusStyles = {
    Confirmed: "bg-orange-100 text-orange-700",
    Pending: "bg-blue-50 text-blue-700",
    Completed: "bg-green-50 text-green-700"
  };

  return (
    <div className={`bg-surface p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-outline-variant/10 ${status === 'Completed' ? 'opacity-75 bg-surface/50' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ${status === 'Completed' ? 'grayscale bg-slate-100' : 'bg-orange-100'}`}>
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-on-surface">{title}</h3>
          <p className="text-sm text-on-surface-variant">{details}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusStyles[status]}`}>
          {status}
        </span>
        <button className="p-2 hover:bg-orange-50 rounded-full transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </div>
  );
};