import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="max-w-7xl mx-auto glass-card px-8 py-4 flex items-center justify-between"
            >
                <Link to="/" className="text-2xl font-bold text-primary no-underline flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg"></div>
                    Aarogya Chain
                </Link>

                <div className="hidden md:flex items-center gap-8 font-medium">
                    <a href="#features" className="text-text hover:text-primary no-underline transition-colors">Features</a>
                    <a href="#security" className="text-text hover:text-primary no-underline transition-colors">Security</a>
                    <a href="#contact" className="text-text hover:text-primary no-underline transition-colors">Contact</a>
                    <Link to="/login" className="btn-primary no-underline">Login</Link>
                </div>
            </motion.div>
        </nav>
    );
};

export default Navbar;
