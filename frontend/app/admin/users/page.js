"use client";

import { useState, useEffect } from "react";
import { adminUserService } from "@/api";
import { User, Mail, Shield, ShieldAlert, Trash2, Search, Check, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const fetchUsers = async () => {
        try {
            const data = await adminUserService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching admin users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await adminUserService.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user._id && String(user._id)).toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
            roleFilter === "all" ||
            (roleFilter === "admin" && user.isAdmin) ||
            (roleFilter === "customer" && !user.isAdmin);

        return matchesSearch && matchesRole;
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
    );

    return (
        <main className="min-h-screen">
            <section className="pb-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-4">
                        <nav className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Admin</nav>
                        <h1 className="text-lg font-bold uppercase tracking-tight text-primary">Users</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{filteredUsers.length} users</p>
                    </div>

                    <div className="bg-white shadow-sm overflow-hidden border border-gray-100">
                        <div className="p-3 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-2 bg-secondary/20">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search name, email..."
                                    className="w-full bg-white border border-gray-100 pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    className="text-[9px] uppercase font-bold tracking-wider bg-transparent border border-gray-100 px-2 py-1.5 rounded cursor-pointer"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    <option value="admin">Admins</option>
                                    <option value="customer">Customers</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-secondary/30 border-b border-gray-100">
                                    <tr>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">ID</th>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Name</th>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Email</th>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Role</th>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Status</th>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <AnimatePresence mode="popLayout">
                                        {filteredUsers.map((user) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={user._id}
                                                className="hover:bg-secondary/20 transition-colors group"
                                            >
                                                <td className="px-3 py-2 text-[10px] text-gray-400 font-mono">#{user._id?.toString().slice(-8)}</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-[9px] border border-gray-200">
                                                            {user.name?.charAt(0)}
                                                        </div>
                                                        <span className="text-[11px] font-bold uppercase tracking-wider">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-[11px] text-gray-500">{user.email}</td>
                                                <td className="px-3 py-2">
                                                    {user.isAdmin ? (
                                                        <span className="text-[9px] font-bold uppercase tracking-wider text-accent flex items-center gap-1"><Shield className="w-3 h-3" />Admin</span>
                                                    ) : (
                                                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1"><User className="w-3 h-3" />Customer</span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {user.isBlocked ? <span className="text-[9px] font-bold uppercase text-amber-600">Blocked</span> : <span className="text-[9px] font-bold uppercase text-gray-400">Active</span>}
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        {!user.isAdmin && (
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await adminUserService.blockUnblock(user._id);
                                                                        fetchUsers();
                                                                    } catch (e) { console.error(e); }
                                                                }}
                                                                className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors opacity-0 group-hover:opacity-100"
                                                                title={user.isBlocked ? "Unblock" : "Block"}
                                                            >
                                                                {user.isBlocked ? <ShieldAlert className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteHandler(user._id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                            disabled={user.isAdmin}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="py-8 text-center">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">No users found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

