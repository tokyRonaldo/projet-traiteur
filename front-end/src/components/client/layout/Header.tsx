"use client";

import { Menu, Bell, UserCircle } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-40">

            {/* Bouton mobile */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
                <Menu size={24} />
            </button>


            {/* Logo / titre */}
            <div className="font-bold text-xl">
                Dashboard
            </div>


            {/* Actions droite */}
            <div className="flex items-center gap-5">

                {/* Notification */}
                <button className="relative p-2 hover:bg-gray-100 rounded-full">
                    <Bell size={22} />

                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>


                {/* Profil utilisateur */}
                <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">

                    <UserCircle size={30}/>

                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium">
                            John Doe
                        </p>

                        <p className="text-xs text-gray-500">
                            Admin
                        </p>
                    </div>

                </button>

            </div>


        </header>
    );
}