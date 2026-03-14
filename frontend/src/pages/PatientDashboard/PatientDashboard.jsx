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
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const PatientDashboard = () => {
    const navigate = useNavigate();

    // Retrieve data from localStorage
    const patientDataRaw = localStorage.getItem('patientData');

    React.useEffect(() => {
        if (!patientDataRaw) {
            navigate('/login/patient');
        }
    }, [patientDataRaw, navigate]);

    if (!patientDataRaw) return null; // Avoid rendering until redirect happens

    const storedPatient = JSON.parse(patientDataRaw);

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
                const cleanAbha = abha.replace(/\D/g, '');
                const response = await axios.get(`http://localhost:5000/api/reports/${cleanAbha}`);
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
        if (isAnalyzing) return;
        setIsAnalyzing(true);
        const loadingMessage = { text: "Analyzing your medical history...", isAi: false };
        setChatMessages(prev => [...prev, loadingMessage]);

        try {
            const response = await axios.post('http://localhost:5000/api/reports/analyze', { abhaNumber: abha });

            // Remove loading message and add real response
            setChatMessages(prev => {
                const newMessages = prev.filter(m => m !== loadingMessage);
                return [...newMessages, { text: response.data.message, isAi: true }];
            });
            setInsights(response.data.insights || []);
        } catch (error) {
            console.error("Analysis Failed:", error);
            setChatMessages(prev => {
                const newMessages = prev.filter(m => m !== loadingMessage);
                return [...newMessages, { text: "I'm sorry, I'm having trouble analyzing your records right now. Please try again later.", isAi: true }];
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isAnalyzing) return;

        const userMsg = inputMessage;
        const newHistory = [...chatMessages, { text: userMsg, isAi: false }];

        setChatMessages(newHistory);
        setInputMessage('');
        setIsAnalyzing(true);

        try {
            const response = await axios.post('http://localhost:5000/api/reports/chat', {
                abhaNumber: abha,
                message: userMsg,
                history: chatMessages // Send previous history (excluding current message)
            });

            setChatMessages(prev => [...prev, { text: response.data.message, isAi: true }]);
        } catch (error) {
            console.error("Chat Failed:", error);
            setChatMessages(prev => [...prev, { text: "Sorry, I couldn't process your request. Please try again.", isAi: true }]);
        } finally {
            setIsAnalyzing(false);
        }
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
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-primary font-bold">
                                    Live Health Data
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
                                                <Link
                                                    to={`/report/${report._id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 hover:bg-primary/10 rounded-xl text-primary"
                                                >
                                                    <Eye size={20} />
                                                </Link>
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
                        className="glass-card border-none bg-white/40 backdrop-blur-xl h-[calc(100vh-140px)] sticky top-28 flex flex-col shadow-2xl shadow-primary/5 overflow-hidden"
                    >
                        {/* Chat Header */}
                        <div className="p-6 border-b border-primary/5 bg-gradient-to-r from-primary/5 to-secondary/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-primary/10">
                                            <MessageCircle className="text-primary" size={20} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900 leading-tight">Aarogya AI</h2>
                                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <span className="w-1 h-1 bg-green-500 rounded-full animate-ping"></span>
                                            Online & Secure
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-primary">
                                        <Activity size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            <AnimatePresence mode="popLayout">
                                {chatMessages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`relative max-w-[88%] group`}>
                                            <div className={`
                                                px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                                                ${msg.isAi 
                                                    ? 'bg-white text-gray-800 rounded-tl-none border border-primary/5' 
                                                    : 'bg-primary text-white rounded-tr-none shadow-primary/20'}
                                            `}>
                                                {msg.text}
                                            </div>
                                            <span className={`text-[10px] mt-1 block opacity-0 group-hover:opacity-100 transition-opacity ${msg.isAi ? 'text-gray-400' : 'text-primary/60 text-right'}`}>
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {isAnalyzing && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white border border-primary/5 rounded-2xl rounded-tl-none p-4 shadow-sm flex gap-1.5 items-center">
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </motion.div>
                            )}

                            {/* AI Insight Cards in Chat */}
                            {insights.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3 pt-4 border-t border-primary/5"
                                >
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Deep Health Insights</h4>
                                    {insights.map((insight, i) => (
                                        <InsightCard key={i} title={insight.title} detail={insight.detail} color={insight.color} />
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Chat Input Area */}
                        <div className="p-6 bg-white/60 backdrop-blur-md border-t border-primary/5">
                            <form onSubmit={handleSendMessage} className="space-y-3">
                                <button
                                    type="button"
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                    className="w-full relative group overflow-hidden bg-white border border-secondary/20 hover:border-secondary transition-all py-2.5 rounded-xl text-xs font-bold text-secondary flex items-center justify-center gap-2 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    {isAnalyzing ? <Activity className="animate-spin" size={14} /> : <AlertCircle size={14} />}
                                    {isAnalyzing ? "Analyzing Medical History..." : "Generate AI Health Summary"}
                                </button>
                                
                                <div className="relative flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        placeholder="Ask about your records..."
                                        className="flex-1 bg-white border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12 placeholder:text-gray-400"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!inputMessage.trim() || isAnalyzing}
                                        className="absolute right-1.5 p-2 bg-primary text-white rounded-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-center text-gray-400">
                                    End-to-end encrypted medical consultation
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
