import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Shield, Lock, Mail, ClipboardSignature } from 'lucide-react';
import axios from 'axios';

const DoctorRegister = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [uid, setUid] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/doctor/register', {
                fullName, uid, email, password, confirmPassword
            });
            if (res.data.success) {
                navigate('/doctor-login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Ensure backend is running.');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card max-w-md w-full p-8"
            >
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <ClipboardSignature className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold">Doctor Registration</h1>
                    <p className="text-gray-600 mt-2">Join the digital health ecosystem</p>
                </div>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <User size={16} /> Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Dr. John Doe"
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-secondary focus:outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Shield size={16} /> Gov Verified Doctor UID
                        </label>
                        <input
                            type="text"
                            required
                            value={uid}
                            onChange={(e) => setUid(e.target.value)}
                            placeholder="D-948573"
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-secondary focus:outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Mail size={16} /> Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="doctor@hospital.com"
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-secondary focus:outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Lock size={16} /> Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-secondary focus:outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Lock size={16} /> Confirm Password
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-secondary focus:outline-none transition-all"
                        />
                    </div>
                    <button type="submit" className="w-full btn-secondary py-3 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all mt-2">
                        Register
                    </button>
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Already have an account? <Link to="/doctor-login" className="text-secondary hover:underline">Log in</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default DoctorRegister;
