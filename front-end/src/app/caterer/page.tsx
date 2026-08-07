// app/caterers/page.tsx
import HomeLayout from '@/components/layout/HomeLayout';
import PublicCaterers from '@/components/caterer/PublicCaterers';

export default function CaterersPage() {
  return (
    <HomeLayout>
      <PublicCaterers />
    </HomeLayout>
  );
}