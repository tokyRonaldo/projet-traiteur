'use client';

export default function CatererCard({ name, rating, price }: any) {
  return (
    <div className="border rounded-xl p-3 flex justify-between items-center hover:shadow-md transition">
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-xs text-gray-500">Premium Caterer</p>
      </div>

      <div className="text-right">
        <p className="text-sm">⭐ {rating}</p>
        <p className="text-xs text-primary">{price}</p>
      </div>
    </div>
  );
}