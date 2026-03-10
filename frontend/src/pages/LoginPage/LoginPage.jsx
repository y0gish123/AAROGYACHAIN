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

    const handleIdSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (id.length < 1) return;

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
                    <h1 className="text-3xl font-bold">Patient Login</h1>
                    <p className="text-gray-600 mt-2">Access your digital health ecosystem</p>
                </div>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            onSubmit={handleIdSubmit}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <User size={16} /> ABHA Number
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={id}
                                    onChange={(e) => {
                                        const onlyNums = e.target.value.replace(/\D/g, '');
                                        if (onlyNums.length <= 12) setId(onlyNums);
                                    }}
                                    placeholder="1234-5678-9012"
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-all"
                                />
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
