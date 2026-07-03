// components/admin/Badge.tsx
export default function Badge({ status }: { status: boolean | string }) {
  const isPositive = status === true || status === 'active' || status === 'completed' || status === 'accepted';
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {typeof status === 'boolean' ? (status ? 'Actif' : 'Inactif') : status}
    </span>
  );
}