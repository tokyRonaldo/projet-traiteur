import Badge from './Badge';
import { Button } from './Button';

interface CatererSearchCardProps {
  name: string;
  rating: number;
  priceLevel: string;
  cuisines: string[];
  location: string;
  image: string;
}

export default function CatererSearchCard({
  name,
  rating,
  priceLevel,
  cuisines,
  location,
  image,
}: CatererSearchCardProps) {
  return (
    <div className="flex flex-col bg-white dark:bg-background-dark rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group">
      <div
        className="relative h-48 w-full bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-sm fill-1">star</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">{rating}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg leading-tight">{name}</h3>
          <span className="text-primary font-bold text-sm">{priceLevel}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {cuisines.map((cuisine, i) => (
            <Badge key={i} variant="secondary">{cuisine}</Badge>
          ))}
        </div>

        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mt-auto">
          <span className="material-symbols-outlined text-sm">location_on</span>
          <span>{location}</span>
        </div>

        <Button variant="primary" className="mt-2 w-full">
          View Profile
        </Button>
      </div>
    </div>
  );
}