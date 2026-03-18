"use client";

import { useState, useRef } from "react";
import { authService } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, Phone, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhoneLogin({ onSuccess, redirect = "/checkout" }) {
    const [phone, setPhone] = useState("");
    const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef([]);
    const [step, setStep] = useState(1); // 1: Phone input, 2: OTP input
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [agreed, setAgreed] = useState(false);
    const { setUserInfo } = useAuthStore();

    const handleSendOTP = async (e) => {
        if (e) e.preventDefault();
        if (!agreed && step === 1) {
            setError("Please agree to the Terms of Use");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await authService.sendOTP(phone);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        if (e) e.preventDefault();
        const otpString = otpArray.join("");
        if (otpString.length !== 6) return;

        setError("");
        setLoading(true);
        try {
            const data = await authService.verifyOTP(phone, otpString);
            setUserInfo(data);
            if (onSuccess) onSuccess(data);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...otpArray];
        newOtp[index] = value.substring(value.length - 1);
        setOtpArray(newOtp);

        // Move to next box if value is entered
        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otpArray[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="w-full max-w-[340px] mx-auto">
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="phone"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-5"
                    >
                        <h2 className="text-[20px] font-medium text-[#444462] tracking-tight">
                            Login <span className="text-[#3E4152] font-semibold text-[14px]">or</span> <span className="text-[#3E4152] font-bold">Signup</span>
                        </h2>

                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div className="relative group overflow-hidden border border-[#D4D5D9] rounded-sm focus-within:border-primary transition-all">
                                <div className="flex items-center px-4 py-2.5">
                                    <span className="text-[#3E4152] text-base font-medium pr-3">+91</span>
                                    <div className="h-5 w-[1px] bg-[#D4D5D9] mr-4" />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Mobile Number"
                                        className="w-full bg-transparent text-base text-[#282C3F] focus:outline-none placeholder:text-[#94969F]"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <label className="relative mt-0.5 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)} 
                                    />
                                    <div className="w-3.5 h-3.5 border border-[#D4D5D9] rounded-sm peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                                        {agreed && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                    </div>
                                </label>
                                <p className="text-[11px] text-[#282C3F] leading-snug">
                                    By continuing, I agree to the <span className="text-[#FF3F6C] font-bold cursor-pointer hover:underline">Terms of Use</span> & <span className="text-[#FF3F6C] font-bold cursor-pointer hover:underline">Privacy Policy</span> and I am above 18 years old.
                                </p>
                            </div>
                            
                            {error && (
                                <p className="text-[10px] text-red-500 font-medium">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !phone || !agreed}
                                className="w-full bg-[#979797] hover:bg-[#888888] disabled:bg-[#D4D5D9] text-white py-3 text-sm font-bold uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "CONTINUE"}
                            </button>
                        </form>

                        <p className="text-[11px] text-[#282C3F]">
                            Have trouble logging in? <span className="text-[#FF3F6C] font-bold cursor-pointer hover:underline">Get help</span>
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="otp"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <h2 className="text-[20px] font-bold text-[#3E4152] tracking-tight">
                            Verify OTP
                        </h2>
                        
                        <div className="space-y-1">
                            <p className="text-[12px] text-[#94969F]">OTP sent to <span className="text-[#3E4152] font-bold">+91 {phone}</span></p>
                            <button 
                                onClick={() => setStep(1)}
                                className="text-[11px] text-[#FF3F6C] font-bold hover:underline"
                            >
                                Change Phone Number
                            </button>
                        </div>

                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="flex justify-between gap-2">
                                {otpArray.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        type="tel"
                                        maxLength={1}
                                        required
                                        className="w-10 h-12 border border-[#D4D5D9] rounded-sm text-center text-lg font-bold text-[#282C3F] focus:outline-none focus:border-primary transition-all"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, index)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    />
                                ))}
                            </div>

                            {error && (
                                <p className="text-[10px] text-red-500 font-medium text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || otpArray.join("").length !== 6}
                                className="w-full bg-[#979797] hover:bg-[#888888] disabled:bg-[#D4D5D9] text-white py-3 text-sm font-bold uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "VERIFY & LOGIN"}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
