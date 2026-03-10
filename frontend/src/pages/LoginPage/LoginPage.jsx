import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Key, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(null); // 'Patient' or 'Doctor'
    const [id, setId] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Role, 2: ID, 3: OTP

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleIdSubmit = (e) => {
        e.preventDefault();
        setStep(3);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Mock Login
        if (role === 'Patient') {
            navigate('/patient-dashboard');
        } else {
            navigate('/doctor-dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card max-w-md w-full p-8"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Shield className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold">Secure Login</h1>
                    <p className="text-gray-600 mt-2">Access your digital health ecosystem</p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-4"
                        >
                            <button
                                onClick={() => handleRoleSelect('Patient')}
                                className="w-full p-6 glass-card hover:bg-primary/10 transition-all text-left flex items-center justify-between group"
                            >
                                <div>
                                    <h3 className="font-bold text-lg text-primary">I am a Patient</h3>
                                    <p className="text-sm text-gray-500">Access your ABHA records</p>
                                </div>
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                            <button
                                onClick={() => handleRoleSelect('Doctor')}
                                className="w-full p-6 glass-card hover:bg-secondary/10 transition-all text-left flex items-center justify-between group"
                            >
                                <div>
                                    <h3 className="font-bold text-lg text-secondary">I am a Doctor</h3>
                                    <p className="text-sm text-gray-500">View and upload patient reports</p>
                                </div>
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.form
                            key="step2"
                            onSubmit={handleIdSubmit}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <User size={16} /> {role === 'Patient' ? 'ABHA Number' : 'Doctor ID'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    placeholder={role === 'Patient' ? "1234-5678-9012" : "D-948573"}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-all"
                                />
                            </div>
                            <button type="submit" className="w-full btn-primary py-4">
                                Continue
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-gray-500 text-sm hover:underline"
                            >
                                Back to role selection
                            </button>
                        </motion.form>
                    )}

                    {step === 3 && (
                        <motion.form
                            key="step3"
                            onSubmit={handleLogin}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
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
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="000000"
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-all text-center text-2xl tracking-[1rem]"
                                />
                            </div>
                            <button type="submit" className="w-full btn-primary py-4">
                                Verify & Login
                            </button>
                            <p className="text-center text-sm text-gray-500">
                                OTP sent to your registered mobile ending in 4521
                            </p>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default LoginPage;
