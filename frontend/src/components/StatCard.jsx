import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, unit, color }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="glass-card-sm p-4 flex items-center gap-4 transition-all relative overflow-hidden group"
    >
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
            <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
        <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{label}</p>
            <div className="flex items-baseline gap-1">
                <p className="text-xl font-black text-slate-800 font-display">{value}</p>
                <span className="text-[10px] font-bold text-slate-400 lowercase">{unit}</span>
            </div>
        </div>
        <div className={`absolute -right-2 -bottom-2 w-12 h-12 ${color} opacity-[0.03] rounded-full blur-xl group-hover:opacity-[0.08] transition-opacity`} />
    </motion.div>
);

export default StatCard;
