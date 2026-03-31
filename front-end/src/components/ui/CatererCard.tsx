import { Button } from './Button';
import Badge from './Badge';

interface CatererCardProps {
  name: string;
  cuisine: string;
  rating: number;
  price: number;
  image: string;
  featured?: boolean;
}

export default function CatererCard({ name, cuisine, rating, price, image, featured }: CatererCardProps) {
  return (
    <div className="group bg-background-light dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-primary/5">
      <div className="h-56 overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {featured && <Badge variant="featured" className="absolute top-4 right-4">Featured</Badge>}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{name}</h3>
          <div className="flex items-center text-secondary">
            <span className="material-symbols-outlined text-sm fill-1">star</span>
            <span className="text-sm font-bold ml-1">{rating}</span>
          </div>
        </div>
        <p className="text-sm opacity-60 mb-4">{cuisine}</p>

        <div className="flex justify-between items-center border-t border-primary/10 pt-4">
          <div>
            <span className="text-xs opacity-60 block">Starts from</span>
            <span className="font-bold text-primary text-lg">${price} / person</span>
          </div>
          <Button variant="ghost" size="sm" icon={<span className="material-symbols-outlined">chevron_right</span>}>
          </Button>
        </div>
      </div>
    </div>
  );
}