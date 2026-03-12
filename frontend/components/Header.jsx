"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, User, Search, Menu, X, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isProductDetail = pathname?.startsWith("/product/");
    const isCartPage = pathname === "/cart";
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    // Solid nav on scroll, product detail, or cart so navbar is visible on light content
    const navSolid = isScrolled || isProductDetail || isCartPage;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const userMenuRef = useRef(null);
    const router = useRouter();
    const { cartItems } = useCartStore();
    const { userInfo, logout } = useAuthStore();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserMenuOpen(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isCartPage) setIsCartOpen(true);
    }, [isCartPage]);

    const cartCount = cartItems.reduce((acc, item) => acc + (item.qty || 0), 0);
    const cartTotal = cartItems.reduce((acc, i) => acc + (Number(i.price) || 0) * (i.qty || 0), 0);

    return (
        <header
            className={`${isHome ? "absolute" : "fixed"} top-0 left-0 w-full z-50 transition-all duration-300 ${navSolid ? "bg-white py-4 shadow-sm" : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu className={`w-6 h-6 ${navSolid ? "text-primary" : "text-white"}`} />
                </button>

                {/* Navigation Links - Desktop */}
                <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold">
                    <Link href="/" className={`nav-link ${navSolid ? "text-primary" : "text-white"}`}>Home</Link>
                    <Link href="/shop" className={`nav-link ${navSolid ? "text-primary" : "text-white"}`}>Shop</Link>
                    <Link href="/shop?collection=featured" className={`nav-link ${navSolid ? "text-primary" : "text-white"}`}>Collection</Link>
                    <Link href="/about" className={`nav-link ${navSolid ? "text-primary" : "text-white"}`}>About Us</Link>
                </nav>

                {/* Logo */}
                <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                    <h1 className={`text-2xl font-bold tracking-[0.2em] uppercase ${navSolid ? "text-primary" : "text-white"}`}>
                        Siyara
                    </h1>
                </Link>

                {/* Icons */}
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className={`hidden sm:block ${navSolid ? "text-primary" : "text-white"}`}
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <div className="relative" ref={userMenuRef}>
                        {userInfo ? (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen((v) => !v); }}
                                    className={`flex items-center gap-1.5 ${navSolid ? "text-primary" : "text-white"} hover:opacity-90 transition`}
                                >
                                    <User className="w-5 h-5 shrink-0" />
                                    <span className="text-xs font-semibold uppercase tracking-wider max-w-[100px] truncate hidden sm:inline">
                                        {userInfo.name || userInfo.email?.split("@")[0] || "Account"}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                                </button>
                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-[100]"
                                        >
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                <UserCircle className="w-4 h-4 text-gray-500" />
                                                Profile
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    logout();
                                                    router.push("/");
                                                }}
                                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                                            >
                                                <LogOut className="w-4 h-4 text-gray-500" />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <Link href="/login" className={`flex items-center ${navSolid ? "text-primary" : "text-white"}`}>
                                <User className="w-5 h-5" />
                            </Link>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCartOpen(true)}
                        className={`relative flex items-center ${navSolid ? "text-primary" : "text-white"}`}
                        aria-label="Open cart"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                        <span className="ml-2 text-xs font-bold uppercase hidden md:inline">
                            ₹{cartTotal.toFixed(2)}
                        </span>
                    </button>
                    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
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
                        <nav className="flex flex-col space-y-8 text-lg uppercase tracking-widest font-bold">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                            <Link href="/shop?collection=featured" onClick={() => setIsMobileMenuOpen(false)}>Collection</Link>
                            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                            {userInfo && (
                                <>
                                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                                        <UserCircle className="w-5 h-5" /> Profile
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => { setIsMobileMenuOpen(false); logout(); router.push("/"); }}
                                        className="flex items-center gap-2 text-left"
                                    >
                                        <LogOut className="w-5 h-5" /> Logout
                                    </button>
                                </>
                            )}
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
