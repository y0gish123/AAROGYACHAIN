import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, unit, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-card p-4 flex items-center gap-4 transition-all"
    >
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
            <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold">{value} <span className="text-sm font-normal text-gray-400">{unit}</span></p>
        </div>
    </motion.div>
);

export default StatCard;
