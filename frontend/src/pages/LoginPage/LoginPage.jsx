import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Shield, Key } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: ID, 2: OTP
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    // Cooldown timer effect
    React.useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/patient/generate-otp', { abhaNumber: id });
            if (res.data.success) {
                alert(`Your new OTP is: ${res.data.otp}`);
                setResendCooldown(30); // 30 seconds cooldown
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        }
    };

    const handleIdSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (id.length !== 14) {
            setError('ABHA Number must be exactly 14 digits.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/patient/generate-otp', { abhaNumber: id });
            if (res.data.success) {
                alert(`Your OTP is: ${res.data.otp}`);
                setStep(2);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate OTP. Ensure backend is running.');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/patient/login', { abhaNumber: id, otp });
            if (res.data.success) {
                localStorage.setItem('patientData', JSON.stringify(res.data.patient));
                navigate('/patient-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Ensure backend is running.');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* Header with Logo and Brand */}
            <header className="fixed top-0 left-0 right-0 p-6 flex justify-center md:justify-start">
                <Link to="/" className="flex items-center gap-2.5 no-underline group">
                    <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg shadow-sm border border-slate-100 bg-white">
                        <img src="/logo.jpeg" alt="AarogyaChain Logo" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-black text-slate-900 tracking-tight uppercase">
                            Aarogya<span className="text-primary italic">Chain</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">National Health Portal</span>
                    </div>
                </Link>
            </header>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card max-w-md w-full p-8 mt-16"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Patient Login</h1>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Enter your 14-digit ABHA number to access your account</p>
                </div>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            onSubmit={handleIdSubmit}
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -10, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <User size={16} /> ABHA Number
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        required
                                        onChange={(e) => {
                                            const onlyNums = e.target.value.replace(/\D/g, '');
                                            if (onlyNums.length <= 14) setId(onlyNums);
                                        }}
                                        value={id.replace(/(\d{4})(?=\d)/g, '$1 ')}
                                        placeholder="0000 0000 0000 00"
                                        className="w-full p-5 text-2xl font-bold text-center tracking-[0.2em] rounded-2xl border-2 border-primary/30 focus:border-primary focus:outline-none transition-all bg-white shadow-inner"
                                    />
                                    {/* Central Vertical Divider */}
                                    <div className="absolute left-1/2 top-1/4 bottom-1/4 w-[2px] bg-primary/20 -translate-x-1/2 pointer-events-none" />
                                </div>
                            </div>
                            <button type="submit" className="w-full btn-primary py-4">
                                Continue
                            </button>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.form
                            key="step2"
                            onSubmit={handleLogin}
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -10, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Key size={16} /> Enter 6-digit OTP
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => {
                                        // Strict numeric validation (strips away any non-numeric character)
                                        const onlyNums = e.target.value.replace(/\D/g, '');
                                        setOtp(onlyNums);
                                    }}
                                    placeholder="000000"
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-all text-center text-2xl tracking-[1rem]"
                                />
                            </div>
                            <button type="submit" className="w-full btn-primary py-4">
                                Verify & Login
                            </button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    disabled={resendCooldown > 0}
                                    onClick={handleResendOtp}
                                    className={`text-sm font-bold transition-colors ${resendCooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:text-blue-700'}`}
                                >
                                    {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-gray-500 text-sm hover:underline mt-4"
                            >
                                Back
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <Link to="/" className="hover:underline">Back to Home</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
