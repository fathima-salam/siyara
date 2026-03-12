"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { cartItems } = useCartStore();
    const { userInfo, logout } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <header
            className={`${isHome ? "absolute" : "fixed"} top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white py-4 shadow-sm" : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu className={`w-6 h-6 ${isScrolled ? "text-primary" : "text-white"}`} />
                </button>

                {/* Navigation Links - Desktop */}
                <nav className="hidden lg:flex items-center space-x-8">
                    <Link href="/shop?category=Hijabs" className={`nav-link ${isScrolled ? "text-primary" : "text-white"}`}>Hijabs</Link>
                    <Link href="/shop?category=Scarves" className={`nav-link ${isScrolled ? "text-primary" : "text-white"}`}>Scarves</Link>
                    <Link href="/shop?category=Abayas" className={`nav-link ${isScrolled ? "text-primary" : "text-white"}`}>Abayas</Link>
                </nav>

                {/* Logo */}
                <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                    <h1 className={`text-2xl font-bold tracking-[0.2em] uppercase ${isScrolled ? "text-primary" : "text-white"}`}>
                        Siyara
                    </h1>
                </Link>

                {/* Icons */}
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className={`hidden sm:block ${isScrolled ? "text-primary" : "text-white"}`}
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <Link href={userInfo ? "/profile" : "/login"} className={isScrolled ? "text-primary" : "text-white"}>
                        <User className="w-5 h-5" />
                    </Link>

                    {userInfo?.isAdmin && (
                        <Link href="/admin" className={`text-[10px] items-center justify-center px-4 py-2 border uppercase tracking-[0.2em] font-bold hidden md:flex transition-all ${isScrolled ? "border-primary text-primary hover:bg-primary hover:text-white" : "border-white text-white hover:bg-white hover:text-primary"}`}>
                            Admin
                        </Link>
                    )}

                    <Link href="/cart" className={`relative flex items-center ${isScrolled ? "text-primary" : "text-white"}`}>
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                        <span className="ml-2 text-xs font-bold uppercase hidden md:inline">
                            ${cartItems.reduce((acc, i) => acc + i.price * i.qty, 0).toFixed(2)}
                        </span>
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 bg-white z-[60] flex flex-col p-8"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <h1 className="text-xl font-bold tracking-widest uppercase">Siyara</h1>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="flex flex-col space-y-8">
                            <Link href="/shop?category=Hijabs" className="text-lg uppercase tracking-widest font-bold" onClick={() => setIsMobileMenuOpen(false)}>Hijabs</Link>
                            <Link href="/shop?category=Scarves" className="text-lg uppercase tracking-widest font-bold" onClick={() => setIsMobileMenuOpen(false)}>Scarves</Link>
                            <Link href="/shop?category=Abayas" className="text-lg uppercase tracking-widest font-bold" onClick={() => setIsMobileMenuOpen(false)}>Abayas</Link>
                            <Link href="/about" className="text-lg uppercase tracking-widest font-bold" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                            <Link href="/contact" className="text-lg uppercase tracking-widest font-bold" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Search Modal Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/95 z-[70] flex flex-col items-center pt-40 px-6"
                    >
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute top-10 right-10 p-2 hover:rotate-90 transition-transform"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="w-full max-w-3xl">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-8 text-center">Search hijabs, scarves & more</p>
                            <div className="relative border-b-2 border-primary pb-4">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search hijabs, scarves..."
                                    className="w-full bg-transparent text-3xl md:text-5xl font-bold uppercase tracking-tight focus:outline-none placeholder:text-gray-100"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-200" />
                            </div>

                            {searchQuery && (
                                <div className="mt-12 text-center">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-10">Searching for "{searchQuery}"</p>
                                    {/* Real search labels/results would map here */}
                                    <Link
                                        href={`/shop?search=${searchQuery}`}
                                        className="btn-primary"
                                        onClick={() => setIsSearchOpen(false)}
                                    >
                                        View All Results
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
