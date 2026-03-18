"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const guides = [
    {
        video: "/video1.mp4",
        title: "Chandelier Diamond Drop Earrings",
        subtitle: "Perfect for blissful evenings",
        products: [
            { name: "Chandelier Diamond Drop Earrings", icon: "/earring-icon.png" },
            { name: "Array Diamond Ring", icon: "/ring-icon.png" }
        ]
    },
    {
        video: "/video2.mp4",
        title: "Ethereal Diamond Necklace",
        subtitle: "Timeless elegance for every occasion",
        products: [
            { name: "Ethereal Diamond Necklace", icon: "/necklace-icon.png" }
        ]
    },
    {
        video: "/video3.mp4",
        title: "Modern Solitaire Ring",
        subtitle: "A statement of pure brilliance",
        products: [
            { name: "Modern Solitaire Ring", icon: "/ring-icon.png" }
        ]
    }
];

export default function StylingGuide() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % guides.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + guides.length) % guides.length);
    };

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-6 text-center mb-10">
                <h2 className="text-2xl md:text-4xl font-serif text-primary mb-3 tracking-tight italic">
                    Styling 101 With Diamonds
                </h2>
                <p className="text-gray-500 text-[10px] md:text-xs tracking-wide uppercase font-light">
                    Trendsetting diamond jewellery suited for every occasion
                </p>
            </div>

            <div className="relative max-w-6xl mx-auto px-6 h-[500px] flex items-center justify-center">
                {/* Carousel container */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <AnimatePresence initial={false} mode="popLayout">
                        {guides.map((guide, index) => {
                            const position = (index - currentIndex + guides.length) % guides.length;
                            
                            // Only show current and immediate neighbors
                            if (position > 1 && position < guides.length - 1) return null;

                            let x = 0;
                            let scale = 0.85;
                            let zIndex = 0;
                            let opacity = 0.4;

                            if (position === 0) {
                                x = 0;
                                scale = 1.05;
                                zIndex = 20;
                                opacity = 1;
                            } else if (position === 1) {
                                x = "85%";
                                scale = 0.8;
                                zIndex = 10;
                                opacity = 0.3;
                            } else {
                                x = "-85%";
                                scale = 0.8;
                                zIndex = 10;
                                opacity = 0.3;
                            }

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.5, x: position === 1 ? "100%" : "-100%" }}
                                    animate={{ 
                                        opacity, 
                                        scale, 
                                        x,
                                        zIndex 
                                    }}
                                    transition={{ 
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30
                                    }}
                                    className="absolute w-[280px] h-[480px] rounded-3xl overflow-hidden shadow-2xl"
                                >
                                    <video
                                        src={guide.video}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Content overlay for active slide */}
                                    {position === 0 && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-8 flex flex-col justify-between">
                                            <div className="text-left">
                                                <p className="text-[10px] text-white/80 uppercase tracking-widest mb-1">From business hours to blissful evenings...</p>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                {guide.products.map((product, pIdx) => (
                                                    <div key={pIdx} className="bg-black/60 backdrop-blur-md rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:bg-black/80 transition-all border border-white/10">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden p-1">
                                                                <Play className="w-4 h-4 text-white opacity-40" />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-[10px] text-white font-bold leading-tight">{product.name}</p>
                                                            </div>
                                                        </div>
                                                        <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white transition-all">
                                                            <ChevronRight className="w-3 h-3 text-white" />
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex gap-1 justify-center mt-4">
                                                    {guides.map((_, i) => (
                                                        <div key={i} className={`h-[2px] rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/30'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                <button 
                    onClick={handlePrev}
                    className="absolute left-0 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-primary hover:bg-white transition-all shadow-lg"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                    onClick={handleNext}
                    className="absolute right-0 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-primary hover:bg-white transition-all shadow-lg"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </section>
    );
}
