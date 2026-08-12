// app/caterers/[id]/page.tsx
import HomeLayout from '@/components/layout/HomeLayout';
import PublicCatererProfile from '@/components/caterer/PublicCatererProfile';

export default function PublicCatererProfilePage({ params }: { params: { id: string } }) {
  return (
    <HomeLayout>
      <PublicCatererProfile catererId={params.id} />
    </HomeLayout>
  );
}