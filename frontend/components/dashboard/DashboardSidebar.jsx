"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Heart, 
    MapPin, 
    Settings, 
    CreditCard, 
    Bell, 
    ShieldCheck, 
    LogOut,
    User
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const SIDEBAR_LINKS = [
    { name: "Overview", href: "/profile", icon: LayoutDashboard },
    { name: "My Orders", href: "/profile/orders", icon: ShoppingBag },
    { name: "Wishlist", href: "/profile/wishlist", icon: Heart },
    { name: "Saved Addresses", href: "/profile/addresses", icon: MapPin },
    { name: "Account Settings", href: "/profile/settings", icon: Settings },
    { name: "Payment Methods", href: "/profile/payment", icon: CreditCard },
    { name: "Notifications", href: "/profile/notifications", icon: Bell },
    { name: "Security", href: "/profile/security", icon: ShieldCheck },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, userInfo } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <aside className="w-full lg:w-72 bg-white border border-gray-100 shadow-sm flex flex-col shrink-0">
            {/* User Header */}
            <div className="p-8 border-b border-gray-50 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                    <User className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-widest text-primary mb-1">
                    {userInfo?.name || "User"}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate w-full">
                    {userInfo?.email}
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4">
                {SIDEBAR_LINKS.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center space-x-4 px-8 py-4 transition-all border-l-2 ${
                                isActive 
                                    ? "bg-gray-50 border-accent text-primary" 
                                    : "border-transparent text-gray-400 hover:text-primary hover:bg-gray-50/50"
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-gray-400"}`} />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                                {link.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout & Navigation Back */}
            <div className="p-4 border-t border-gray-50 space-y-2">
                <Link
                    href="/"
                    className="w-full flex items-center space-x-4 px-4 py-4 text-primary hover:bg-gray-50 transition-colors uppercase tracking-[0.2em] font-bold text-[10px]"
                >
                    <LayoutDashboard className="w-4 h-4 text-gray-400 rotate-180" />
                    <span>Back to Home</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-4 px-4 py-4 text-red-500 hover:bg-red-50 transition-colors uppercase tracking-[0.2em] font-bold text-[10px]"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
