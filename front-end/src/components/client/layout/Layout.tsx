import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Sidebar />
            <Header />

            <main className="ml-64 pt-24 px-10 pb-10">
                {children}
            </main>
        </>
    );
}