"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Wallet,
    LogOut,
    ExternalLink,
    Tags,
    Layers,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Brands", href: "/admin/brands", icon: Tags },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Wallet / Refunds", href: "/admin/wallet", icon: Wallet },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { userInfo, logout } = useAuthStore();

    return (
        <aside className="fixed left-0 top-0 h-screen w-52 bg-primary text-white flex flex-col z-50 border-r border-white/10">
            <div className="p-4 border-b border-white/10">
                <Link href="/admin" className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-wider uppercase">Siyara</span>
                    <span className="text-[9px] bg-accent text-primary px-1.5 py-0.5 font-bold rounded uppercase tracking-wider">Admin</span>
                </Link>
            </div>

            <nav className="flex-1 py-4 px-2 space-y-0.5">
                <p className="px-3 py-1.5 text-[9px] uppercase tracking-wider text-white/40 font-bold">Menu</p>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-none transition-all group border-l-2 ${isActive
                                    ? "bg-accent/10 text-accent border-accent"
                                    : "border-transparent text-white/70 hover:text-accent hover:bg-white/5"
                                }`}
                        >
                            <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-accent" : "text-white/50 group-hover:text-accent"}`} />
                            <span className="text-[10px] uppercase tracking-wider font-bold">{item.name}</span>
                        </Link>
                    );
                })}

                <div className="pt-6">
                    <p className="px-3 py-1.5 text-[9px] uppercase tracking-wider text-white/40 font-bold">Store</p>
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 px-3 py-2.5 text-white/70 hover:text-accent hover:bg-white/5 rounded-none transition-all group border-l-2 border-transparent"
                    >
                        <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-accent shrink-0" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">Storefront</span>
                    </Link>
                </div>
            </nav>

            <div className="p-3 border-t border-white/10 bg-primary">
                <div className="flex items-center gap-2.5 mb-3 px-1">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold border border-accent/40 text-accent shrink-0">
                        {userInfo?.name?.charAt(0) || "A"}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-tight truncate">{userInfo?.name || "Admin"}</p>
                        <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Admin</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-[10px] text-white/70 hover:text-red-400 hover:bg-red-400/10 rounded-none transition-all group text-left"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span className="uppercase tracking-wider font-bold">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
