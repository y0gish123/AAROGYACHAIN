import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Search,
    FileText,
    User,
    Calendar,
    CheckCircle,
    QrCode,
    Activity,
    Heart,
    AlertCircle,
    Eye,
    ChevronRight,
    ArrowLeft,
    Send,
    MessageCircle,
    LayoutDashboard,
    History,
    Zap,
    ExternalLink,
    Shield
} from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import StatCard from '../../components/StatCard';
import InsightCard from '../../components/InsightCard';
import confetti from 'canvas-confetti';

const DoctorDashboard = () => {
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'search'

    // Upload State
    const [abha, setAbha] = useState('');
    const [patientName, setPatientName] = useState('');
    const [reportType, setReportType] = useState('General Checkup');
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Search/View State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedPatient, setSearchedPatient] = useState(null);
    const [patientReports, setPatientReports] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    // AI Chat State
    const [chatMessages, setChatMessages] = useState([
        { text: "Welcome back, Doctor. I've prepared the analysis environment. Search for a patient to begin diagnostic synthesis.", isAi: true }
    ]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [insights, setInsights] = useState([]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a diagnostic file.");

        setIsUploading(true);
        const formData = new FormData();
        // Normalize ABHA for storage
        formData.append('abhaNumber', abha.replace(/\D/g, ''));
        formData.append('patientName', patientName);
        formData.append('reportType', reportType);
        formData.append('doctorName', 'Dr. Demo');
        formData.append('date', reportDate);
        formData.append('report', file);

        try {
            await axios.post('http://localhost:5000/api/reports/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsUploading(false);
            handleSuccess();
            setAbha('');
            setPatientName('');
            setFile(null);
        } catch (error) {
            setIsUploading(false);
            alert(error.response?.data?.error || "Upload failed.");
        }
    };

    const handleSearchPatient = async (e, forcedAbha = null) => {
        if (e) e.preventDefault();
        const targetAbha = (forcedAbha || searchQuery).toString().trim().replace(/-/g, '');
        if (!targetAbha) return;

        setIsSearching(true);
        setError('');
        setSearchedPatient(null);
        setPatientReports([]);
        setChatMessages([{ text: `Initializing secure data retrieval for ABHA: ${targetAbha}...`, isAi: true }]);

        try {
            const [patientRes, reportsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/auth/patient/${targetAbha}`),
                axios.get(`http://localhost:5000/api/reports/${targetAbha}`)
            ]);

            setSearchedPatient(patientRes.data.patient);
            setPatientReports(reportsRes.data);
            setChatMessages(prev => [
                ...prev,
                { text: `Profile for ${patientRes.data.patient.name} loaded successfully. Found ${reportsRes.data.length} records on chain. Would you like an automated clinical summary?`, isAi: true }
            ]);
        } catch (err) {
            setError("Patient record not found in the decentralized registry.");
            setChatMessages(prev => [...prev, { text: "Error: Unable to locate records for this identity vector.", isAi: true }]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleScanQR = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            // After scanning, you would typically get an ABHA number and then call handleSearchPatient
            // For example: handleSearchPatient(null, scannedAbhaNumber);
            setError("QR scanning is active. Please scan an ABHA QR code.");
        }, 2200);
    };

    const handleAnalyze = async () => {
        if (!searchedPatient) return;
        setIsAnalyzing(true);
        setChatMessages(prev => [...prev, { text: "Synthesizing cross-report insights...", isAi: true }]);
        try {
            const response = await axios.post('http://localhost:5000/api/reports/analyze', { abhaNumber: searchedPatient.abhaNumber });
            setChatMessages(prev => [
                ...prev.filter(m => !m.text.includes("Synthesizing")),
                { text: response.data.message, isAi: true }
            ]);
            setInsights(response.data.insights || []);
        } catch (error) {
            const mockMsg = `AI Analysis for ${searchedPatient.name}: Recent vitals indicate stable homeostasis. Heart rate (72bpm) and BP (120/80) are optimal. Suggest reviewing the last Blood Test for micronutrient trends.`;
            setChatMessages(prev => [
                ...prev.filter(m => !m.text.includes("Synthesizing")),
                { text: mockMsg, isAi: true }
            ]);
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
            // Doctors can also chat with AI about the searched patient
            const response = await axios.post('http://localhost:5000/api/reports/chat', {
                abhaNumber: searchedPatient.abhaNumber,
                message: userMsg,
                history: chatMessages
            });

            setChatMessages(prev => [...prev, { text: response.data.message, isAi: true }]);
        } catch (error) {
            console.error("Chat Failed:", error);
            setChatMessages(prev => [...prev, { text: "Sorry, I couldn't process your request. Please try again.", isAi: true }]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSuccess = () => {
        setUploadSuccess(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#2563EB', '#059669', '#F8FAFC'] });
        setTimeout(() => setUploadSuccess(false), 5000);
    };

    return (
        <div className="min-h-screen bg-background pt-24 px-4 pb-12 overflow-x-hidden">
            <Navbar />

            <div className="max-w-7xl mx-auto">
                {/* Header Stats */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-2"
                        >
                            <span className="bg-primary/10 text-primary p-2 rounded-lg"><LayoutDashboard size={20} /></span>
                            <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Diagnostic Hub</span>
                        </motion.div>
                        <h1 className="text-4xl font-black text-slate-800 font-display">Medical Console</h1>
                    </div>

                    <div className="flex gap-2 bg-white/50 p-1.5 rounded-2xl border border-white/40 shadow-sm backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'upload' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}
                        >
                            <Upload size={18} /> Upload
                        </button>
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'search' ? 'bg-secondary text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}
                        >
                            <Search size={18} /> Search
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'upload' ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Form Column */}
                            <div className="lg:col-span-8 glass-card p-10">
                                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Patient ABHA Number</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                            <input
                                                type="text"
                                                onChange={(e) => {
                                                    const onlyNums = e.target.value.replace(/\D/g, '');
                                                    if (onlyNums.length <= 14) setAbha(onlyNums);
                                                }}
                                                value={abha.replace(/(\d{4})(?=\d)/g, '$1 ')}
                                                placeholder="0000 0000 0000 00"
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-medium"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Patient Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                            <input
                                                type="text"
                                                value={patientName}
                                                onChange={(e) => setPatientName(e.target.value)}
                                                placeholder="Legal clinical name"
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-medium"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Diagnostic Category</label>
                                        <select
                                            value={reportType}
                                            onChange={(e) => setReportType(e.target.value)}
                                            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-medium appearance-none"
                                        >
                                            <option>General Checkup</option>
                                            <option>Blood Test</option>
                                            <option>X-Ray / MRI</option>
                                            <option>Prescription</option>
                                            <option>Discharge Summary</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Record Date</label>
                                        <input
                                            type="date"
                                            value={reportDate}
                                            onChange={(e) => setReportDate(e.target.value)}
                                            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="relative group overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center hover:border-primary/50 transition-all cursor-pointer">
                                            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="file-drop" accept=".pdf" />
                                            <label htmlFor="file-drop" className="cursor-pointer block relative z-10">
                                                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                                    <Upload className="text-primary" size={32} />
                                                </div>
                                                <p className="text-xl font-bold text-slate-700">{file ? file.name : "Secure PDF Drop Zone"}</p>
                                                <p className="text-sm text-slate-400 mt-2">Maximum file size: 10MB • IPFS Encrypted</p>
                                            </label>
                                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <button type="submit" disabled={isUploading} className="btn-primary w-full h-16 text-xl">
                                            <div className="flex items-center justify-center gap-3">
                                                {isUploading ? <Activity className="animate-spin" /> : <Zap size={22} />}
                                                <span>{isUploading ? "Uploading..." : "Upload"}</span>
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Info Column */}
                            <div className="lg:col-span-4 space-y-8">
                                <div className="glass-card p-8 bg-slate-900 text-white">
                                    <Shield className="mb-4 text-primary" size={40} />
                                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Secured by IPFS</h3>
                                    <p className="text-slate-400 leading-relaxed mb-6">
                                        Diagnostics are encrypted and stored across a decentralized network. Only authorized ABHA nodes can decrypt this information.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm font-bold bg-white/10 p-3 rounded-xl border border-white/10">
                                            <CheckCircle size={16} className="text-emerald-400" /> End-to-end Encryption
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold bg-white/10 p-3 rounded-xl border border-white/10">
                                            <CheckCircle size={16} className="text-emerald-400" /> Immutable Audit Log
                                        </div>
                                    </div>
                                </div>
                                <div className="glass-card p-8 text-white">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Live Health Network</h4>
                                    <div className="space-y-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-4 items-center">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${40 + i * 20}%` }}
                                                        className="h-full bg-slate-200"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="space-y-10"
                        >
                            {/* Modern Search Bar */}
                            <div className="glass-card p-10 relative overflow-hidden">
                                <form onSubmit={handleSearchPatient} className="flex flex-col md:flex-row gap-4 relative z-10">
                                    <div className="flex-1 relative group">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={24} />
                                        <input
                                            type="text"
                                            required={false}
                                            onChange={(e) => {
                                                const onlyNums = e.target.value.replace(/\D/g, '');
                                                if (onlyNums.length <= 14) setSearchQuery(onlyNums);
                                            }}
                                            value={searchQuery.replace(/(\d{4})(?=\d)/g, '$1 ')}
                                            placeholder="Verify via 14-digit ABHA Number"
                                            className="w-full pl-16 pr-6 py-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all text-xl font-medium shadow-inner"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button type="submit" disabled={isSearching} className="btn-secondary px-10 rounded-3xl shadow-emerald-500/20">
                                            <div className="flex items-center gap-2">
                                                {isSearching ? <Activity className="animate-spin" /> : <ChevronRight size={20} />}
                                                <span>Retrieve Profile</span>
                                            </div>
                                        </button>
                                        <button type="button" onClick={handleScanQR} disabled={isScanning} className="bg-slate-900 text-white p-6 rounded-3xl hover:bg-slate-800 transition-all shadow-xl active:scale-95 group flex items-center justify-center">
                                            <QrCode size={24} className="group-hover:rotate-12 transition-transform" />
                                        </button>
                                    </div>
                                </form>
                                {error && <div className="mt-6 flex items-center gap-3 text-red-500 font-bold bg-red-50 p-4 rounded-2xl border border-red-100 animate-shake"><AlertCircle size={20} /> {error}</div>}

                                {isScanning && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="mt-10 p-20 glass-card-sm border-dashed border-primary/30 flex flex-col items-center relative group"
                                    >
                                        <div className="absolute inset-x-0 h-0.5 bg-primary/40 shadow-[0_0_15px_rgba(99,102,241,1)] animate-laser pointer-events-none" />
                                        <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-6 relative">
                                            <QrCode size={48} className="text-primary opacity-40" />
                                            <div className="absolute inset-0 border-2 border-primary rounded-[2rem] animate-ping opacity-20" />
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-700 font-display">Optical Recognition Active</h4>
                                        <p className="text-slate-400 mt-2 font-medium">Detecting unique ABHA vector...</p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Patient Data Console */}
                            {searchedPatient && (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    {/* History/Timeline Column */}
                                    <div className="lg:col-span-8 space-y-10">
                                        <div className="glass-card p-10">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 order-1">
                                                            <User size={36} />
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-emerald-50">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-3xl font-black text-slate-800 leading-tight">{searchedPatient.name}</h3>
                                                        <p className="text-slate-400 font-bold flex items-center gap-2">
                                                            <Shield size={14} /> ABHA: {searchedPatient.abhaNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="vitals-grid">
                                                    <StatCard icon={Heart} label="Pulse Rate" value="72" unit="bpm" color="bg-red-500" />
                                                    <StatCard icon={Activity} label="BP Vector" value="120/80" unit="mmhg" color="bg-primary" />
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                                    <History className="text-primary" /> Clinical Timeline
                                                </h3>

                                                <div className="relative space-y-8 pl-8">
                                                    {/* Vertical Line */}
                                                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-100" />

                                                    {patientReports.length === 0 ? (
                                                        <div className="py-20 text-center glass-card-sm border-slate-100">
                                                            <FileText className="mx-auto text-slate-200 mb-4" size={48} />
                                                            <p className="text-slate-400 font-bold">Zero diagnostic vectors found.</p>
                                                        </div>
                                                    ) : (
                                                        patientReports.map((report) => (
                                                            <motion.div
                                                                key={report._id}
                                                                whileHover={{ x: 10 }}
                                                                className="relative glass-card-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                                                            >
                                                                <div className="absolute -left-[37px] top-7 w-4 h-4 rounded-full bg-white border-4 border-slate-200 group-hover:border-primary transition-colors" />
                                                                <div className="flex items-center gap-5">
                                                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                                        <FileText size={24} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-black text-slate-800 text-lg group-hover:text-primary transition-colors">{report.reportType}</p>
                                                                        <div className="flex items-center gap-3 mt-1">
                                                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(report.date).toLocaleDateString()}</span>
                                                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                            <span className="text-xs font-bold text-slate-400">{report.doctorName}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <a
                                                                    href={report.ipfsUrl}
                                                                    target="_blank" rel="noreferrer"
                                                                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-50 text-slate-400 font-bold text-sm hover:bg-slate-900 hover:text-white transition-all group/btn"
                                                                >
                                                                    <ExternalLink size={16} className="group-hover/btn:scale-110 transition-transform" /> PIN VIEW
                                                                </a>
                                                            </motion.div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Assistant Sidebar */}
                                    <div className="lg:col-span-4 h-full">
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="glass-card p-0 flex flex-col h-[750px] sticky top-24 border-primary/20 shadow-2xl shadow-primary/5 overflow-hidden"
                                        >
                                            {/* AI Header */}
                                            <div className="p-6 bg-slate-900 flex flex-col gap-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                                            <MessageCircle size={24} />
                                                        </div>
                                                        <span className="text-xl font-black text-white font-display">Clinical AI</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Node
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleAnalyze}
                                                    disabled={isAnalyzing}
                                                    className="w-full bg-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-black text-white hover:brightness-110 transition-all shadow-lg shadow-primary/30"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Zap size={16} />
                                                        <span>{isAnalyzing ? 'Processing History...' : 'Generate Auto-Summary'}</span>
                                                    </div>
                                                </button>
                                            </div>

                                            {/* Chat History */}
                                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
                                                {chatMessages.map((msg, i) => (
                                                    <div key={i} className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}>
                                                        <div className={`max-w-[90%] p-4 rounded-3xl text-sm leading-relaxed ${msg.isAi
                                                            ? 'bg-white text-slate-700 shadow-sm border border-slate-100 font-medium'
                                                            : 'bg-primary text-white font-bold shadow-lg shadow-primary/20'
                                                            }`}>
                                                            {msg.text}
                                                        </div>
                                                    </div>
                                                ))}
                                                {insights.length > 0 && (
                                                    <div className="space-y-3 mt-6">
                                                        {insights.map((insight, i) => (
                                                            <InsightCard key={i} {...insight} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Chat Input */}
                                            <div className="p-6 bg-white border-t border-slate-100">
                                                <form onSubmit={handleSendMessage} className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        value={inputMessage}
                                                        onChange={(e) => setInputMessage(e.target.value)}
                                                        placeholder="Ask clinical queries..."
                                                        className="flex-1 p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-300"
                                                    />
                                                    <button type="submit" className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95">
                                                        <Send size={18} />
                                                    </button>
                                                </form>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {uploadSuccess && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="fixed bottom-8 right-8 bg-emerald-500 text-white p-5 rounded-3xl shadow-2xl shadow-emerald-500/20 flex items-center gap-4 z-50 border border-white/20"
                        >
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="font-black uppercase tracking-widest text-[10px] opacity-70">Protocol Success</p>
                                <p className="font-bold">Record Pinned to IPFS</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Background Blob Decor */}
            <div className="fixed -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="fixed -bottom-20 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        </div>
    );
};

export default DoctorDashboard;
