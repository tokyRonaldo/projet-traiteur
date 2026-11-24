// app/caterers/[id]/page.tsx
import HomeLayout from '@/components/layout/HomeLayout';
import PublicCatererProfile from '@/components/caterer/PublicCatererProfile';

export default async function PublicCatererProfilePage({ params }: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <HomeLayout>
      <PublicCatererProfile catererId={id} />
    </HomeLayout>
  );
}