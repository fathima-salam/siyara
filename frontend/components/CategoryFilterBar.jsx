"use client";

const categories = [
    { name: "All Products", value: null },
    { name: "Hijabs", value: "Hijabs" },
    { name: "Accessories", value: "Accessories" },
    { name: "Necklaces", value: "Necklace" },
    { name: "Rings", value: "Rings" },
    { name: "Earrings", value: "Earring" }
];

export default function CategoryFilterBar({ activeCategory, onCategoryChange }) {
    return (
        <div className="sticky top-[48px] lg:top-[56px] z-30 w-full bg-white border-b border-gray-100 mb-10 shadow-sm md:shadow-none">
            <div className="overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex gap-8 md:gap-12 min-w-max px-4 py-2">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.value || (cat.value === null && !activeCategory);
                        return (
                            <button
                                key={cat.name}
                                onClick={() => onCategoryChange(cat.value)}
                                className={`relative text-[11px] md:text-xs font-bold tracking-[0.15em] uppercase transition-all pb-2 whitespace-nowrap ${isActive
                                        ? "text-primary border-b-2 border-accent"
                                        : "text-gray-400 hover:text-primary"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
