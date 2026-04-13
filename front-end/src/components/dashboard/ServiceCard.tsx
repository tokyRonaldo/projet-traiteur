interface ServiceCardProps {
  title: string;
  price: number;
  image: string;
  badge: string;
  tags: string[];
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, price, image, badge, tags, description }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#bf3a2b]/5 group hover:shadow-xl transition-all">
    <div className="h-48 relative overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-4 left-4 backdrop-blur-md bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-[#bf3a2b]">
        {badge}
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-bold text-[#333333]">{title}</h4>
        <p className="text-[#bf3a2b] font-black">${price}<span className="text-slate-400 text-xs font-normal">/pp</span></p>
      </div>
      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center border-t border-slate-50 pt-4">
        <div className="flex -space-x-2">
          {tags.map(tag => (
            <div key={tag} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">
              {tag}
            </div>
          ))}
        </div>
        <button className="text-xs font-bold text-slate-400 hover:text-[#bf3a2b] transition-colors">Manage Service</button>
      </div>
    </div>
  </div>
);

export default ServiceCard;