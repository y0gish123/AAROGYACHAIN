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
    const [abha, setAbha] = useState('1234567890'); // Default demo ABHA
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isDemoMode, setIsDemoMode] = useState(false);

    React.useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/reports/${abha}`);
                setReports(response.data);
                setIsDemoMode(false);
            } catch (error) {
                console.warn("Failed to fetch reports from backend, falling back to Demo Mode", error);
                // Fallback Mock Data
                setReports([
                    {
                        _id: 'mock1',
                        reportType: 'Blood Test',
                        date: new Date('2024-03-01'),
                        doctorName: 'Dr. Aris (Demo)',
                        ipfsUrl: '#'
                    },
                    {
                        _id: 'mock2',
                        reportType: 'General Checkup',
                        date: new Date('2024-02-15'),
                        doctorName: 'Dr. Gupta (Demo)',
                        ipfsUrl: '#'
                    }
                ]);
                setIsDemoMode(true);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [abha]);

    const [chatMessages, setChatMessages] = useState([
        { text: "Hello! I'm Aarogya AI. Click below to analyze your reports for health insights.", isAi: true }
    ]);
    const [insights, setInsights] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [inputMessage, setInputMessage] = useState('');

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setChatMessages(prev => [...prev, { text: "Analyzing your medical reports...", isAi: false }]);
        try {
            const response = await axios.post('http://localhost:5000/api/reports/analyze', { abhaNumber: abha });
            setChatMessages(prev => [...prev, { text: response.data.message, isAi: true }]);
            setInsights(response.data.insights);
        } catch (error) {
            // Mock Analysis Fallback
            const mockMessage = "I've analyzed your records. Your heart rate and blood pressure are within healthy ranges. However, I noticed your iron levels were slightly low in your last blood test. I recommend including more spinach and lentils in your diet.";
            const mockInsights = [
                { title: "Vitals Check", detail: "Stable & Healthy", color: "bg-green-100 text-green-700" },
                { title: "Nutrition Tip", detail: "Increase Iron Intake", color: "bg-blue-100 text-blue-700" }
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

        // Mock AI Response
        setTimeout(() => {
            let aiResponse = "I'm here to help with your health queries. Could you please clarify if you're asking about a specific report?";
            if (userMsg.toLowerCase().includes('heart')) aiResponse = "Your recent heart rate was 72 bpm, which is very healthy!";
            if (userMsg.toLowerCase().includes('blood')) aiResponse = "Your blood metrics look stable, though we should monitor the iron levels as discussed.";

            setChatMessages(prev => [...prev, { text: aiResponse, isAi: true }]);
        }, 800);
    };

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
                                <p className="text-gray-600">ABHA: {abha}</p>
                            </div>
                            <div className="p-4 bg-primary/10 rounded-2xl flex items-center gap-3">
                                <div className={`w-3 h-3 ${isDemoMode ? 'bg-yellow-500' : 'bg-green-500'} rounded-full animate-pulse`}></div>
                                <span className="text-primary font-bold">
                                    {isDemoMode ? 'Demo Mode (Offline)' : 'Encrypted & Secure'}
                                </span>
                            </div>
                        </div>

                        {/* Health Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <StatCard icon={Heart} label="Heart Rate" value="72" unit="bpm" color="bg-red-500" />
                            <StatCard icon={Droplets} label="Blood Sugar" value="98" unit="mg/dL" color="bg-blue-500" />
                            <StatCard icon={Activity} label="Blood Pressure" value="120/80" unit="" color="bg-primary" />
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
                                    {loading ? (
                                        <tr><td colSpan="4" className="py-8 text-center text-gray-400">Loading your secure records...</td></tr>
                                    ) : reports.length === 0 ? (
                                        <tr><td colSpan="4" className="py-8 text-center text-gray-400">No reports found for this ABHA.</td></tr>
                                    ) : reports.map((report) => (
                                        <tr key={report._id} className="group hover:bg-primary/5 transition-colors">
                                            <td className="py-4 font-medium">{report.reportType}</td>
                                            <td className="py-4 text-gray-600">{new Date(report.date).toLocaleDateString()}</td>
                                            <td className="py-4 text-gray-600">{report.doctorName}</td>
                                            <td className="py-4">
                                                <div className="flex gap-2">
                                                    <a href={report.ipfsUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors">
                                                        <Eye size={18} />
                                                    </a>
                                                    <a href={report.ipfsUrl} download className="p-2 hover:bg-secondary/10 rounded-lg text-secondary transition-colors">
                                                        <Download size={18} />
                                                    </a>
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
                                className="w-full btn-secondary py-3 text-sm flex items-center justify-center gap-2"
                            >
                                {isAnalyzing ? "Analyzing Reports..." : "Analyze My Health"}
                            </button>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Ask about your health..."
                                    className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary transition-all text-sm"
                                />
                                <button type="submit" className="btn-secondary rounded-xl p-3">
                                    <MessageCircle size={18} />
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
