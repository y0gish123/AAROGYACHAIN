import React from 'react';
import { motion } from 'framer-motion';

const InsightCard = ({ title, detail, color }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-4 rounded-2xl ${color} border border-white/20`}
    >
        <h4 className="font-bold mb-1">{title}</h4>
        <p className="text-sm opacity-90">{detail}</p>
    </motion.div>
);

export default InsightCard;
