// components/ui/CategoryCard.tsx
interface CategoryCardProps {
  title: string;
  description: string;
  image?: string | null;
}

export default function CategoryCard({ title, description, image }: CategoryCardProps) {
  return (
    <div className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br from-primary/20 to-primary/5">
      {image && (
        <>
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className={`text-xl font-bold ${image ? 'text-white' : 'text-primary'}`}>{title}</h3>
        <p className={`text-sm ${image ? 'text-white/80' : 'opacity-70'}`}>{description}</p>
      </div>
    </div>
  );
}