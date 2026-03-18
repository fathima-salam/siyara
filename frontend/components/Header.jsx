"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, User, Search, Menu, X, ChevronDown, LogOut, UserCircle, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isProductDetail = pathname?.startsWith("/product/");
    const isCartPage = pathname === "/cart";
    const isWishlistPage = pathname === "/wishlist";
    const isCheckoutPage = pathname === "/checkout";
    const isOrderPage = pathname?.startsWith("/order/");
    const isLoginPage = pathname === "/login";
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    // Solid nav on scroll, product detail, checkout, order, cart or login so navbar is visible on light content
    const navSolid = isScrolled || isProductDetail || isCartPage || isWishlistPage || isCheckoutPage || isOrderPage || isLoginPage;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const userMenuRef = useRef(null);
    const router = useRouter();
    const { cartItems } = useCartStore();
    const { userInfo, logout } = useAuthStore();
    const { wishlistItems } = useWishlistStore();

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

                    {userInfo && (
                        <Link
                            href="/wishlist"
                            className={`relative hidden sm:flex items-center ${navSolid ? "text-primary" : "text-white"}`}
                            aria-label="Wishlist"
                        >
                            <Heart className="w-5 h-5" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>
                    )}

                    <div className="relative" ref={userMenuRef}>
                        {userInfo ? (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen((v) => !v); }}
                                    className={`${navSolid ? "text-primary" : "text-white"} hover:opacity-90 transition`}
                                >
                                    <User className="w-5 h-5" />
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
            {/* Integrated Search Bar (Mockup Style) */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute inset-x-0 top-full bg-white border-b border-gray-100 py-4 px-6 z-[60] shadow-sm"
                    >
                        <div className="container mx-auto max-w-4xl relative">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search for products, brands and more"
                                    className="w-full bg-gray-50 border-none rounded-xl py-3.5 pl-12 pr-12 text-sm font-medium tracking-wide focus:ring-2 focus:ring-primary/5 focus:bg-white transition-all placeholder:text-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && searchQuery) {
                                            router.push(`/shop?search=${searchQuery}`);
                                            setIsSearchOpen(false);
                                        }
                                    }}
                                />
                                <button 
                                    onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery("");
                                    }}
                                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-primary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {searchQuery && (
                                <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[70]">
                                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Quick Results for "{searchQuery}"</span>
                                        <Link 
                                            href={`/shop?search=${searchQuery}`}
                                            className="text-[10px] uppercase tracking-widest font-bold text-accent hover:underline"
                                            onClick={() => setIsSearchOpen(false)}
                                        >
                                            View All
                                        </Link>
                                    </div>
                                    {/* Quick result items would go here */}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
