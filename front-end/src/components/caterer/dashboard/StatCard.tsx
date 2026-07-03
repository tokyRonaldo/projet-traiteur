type Props = {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
};

export default function StatCard({
  title,
  value,
  icon = "📊",
}: Props) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition">
      <div className="flex justify-between">
        <span>{icon}</span>
      </div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}