"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    Calendar,
    MessageSquare,
    LogOut
} from "lucide-react";


interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}


const menuItems = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Utilisateurs",
        href: "/users",
        icon: Users,
    },
    {
        name: "Documents",
        href: "/documents",
        icon: FileText,
    },
    {
        name: "Calendrier",
        href: "/calendar",
        icon: Calendar,
    },
    {
        name: "Messages",
        href: "/messages",
        icon: MessageSquare,
    },
    {
        name: "Paramètres",
        href: "/settings",
        icon: Settings,
    },
];


export default function Sidebar({
    isOpen = false,
    onClose
}: SidebarProps) {

    const pathname = usePathname();


    return (

        <>

            {/* Overlay mobile */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                />
            )}



            <aside
                className={`
                    fixed top-0 left-0 z-50
                    h-screen w-64
                    bg-white border-r
                    transition-transform duration-300

                    ${isOpen 
                        ? "translate-x-0" 
                        : "-translate-x-full"
                    }

                    lg:translate-x-0
                `}
            >


                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b">

                    <h1 className="text-xl font-bold">
                        MyApp
                    </h1>

                </div>



                {/* Menu */}
                <nav className="p-4 space-y-2">


                    {
                        menuItems.map((item)=>{

                            const Icon = item.icon;

                            const active = pathname === item.href;


                            return (

                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`
                                        flex items-center gap-3
                                        px-4 py-3
                                        rounded-lg
                                        transition

                                        ${
                                            active
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }
                                    `}
                                >

                                    <Icon size={20}/>

                                    <span>
                                        {item.name}
                                    </span>

                                </Link>

                            );

                        })
                    }


                </nav>



                {/* Logout */}
                <div className="absolute bottom-0 w-full p-4 border-t">


                    <button
                        className="
                            flex items-center gap-3
                            w-full
                            px-4 py-3
                            rounded-lg
                            text-red-600
                            hover:bg-red-50
                        "
                    >

                        <LogOut size={20}/>

                        Déconnexion

                    </button>


                </div>


            </aside>

        </>

    );
}