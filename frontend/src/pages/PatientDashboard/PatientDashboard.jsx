import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar, User, MessageCircle, Activity, Heart, Droplets } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const PatientDashboard = () => {
    const [reports] = useState([
        { id: 1, name: 'Blood Test Report', date: '2024-03-01', doctor: 'Dr. Sharma', type: 'Laboratory', url: '#' },
        { id: 2, name: 'X-Ray Chest', date: '2024-02-15', doctor: 'Dr. Mehta', type: 'Radiology', url: '#' },
        { id: 3, name: 'General Consultation', date: '2024-01-20', doctor: 'Dr. Gupta', type: 'Prescription', url: '#' },
    ]);

    return (
        <div className="min-h-screen bg-background pt-24 px-4 pb-12">
            <Navbar />
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold">Welcome, Demo Patient</h1>
                                <p className="text-gray-600">ABHA: 1234-5678-9012</p>
                            </div>
                            <div className="p-4 bg-primary/10 rounded-2xl flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-primary font-bold">Encrypted & Secure</span>
                            </div>
                        </div>

                        {/* Health Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <StatCard icon={<Heart className="text-red-500" />} label="Heart Rate" value="72 bpm" />
                            <StatCard icon={<Droplets className="text-blue-500" />} label="Blood Sugar" value="98 mg/dL" />
                            <StatCard icon={<Activity className="text-primary" />} label="Blood Pressure" value="120/80" />
                        </div>

                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FileText className="text-primary" /> Recent Medical Reports
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b border-gray-100">
                                        <th className="pb-4 font-semibold">Report Name</th>
                                        <th className="pb-4 font-semibold">Date</th>
                                        <th className="pb-4 font-semibold">Doctor</th>
                                        <th className="pb-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reports.map((report) => (
                                        <tr key={report.id} className="group hover:bg-primary/5 transition-colors">
                                            <td className="py-4 font-medium">{report.name}</td>
                                            <td className="py-4 text-gray-600">{report.date}</td>
                                            <td className="py-4 text-gray-600">{report.doctor}</td>
                                            <td className="py-4">
                                                <div className="flex gap-2">
                                                    <button className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="p-2 hover:bg-secondary/10 rounded-lg text-secondary transition-colors">
                                                        <Download size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>

                {/* AI Chatbot Side Panel */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 h-[calc(100vh-180px)] sticky top-28 flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                                <MessageCircle className="text-secondary" />
                            </div>
                            <div>
                                <h2 className="font-bold">Aarogya AI</h2>
                                <p className="text-xs text-secondary font-semibold">Online Assistance</p>
                            </div>
                        </div>

                        <div className="flex-1 bg-white/50 rounded-2xl p-4 overflow-y-auto mb-4 space-y-4">
                            <div className="bg-secondary/10 p-3 rounded-2xl rounded-tl-none text-sm mr-8">
                                Hello! I've analyzed your latest blood report. Your parameters look healthy. Would you like a detailed summary?
                            </div>
                            <div className="bg-primary/10 p-3 rounded-2xl rounded-tr-none text-sm ml-8">
                                Yes, please show me those insight cards.
                            </div>

                            {/* AI Insight Cards in Chat */}
                            <div className="space-y-3">
                                <InsightCard title="Normal BP" detail="120/80 is perfect." color="bg-green-100 text-green-700" />
                                <InsightCard title="Sugar Level" detail="Normal range (98 mg/dL)" color="bg-blue-100 text-blue-700" />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Ask about your health..."
                                className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary transition-all"
                            />
                            <button className="btn-secondary rounded-xl p-3">
                                <MessageCircle size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="p-4 rounded-2xl bg-white/50 border border-white flex items-center gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="font-bold text-lg">{value}</p>
        </div>
    </div>
);

const InsightCard = ({ title, detail, color }) => (
    <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${color} p-3 rounded-xl border border-white/20`}
    >
        <p className="font-bold text-xs uppercase mb-1">{title}</p>
        <p className="text-sm">{detail}</p>
    </motion.div>
);

export default PatientDashboard;
