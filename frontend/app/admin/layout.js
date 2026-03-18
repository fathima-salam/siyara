"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Sidebar from "@/components/admin/Sidebar";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {
    const { userInfo } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    // Don't show sidebar or check auth on the login page
    const isAdminLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (!isAdminLoginPage) {
            if (!userInfo || !userInfo.isAdmin) {
                router.push("/admin/login");
            } else {
                setAuthorized(true);
            }
        } else {
            setAuthorized(true);
        }
    }, [userInfo, router, isAdminLoginPage]);

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (isAdminLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <main className="flex-1 ml-52 p-6 bg-secondary/30">
                <Toaster position="bottom-right" />
                {children}
            </main>
        </div>
    );
}
