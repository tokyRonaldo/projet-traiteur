interface ProfileCardProps {
  name: string;
  status: string;
  completion: number;
  image: string;
}

export const ProfileCard = ({ name, status, completion, image }: ProfileCardProps) => (
  <div className="text-center space-y-4">
    <div className="relative inline-block">
      <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden mx-auto">
        <img alt={name} className="w-full h-full object-cover" src={image} />
      </div>
      <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
    </div>
    <div>
      <h3 className="text-xl font-black text-on-surface">{name}</h3>
      <p className="text-sm text-on-surface-variant">{status}</p>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
        <span>Profile Completion</span>
        <span>{completion}%</span>
      </div>
      <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-500" 
          style={{ width: `${completion}%` }}
        ></div>
      </div>
    </div>
  </div>
);