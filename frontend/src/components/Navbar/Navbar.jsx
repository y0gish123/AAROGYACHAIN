import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Navbar = () => {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200"
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Left: Logo */}
                <Link to="/" className="flex items-center gap-2.5 no-underline group">
                    <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg shadow-sm">
                        <img src="/logo.jpeg" alt="AarogyaChain Logo" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-black text-slate-900 tracking-tight uppercase">
                            Aarogya<span className="text-primary italic">Chain</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">National Health Portal</span>
                    </div>
                </Link>

                {/* Center: Links */}
                <div className="hidden lg:flex items-center gap-1">
                    {['Features', 'Security', 'Contact'].map((item) => (
                        <motion.a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            whileHover={{ backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
                            className="px-5 py-2 rounded-lg text-slate-600 font-bold uppercase tracking-wider text-[11px] hover:text-primary transition-all no-underline"
                        >
                            {item}
                        </motion.a>
                    ))}
                </div>

                {/* Right: Login */}
                <div className="flex items-center gap-4">
                    <Link to="/doctor-login" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors no-underline hidden sm:block">
                        Clinic Access
                    </Link>
                    <Link to="/login" className="btn-primary no-underline text-xs px-6 py-2.5 rounded-lg">
                        Patient Login
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
