"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
    {
        name: "EXPLORE HIJABS",
        src: "/video1.mp4",
        link: "/shop?product=Hijabs",
    },
    {
        name: "EXPLORE EARRINGS",
        src: "/video2.mp4",
        link: "/shop?product=Earring",
    },
    {
        name: "EXPLORE NECKLACES",
        src: "/video3.mp4",
        link: "/shop?product=Necklace",
    },
    {
        name: "EXPLORE RINGS",
        src: "/video4.mp4",
        link: "/shop?product=Rings",
    },
];

export default function CategorySection() {
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-6 mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-primary">
                    OUR COLLECTIONS
                </h2>
            </div>
            
            <div className="w-full px-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 auto-rows-[400px] md:auto-rows-[65vh]">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className="relative group overflow-hidden"
                        >
                            <video
                                src={cat.src}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                            
                            <div className="absolute inset-0 flex flex-col items-start justify-end text-white text-left p-8">
                                <h3 className="text-lg md:text-xl font-bold uppercase tracking-tighter mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {cat.name}
                                </h3>
                                <Link
                                    href={cat.link}
                                    className="text-[9px] uppercase tracking-[0.2em] font-bold border-b-2 border-white pb-1 hover:text-accent hover:border-accent transition-all transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500"
                                >
                                    Shop Collection
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
