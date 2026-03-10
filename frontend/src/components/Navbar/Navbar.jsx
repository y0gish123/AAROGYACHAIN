import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Left: Logo */}
                <Link to="/" className="flex items-center gap-3 no-underline group transition-transform hover:scale-105">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                        <Shield className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
                        Aarogya Chain
                    </span>
                </Link>

                {/* Center: Links */}
                <div className="hidden lg:flex items-center gap-10">
                    <a href="#features" className="nav-link no-underline">Features</a>
                    <a href="#security" className="nav-link no-underline">Security</a>
                    <a href="#contact" className="nav-link no-underline">Contact</a>
                </div>

                {/* Right: Login */}
                <div>
                    <Link to="/login" className="btn-primary no-underline text-base px-6 py-3">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
