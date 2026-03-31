interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
}

export default function CategoryCard({ title, description, image }: CategoryCardProps) {
  return (
    <div className="relative h-80 rounded-3xl overflow-hidden group shadow-xl cursor-pointer">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-6 left-6 text-white">
        <h4 className="text-2xl font-bold">{title}</h4>
        <p className="text-sm opacity-80">{description}</p>
      </div>
    </div>
  );
}