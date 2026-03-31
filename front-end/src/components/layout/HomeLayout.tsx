import Header from './Header';
import Footer from './Footer';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-neutral-text dark:text-slate-100 min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}