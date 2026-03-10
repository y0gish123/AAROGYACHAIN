import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Download,
    Eye,
    Calendar,
    User,
    MessageCircle,
    Activity,
    Heart,
    Droplets,
    AlertCircle,
    ChevronRight,
    Search,
    Send
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import StatCard from '../../components/StatCard';
import InsightCard from '../../components/InsightCard';
import axios from 'axios';

const PatientDashboard = () => {
    // Retrieve data from localStorage with demo fallback
    const storedPatient = JSON.parse(localStorage.getItem('patientData') || '{"abhaNumber":"1234567890","name":"Demo Patient"}');

    const [abha, setAbha] = useState(storedPatient.abhaNumber);
    const [patientName, setPatientName] = useState(storedPatient.name);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [expandedReport, setExpandedReport] = useState(null);

    React.useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/reports/${abha}`);
                setReports(response.data);
                setIsDemoMode(response.data.some(r => r._id.startsWith('mock')));
            } catch (error) {
                console.warn("Failed to fetch reports from backend", error);
                setReports([]);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [abha]);

    const getReportIcon = (type) => {
        const t = type.toLowerCase();
        if (t.includes('blood')) return { icon: Droplets, color: 'text-red-500', bg: 'bg-red-50' };
        if (t.includes('checkup')) return { icon: Activity, color: 'text-green-500', bg: 'bg-green-50' };
        if (t.includes('x-ray') || t.includes('scan')) return { icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50' };
        return { icon: FileText, color: 'text-primary', bg: 'bg-primary/10' };
    };

    const [chatMessages, setChatMessages] = useState([
        { text: "Hello! I'm Aarogya AI. I've analyzed your medical history and vitals. Ask me anything!", isAi: true }
    ]);
    const [insights, setInsights] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [inputMessage, setInputMessage] = useState('');

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setChatMessages(prev => [...prev, { text: "Analyzing your medical history...", isAi: false }]);
        try {
            const response = await axios.post('http://localhost:5000/api/reports/analyze', { abhaNumber: abha });
            setChatMessages(prev => [...prev, { text: response.data.message, isAi: true }]);
            setInsights(response.data.insights);
        } catch (error) {
            const mockMessage = "I've analyzed your records. Your heart rate and blood pressure are stable. I recommend monitoring your iron levels as they were slightly low in your last blood test.";
            const mockInsights = [
                { title: "Vitals Check", detail: "Stable & Healthy", color: "bg-green-100 text-green-700" },
                { title: "Iron Levels", detail: "Slightly Low (11.2)", color: "bg-blue-100 text-blue-700" }
            ];
            setTimeout(() => {
                setChatMessages(prev => [...prev, { text: mockMessage, isAi: true }]);
                setInsights(mockInsights);
            }, 1000);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMsg = inputMessage;
        setChatMessages(prev => [...prev, { text: userMsg, isAi: false }]);
        setInputMessage('');

        setTimeout(() => {
            let aiResponse = "I'm here to help. Are you asking about a specific report or vital?";
            if (userMsg.toLowerCase().includes('heart')) aiResponse = "Your recent heart rate was 72 bpm, which is within the ideal range.";
            if (userMsg.toLowerCase().includes('iron') || userMsg.toLowerCase().includes('blood')) aiResponse = "Your last blood test showed hemoglobin at 11.2 g/dL. We should aim for 12.0+.";

            setChatMessages(prev => [...prev, { text: aiResponse, isAi: true }]);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background pt-24 px-4 pb-12">
            <Navbar />
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Welcome Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold font-display">Welcome, {patientName}</h1>
                                <p className="text-gray-600 mt-1 flex items-center gap-2">
                                    <User size={16} /> Patient ABHA: <span className="font-mono font-bold text-primary">{abha}</span>
                                </p>
                            </div>
                            <div className="p-4 bg-primary/10 rounded-2xl flex items-center gap-3">
                                <div className={`w-3 h-3 ${isDemoMode ? 'bg-yellow-500' : 'bg-green-500'} rounded-full animate-pulse`}></div>
                                <span className="text-primary font-bold">
                                    {isDemoMode ? 'Demo Records' : 'Live Health Data'}
                                </span>
                            </div>
                        </div>

                        {/* Recent Vitals */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard icon={Heart} label="Heart Rate" value="72" unit="bpm" color="bg-red-500" />
                            <StatCard icon={Droplets} label="Blood Sugar" value="98" unit="mg/dL" color="bg-blue-500" />
                            <StatCard icon={Activity} label="Blood Pressure" value="120/80" unit="" color="bg-primary" />
                            <StatCard icon={AlertCircle} label="SPO2" value="99" unit="%" color="bg-orange-500" />
                        </div>

                        {/* Health Trends Visualizer */}
                        <div className="bg-white/50 border border-gray-100 rounded-3xl p-6 mb-8">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-primary" /> Vitals History (Last 30 Days)
                            </h3>
                            <div className="h-40 flex items-end justify-between gap-2 px-2">
                                {[65, 72, 68, 80, 75, 70, 72].map((v, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div
                                            className="w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/40 relative"
                                            style={{ height: `${v}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {v} bpm
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400">Week {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Medical Reports Table */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="text-primary" /> Medical History & Reports
                            </h2>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white border border-gray-100 rounded-xl hover:border-primary transition-all">
                                    <Search size={18} className="text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="py-12 text-center text-gray-400">Loading secure medical records...</div>
                            ) : reports.length === 0 ? (
                                <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                    No medical reports found.
                                </div>
                            ) : reports.map((report) => {
                                const category = getReportIcon(report.reportType);
                                const isExpanded = expandedReport === report._id;

                                return (
                                    <div key={report._id} className="border border-gray-100 rounded-3xl overflow-hidden transition-all hover:border-primary/30">
                                        <div
                                            className="p-4 bg-white flex items-center justify-between cursor-pointer"
                                            onClick={() => setExpandedReport(isExpanded ? null : report._id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-2xl ${category.bg}`}>
                                                    <category.icon className={category.color} size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{report.reportType}</h4>
                                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                                        <Calendar size={14} /> {new Date(report.date).toLocaleDateString()} • {report.doctorName}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={report.ipfsUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 hover:bg-primary/10 rounded-xl text-primary"
                                                >
                                                    <Eye size={20} />
                                                </a>
                                                <ChevronRight
                                                    className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                                />
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="bg-gray-50/50 border-t border-gray-100"
                                                >
                                                    <div className="p-6">
                                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Clinical Summary</h5>
                                                        <p className="text-gray-700 leading-relaxed text-sm">
                                                            {report.summary || "No automated summary available for this record."}
                                                        </p>
                                                        <div className="mt-4 flex gap-3">
                                                            <a
                                                                href={report.ipfsUrl}
                                                                download
                                                                className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline underline-offset-4"
                                                            >
                                                                <Download size={14} /> Download Original Scan (IPFS)
                                                            </a>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* AI Chatbot Side Panel */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 h-[calc(100vh-140px)] sticky top-28 flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                                <MessageCircle className="text-secondary" />
                            </div>
                            <div>
                                <h2 className="font-bold">Aarogya AI</h2>
                                <p className="text-xs text-secondary font-semibold">Ready to help</p>
                            </div>
                        </div>

                        <div className="flex-1 bg-white/50 rounded-2xl p-4 overflow-y-auto mb-4 space-y-4 scrollbar-hide">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`${msg.isAi ? 'bg-secondary/10 rounded-tl-none mr-8' : 'bg-primary/10 rounded-tr-none ml-8'} p-3 rounded-2xl text-sm`}>
                                    {msg.text}
                                </div>
                            ))}

                            {/* AI Insight Cards in Chat */}
                            <div className="space-y-3">
                                {insights.map((insight, i) => (
                                    <InsightCard key={i} title={insight.title} detail={insight.detail} color={insight.color} />
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSendMessage} className="space-y-2">
                            <button
                                type="button"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full btn-secondary py-3 text-sm flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
                            >
                                {isAnalyzing ? <Activity className="animate-spin" size={16} /> : <AlertCircle size={16} />}
                                {isAnalyzing ? "Processing History..." : "Generate AI Insights"}
                            </button>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Ask about your records..."
                                    className="flex-1 p-3 rounded-xl border border-gray-100 focus:outline-none focus:border-secondary transition-all text-sm bg-white/80"
                                />
                                <button type="submit" className="bg-secondary text-white rounded-xl p-3 hover:scale-105 transition-transform">
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
