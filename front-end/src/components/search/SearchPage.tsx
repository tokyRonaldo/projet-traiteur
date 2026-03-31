import SearchHeader from '../layout/SearchHeader';
import SearchFooter from '../layout/SearchFooter';
import SidebarFilters from '../search/SidebarFilters';
import SortingBar from '../search/SortingBar';
import CatererGrid from '../search/CatererGrid';
import Pagination from '../search/Pagination';

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