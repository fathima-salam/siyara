"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "How to place an order?",
        answer: "To place an order, browse through our collection, select your favorite items, choose the specifications (like color), and click 'Add to Cart'. Once you're ready, proceed to checkout and follow the payment instructions.",
    },
    {
        question: "I can't wait! How long will it take to deliver an order?",
        answer: "Most domestic orders are delivered within 3-7 business days. You will receive a tracking link once your order is dispatched.",
    },
    {
        question: "Do you ship all over India?",
        answer: "Yes! We provide shipping services all across India. Delivery times may vary depending on your location.",
    },
    {
        question: "How can i track my order?",
        answer: "After your order is shipped, we'll send you an email with the tracking number and a link to the courier partner's website.",
    },
    {
        question: "How do i make payment?",
        answer: "We accept various payment methods including Credit/Debit Cards, UPI, Net Banking, and popular wallets. All transactions are securely processed through our payment gateway.",
    },
    {
        question: "How long does it take to deliver an international order?",
        answer: "International orders usually take 10-15 business days for delivery, depending on the destination country and customs processing.",
    },
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={onClick}
                className="w-full py-3 flex items-center justify-between text-left group transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border border-accent flex items-center justify-center transition-all ${isOpen ? 'bg-accent text-white' : 'text-accent group-hover:bg-accent/5'}`}>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <span className={`text-[13px] md:text-sm font-medium tracking-wide transition-colors ${isOpen ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}`}>
                        {question}
                    </span>
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4 pl-10 pr-4">
                            <p className="text-gray-500 text-[11px] md:text-xs leading-relaxed max-w-2xl">
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="py-10 bg-[#FAFAFA]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-8">
                    <h2 className="text-lg md:text-2xl font-extralight uppercase tracking-[0.3em] text-primary mb-3">
                        FREQUENTLY ASKED QUESTIONS (FAQ)
                    </h2>
                    <p className="text-gray-800 font-bold text-[10px] tracking-wide">
                        Yeah! We've Got your questions covered!
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
