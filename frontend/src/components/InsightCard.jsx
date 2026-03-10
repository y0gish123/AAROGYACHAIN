import React from 'react';
import { motion } from 'framer-motion';

const InsightCard = ({ title, detail, color }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-4 rounded-2xl ${color} border border-white/40 shadow-sm relative overflow-hidden`}
    >
        <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50 animate-pulse" />
            <h4 className="font-bold text-xs uppercase tracking-tight">{title}</h4>
        </div>
        <p className="text-sm leading-relaxed font-medium opacity-90">{detail}</p>
        <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12">
            <div className="w-8 h-8 rounded-full border-4 border-current" />
        </div>
    </motion.div>
);

export default InsightCard;
