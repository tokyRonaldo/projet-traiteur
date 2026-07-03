import SearchHeader from '@/components/layout/SearchHeader';
import SearchFooter from '@/components/layout/SearchFooter';
import SidebarFilters from '@/components/search/SidebarFilters';
import SortingBar from '@/components/search/SortingBar';
import CatererGrid from '@/components/search/CatererGrid';
import Pagination from '@/components/search/Pagination';

export default function SearchPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <SearchHeader />

      <main className="flex-1 flex flex-col md:flex-row max-w-[1440px] mx-auto w-full px-4 md:px-10 py-6 gap-8">
        <SidebarFilters />

        <div className="flex-1 flex flex-col gap-6">
          <SortingBar />
          <CatererGrid />
          <Pagination />
        </div>
      </main>

      <SearchFooter />
    </div>
  );
}