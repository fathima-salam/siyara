import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#121212] text-white pt-20 pb-10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-20">
                <div>
                    <h2 className="text-2xl font-bold tracking-[0.2em] uppercase mb-8">Siyara</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                        Premium hijabs, scarves and modest wear. Quality fabrics and timeless styles for every occasion.
                    </p>
                    <div className="flex space-x-4">
                        <Link href="#" className="hover:text-accent transition-colors"><Facebook className="w-5 h-5" /></Link>
                        <Link href="#" className="hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></Link>
                        <Link href="#" className="hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></Link>
                        <Link href="#" className="hover:text-accent transition-colors"><Youtube className="w-5 h-5" /></Link>
                    </div>
                </div>

                <div>
                    <h3 className="text-xs uppercase tracking-[0.25em] font-bold mb-8">Shop</h3>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link href="/shop?category=Hijabs" className="hover:text-white transition-colors">Hijabs</Link></li>
                        <li><Link href="/shop?category=Scarves" className="hover:text-white transition-colors">Scarves</Link></li>
                        <li><Link href="/shop?category=Abayas" className="hover:text-white transition-colors">Abayas</Link></li>
                        <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs uppercase tracking-[0.25em] font-bold mb-8">Resources</h3>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link href="/about" className="hover:text-white transition-colors">About Siyara</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs uppercase tracking-[0.25em] font-bold mb-8">Newsletter</h3>
                    <p className="text-gray-400 text-sm mb-6">Subscribe to receive updates, access to exclusive deals, and more.</p>
                    <form className="flex">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-transparent border border-white/20 px-4 py-3 text-sm flex-1 focus:outline-none focus:border-accent"
                        />
                        <button className="bg-white text-primary px-6 py-3 font-bold uppercase text-[10px] tracking-widest hover:bg-accent hover:text-white transition-all">
                            Join
                        </button>
                    </form>
                </div>
            </div>
            <div className="container mx-auto px-6 mt-10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <p>© 2026 Siyara. All Rights Reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
