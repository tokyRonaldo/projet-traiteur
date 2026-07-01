'use client';
import { useEffect } from "react";
export default function Overview(){

    useEffect(() => {

        const mobileMenuBtn = document.querySelector('header button.md\\:hidden');

        const handleClick = () => {
            alert('Mobile navigation would slide in here.');
        };

        mobileMenuBtn?.addEventListener('click', handleClick);

        return () => {
            mobileMenuBtn?.removeEventListener('click', handleClick);
        };

    }, []);

    return(
    <>
    <style jsx>{`
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                vertical-align: middle;
            }
            .soft-shadow {
                box-shadow: 0 20px 40px rgba(151, 42, 24, 0.03);
            }
            .card-hover:hover {
                transform: translateY(-4px);
                box-shadow: 0 30px 60px rgba(151, 42, 24, 0.06);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            body {
                background-color: #fcf9f8; /* Secondary Cream */
                color: #1b1c1c; /* Charcoal */
    `}</style>   

    <div className="font-body-md text-body-md overflow-x-hidden">
    {/* SideNavBar Component (Persistent Shell) */}
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant z-50 hidden md:flex flex-col py-6 px-4">
    <div className="mb-10 px-2">
    <h1 className="font-headline-md text-headline-md text-primary">Artisanal Eats</h1>
    <div className="flex items-center gap-2 mt-2">
    <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest">Elite Partner</span>
    </div>
    </div>
    <nav className="flex-1 space-y-1 overflow-y-auto">
    {/* Active State: Overview */}
    <a className="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg font-bold transition-transform active:scale-[0.98]" href="#">
    <span className="material-symbols-outlined">dashboard</span>
    <span className="font-label-sm text-label-sm">Overview</span>
    </a>
    <a className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-container transition-all duration-200 rounded-lg" href="#">
    <span className="material-symbols-outlined">person</span>
    <span className="font-label-sm text-label-sm">Profile</span>
    </a>
    <a className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-container transition-all duration-200 rounded-lg" href="#">
    <span className="material-symbols-outlined">restaurant_menu</span>
    <span className="font-label-sm text-label-sm">Services</span>
    </a>
    <a className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-container transition-all duration-200 rounded-lg" href="#">
    <span className="material-symbols-outlined">calendar_today</span>
    <span className="font-label-sm text-label-sm">Calendar</span>
    </a>
    <a className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-container transition-all duration-200 rounded-lg" href="#">
    <span className="material-symbols-outlined">pending_actions</span>
    <span className="font-label-sm text-label-sm">Requests</span>
    </a>
    <a className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-container transition-all duration-200 rounded-lg" href="#">
    <span className="material-symbols-outlined">request_quote</span>
    <span className="font-label-sm text-label-sm">Quotes</span>
    </a>
    <a className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-container transition-all duration-200 rounded-lg" href="#">
    <span className="material-symbols-outlined">chat_bubble</span>
    <span className="font-label-sm text-label-sm">Messages</span>
    </a>
    <a className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-container transition-all duration-200 rounded-lg" href="#">
    <span className="material-symbols-outlined">star</span>
    <span className="font-label-sm text-label-sm">Reviews</span>
    </a>
    <a className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-container transition-all duration-200 rounded-lg" href="#">
    <span className="material-symbols-outlined">payments</span>
    <span className="font-label-sm text-label-sm">Payments</span>
    </a>
    <a className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-container transition-all duration-200 rounded-lg" href="#">
    <span className="material-symbols-outlined">card_membership</span>
    <span className="font-label-sm text-label-sm">Subscription</span>
    </a>
    <a className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-secondary-container transition-all duration-200 rounded-lg" href="#">
    <span className="material-symbols-outlined">settings</span>
    <span className="font-label-sm text-label-sm">Settings</span>
    </a>
    </nav>
    <div className="pt-6 mt-6 border-t border-outline-variant">
    <a className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/20 transition-all duration-200 rounded-lg" href="#">
    <span className="material-symbols-outlined">logout</span>
    <span className="font-label-sm text-label-sm">Logout</span>
    </a>
    </div>
    </aside>
    {/* Main Content Canvas */}
    <main className="md:ml-64 min-h-screen">
    {/* TopNavBar Component */}
    <header className="h-20 bg-surface shadow-sm sticky top-0 z-40 flex items-center px-gutter w-full">
    <div className="flex justify-between items-center w-full max-w-container-max mx-auto">
    <div className="flex items-center gap-4">
    <button className="md:hidden p-2 text-secondary">
    <span className="material-symbols-outlined">menu</span>
    </button>
    <h2 className="font-headline-md text-headline-md text-primary hidden md:block">Artisanal Eats Dashboard</h2>
    </div>
    <div className="flex items-center gap-6">
    <div className="relative hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-2 w-64 border border-outline-variant focus-within:border-primary transition-colors">
    <span className="material-symbols-outlined text-outline">search</span>
    <input className="bg-transparent border-none focus:ring-0 text-body-md w-full ml-2" placeholder="Search orders..." type="text"/>
    </div>
    <div className="flex items-center gap-4">
    <button className="p-2 text-secondary hover:text-primary transition-colors">
    <span className="material-symbols-outlined">notifications</span>
    </button>
    <div className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-outline-variant" data-alt="A professional headshot of a premium executive chef in a clean white uniform, looking confident and smiling warmly towards the camera. The background is a soft-focus, high-end professional kitchen with warm amber lighting and copper cookware visible. The image conveys culinary mastery and trust." style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCxoIEEbtFIA5KhO--SYqg5jsi7OaxUbOkmjQhoiRwiejPmAqme7YA1uSDW9cg10exYByk47v8JWZxAS3JmV3W-A1IClrnfQ7TsbpZFZeRaQFy9-s1AYUO24ze8Jb8yGTcoQayVr8wAHvhzO0SQyB0kVAeM2UGJUlIUTkHv0xFV2A2MD57iRDTqsyUMuZbDfy2XnNYouddny1PXgjjFl_N-oAzz1CeTy-sfC5P55C1YtCbDDDulit_C14HmU_xDg7Uy1cOv5ynOyNU')`}}>
    </div>
    </div>
    </div>
    </div>
    </header>
    <div className="p-gutter max-w-container-max mx-auto">
    {/* Key Metrics Grid */}
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-section-padding">
    {/* Total Revenue */}
    <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow card-hover border border-outline-variant/30 transition-all">
    <div className="flex justify-between items-start mb-4">
    <div className="p-3 bg-primary-fixed rounded-lg text-primary">
    <span className="material-symbols-outlined">payments</span>
    </div>
    <span className="text-primary font-bold text-label-sm flex items-center gap-1">+12% <span className="material-symbols-outlined text-[16px]">trending_up</span></span>
    </div>
    <p className="text-secondary font-label-sm uppercase tracking-wider mb-1">Total Revenue</p>
    <h3 className="font-headline-md text-headline-md text-on-surface">$42,850.00</h3>
    </div>
    {/* Pending Requests */}
    <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow card-hover border border-outline-variant/30 transition-all">
    <div className="flex justify-between items-start mb-4">
    <div className="p-3 bg-tertiary-fixed rounded-lg text-tertiary">
    <span className="material-symbols-outlined">pending_actions</span>
    </div>
    <span className="text-tertiary font-bold text-label-sm">8 New</span>
    </div>
    <p className="text-secondary font-label-sm uppercase tracking-wider mb-1">Pending Requests</p>
    <h3 className="font-headline-md text-headline-md text-on-surface">14</h3>
    </div>
    {/* Average Rating */}
    <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow card-hover border border-outline-variant/30 transition-all">
    <div className="flex justify-between items-start mb-4">
    <div className="p-3 bg-secondary-container rounded-lg text-secondary">
    <span className="material-symbols-outlined" >star</span>
    </div>
    <span className="text-secondary font-label-sm">42 Reviews</span>
    </div>
    <p className="text-secondary font-label-sm uppercase tracking-wider mb-1">Average Rating</p>
    <h3 className="font-headline-md text-headline-md text-on-surface">4.92</h3>
    </div>
    {/* Total Views */}
    <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow card-hover border border-outline-variant/30 transition-all">
    <div className="flex justify-between items-start mb-4">
    <div className="p-3 bg-surface-container-high rounded-lg text-on-surface-variant">
    <span className="material-symbols-outlined">visibility</span>
    </div>
    <span className="text-primary font-bold text-label-sm flex items-center gap-1">+5.4% <span className="material-symbols-outlined text-[16px]">trending_up</span></span>
    </div>
    <p className="text-secondary font-label-sm uppercase tracking-wider mb-1">Total Views</p>
    <h3 className="font-headline-md text-headline-md text-on-surface">2,418</h3>
    </div>
    </section>
    {/* Main Dashboard Content Grid (Asymmetric Bento) */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
    {/* Left: Recent Demands (Events) */}
    <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl soft-shadow p-8 border border-outline-variant/30">
    <div className="flex justify-between items-center mb-8">
    <h2 className="font-headline-md text-headline-md text-on-surface">Recent Demands</h2>
    <button className="text-primary font-label-sm hover:underline decoration-2 underline-offset-4">View All Inquiries</button>
    </div>
    <div className="overflow-x-auto">
    <table className="w-full text-left">
    <thead className="border-b border-outline-variant">
    <tr>
    <th className="pb-4 font-label-sm text-secondary uppercase tracking-widest px-4">Client</th>
    <th className="pb-4 font-label-sm text-secondary uppercase tracking-widest px-4">Event Date</th>
    <th className="pb-4 font-label-sm text-secondary uppercase tracking-widest px-4">Budget</th>
    <th className="pb-4 font-label-sm text-secondary uppercase tracking-widest px-4">Status</th>
    <th className="pb-4 font-label-sm text-secondary uppercase tracking-widest px-4">Action</th>
    </tr>
    </thead>
    <tbody className="divide-y divide-outline-variant/20">
    <tr className="group hover:bg-surface-container-low transition-colors">
    <td className="py-5 px-4">
    <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold">EM</div>
    <div>
    <p className="font-bold text-on-surface">Eleanor Maxwell</p>
    <p className="text-label-sm text-secondary">Wedding Reception</p>
    </div>
    </div>
    </td>
    <td className="py-5 px-4 text-on-surface">Oct 24, 2024</td>
    <td className="py-5 px-4 font-bold text-primary">$12,500</td>
    <td className="py-5 px-4">
    <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-sm rounded-full">New</span>
    </td>
    <td className="py-5 px-4">
    <button className="p-2 hover:bg-primary-fixed text-primary rounded-full transition-colors">
    <span className="material-symbols-outlined">chevron_right</span>
    </button>
    </td>
    </tr>
    <tr className="group hover:bg-surface-container-low transition-colors">
    <td className="py-5 px-4">
    <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold">JS</div>
    <div>
    <p className="font-bold text-on-surface">Julian Sterling</p>
    <p className="text-label-sm text-secondary">Corporate Gala</p>
    </div>
    </div>
    </td>
    <td className="py-5 px-4 text-on-surface">Nov 02, 2024</td>
    <td className="py-5 px-4 font-bold text-primary">$8,200</td>
    <td className="py-5 px-4">
    <span className="px-3 py-1 bg-surface-container-highest text-secondary text-label-sm rounded-full">Quoted</span>
    </td>
    <td className="py-5 px-4">
    <button className="p-2 hover:bg-primary-fixed text-primary rounded-full transition-colors">
    <span className="material-symbols-outlined">chevron_right</span>
    </button>
    </td>
    </tr>
    <tr className="group hover:bg-surface-container-low transition-colors">
    <td className="py-5 px-4">
    <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">AM</div>
    <div>
    <p className="font-bold text-on-surface">Althea Moore</p>
    <p className="text-label-sm text-secondary">Anniversary Dinner</p>
    </div>
    </div>
    </td>
    <td className="py-5 px-4 text-on-surface">Oct 28, 2024</td>
    <td className="py-5 px-4 font-bold text-primary">$4,500</td>
    <td className="py-5 px-4">
    <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-sm rounded-full">New</span>
    </td>
    <td className="py-5 px-4">
    <button className="p-2 hover:bg-primary-fixed text-primary rounded-full transition-colors">
    <span className="material-symbols-outlined">chevron_right</span>
    </button>
    </td>
    </tr>
    </tbody>
    </table>
    </div>
    </section>
    {/* Right: Calendar & Growth */}
    <div className="lg:col-span-4 space-y-gutter">
    {/* Calendar at a Glance Widget */}
    <section className="bg-surface-container-lowest rounded-xl soft-shadow p-6 border border-outline-variant/30">
    <div className="flex justify-between items-center mb-6">
    <h2 className="font-bold text-on-surface">Today's Schedule</h2>
    <span className="text-label-sm text-secondary">Oct 14</span>
    </div>
    <div className="space-y-4">
    <div className="flex gap-4 items-start relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-full">
    <div>
    <p className="text-label-sm font-bold text-primary">09:00 AM</p>
    <p className="font-bold text-on-surface">Kitchen Prep: Maxwell Wedding</p>
    <p className="text-label-sm text-secondary">Main Studio Kitchen</p>
    </div>
    </div>
    <div className="flex gap-4 items-start relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-tertiary before:rounded-full">
    <div>
    <p className="text-label-sm font-bold text-tertiary">01:30 PM</p>
    <p className="font-bold text-on-surface">Client Tasting: Sterling Group</p>
    <p className="text-label-sm text-secondary">Meeting Room B</p>
    </div>
    </div>
    <div className="flex gap-4 items-start relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-outline before:rounded-full opacity-60">
    <div>
    <p className="text-label-sm font-bold text-outline">04:00 PM</p>
    <p className="font-bold text-on-surface">Inventory Check</p>
    <p className="text-label-sm text-secondary">Warehouse 4</p>
    </div>
    </div>
    </div>
    <button className="w-full mt-6 py-3 border border-outline-variant text-on-surface font-label-sm rounded-lg hover:bg-secondary-container transition-all">
                                Full Calendar View
                            </button>
    </section>
    {/* Growth Chart Widget */}
    <section className="bg-surface-container-lowest rounded-xl soft-shadow p-6 border border-outline-variant/30 overflow-hidden relative">
    <h2 className="font-bold text-on-surface mb-4">Monthly Bookings</h2>
    <div className="flex items-end justify-between h-32 gap-1 px-2">
    <div className="bg-primary-fixed-dim w-full rounded-t-sm" style={{height: '40%'}}></div>
    <div className="bg-primary-fixed-dim w-full rounded-t-sm" style={{height: '55%'}}></div>
    <div className="bg-primary-fixed-dim w-full rounded-t-sm" style={{height: '45%'}}></div>
    <div className="bg-primary-fixed-dim w-full rounded-t-sm" style={{height: '70%'}}></div>
    <div className="bg-primary-fixed-dim w-full rounded-t-sm" style={{height: '69%'}}></div>
    <div className="bg-primary w-full rounded-t-sm" style={{height: '85%'}}></div>
    </div>
    <div className="flex justify-between mt-2 px-2">
    <span className="text-[10px] text-secondary font-bold">MAY</span>
    <span className="text-[10px] text-secondary font-bold">JUN</span>
    <span className="text-[10px] text-secondary font-bold">JUL</span>
    <span className="text-[10px] text-secondary font-bold">AUG</span>
    <span className="text-[10px] text-secondary font-bold">SEP</span>
    <span className="text-[10px] text-primary font-bold">OCT</span>
    </div>
    <div className="mt-4 pt-4 border-t border-outline-variant/30">
    <p className="text-label-sm text-secondary">Booking growth is up <span className="text-primary font-bold">18%</span> compared to last month.</p>
    </div>
    </section>
    </div>
    </div>
    {/* Footer Decorative Branding */}
    <footer className="mt-section-padding pb-gutter text-center border-t border-outline-variant/20 pt-gutter">
    <p className="text-secondary font-label-sm tracking-widest uppercase">CulinArt Elite Partner Portal • Precision in Service</p>
    </footer>
    </div>
    </main>
    {/* Floating Action Button - Active for Dashboard */}
    <button className="fixed bottom-8 right-8 h-14 w-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
    <span className="material-symbols-outlined">add</span>
    </button>
    </div>
    </>
    )
}