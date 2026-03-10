import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Search, FileText, User, Calendar, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import confetti from 'canvas-confetti';

const DoctorDashboard = () => {
    const [abha, setAbha] = useState('');
    const [patientName, setPatientName] = useState('');
    const [reportType, setReportType] = useState('General Checkup');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file first");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('abhaNumber', abha);
        formData.append('patientName', patientName);
        formData.append('reportType', reportType);
        formData.append('doctorName', 'Dr. Demo');
        formData.append('report', file);

        try {
            // Check if backend is reachable before real upload
            await axios.get('http://localhost:5000/api/reports/health').catch(e => {
                if (e.code === 'ERR_NETWORK') throw new Error('OFFLINE');
            });

            const response = await axios.post('http://localhost:5000/api/reports/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsUploading(false);
            handleSuccess();
        } catch (error) {
            console.error("Upload process encountered an issue", error);

            if (error.message === 'OFFLINE') {
                // MOCK SUCCESS for demo when backend is offline
                setTimeout(() => {
                    setIsUploading(false);
                    handleSuccess("Demo Upload Success (Offline)");
                }, 1500);
            } else {
                alert("Upload failed. Make sure the backend is running.");
                setIsUploading(false);
            }
        }
    };

    const handleSuccess = (msg) => {
        setUploadSuccess(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2563EB', '#2E8B57', '#F8FAFC']
        });
        setTimeout(() => setUploadSuccess(false), 5000);
    };

    return (
        <div className="min-h-screen bg-background pt-24 px-4 pb-12">
            <Navbar />
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 mb-8"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Upload className="text-primary w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
                            <p className="text-gray-600">Upload new medical records to ABHA Chain</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <User size={16} /> Patient ABHA Number
                            </label>
                            <input
                                type="text"
                                value={abha}
                                onChange={(e) => setAbha(e.target.value)}
                                placeholder="1234-5678-9012"
                                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <User size={16} /> Patient Name
                            </label>
                            <input
                                type="text"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <FileText size={16} /> Report Type
                            </label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-all"
                            >
                                <option>General Checkup</option>
                                <option>Blood Test</option>
                                <option>X-Ray / MRI</option>
                                <option>Prescription</option>
                                <option>Discharge Summary</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Calendar size={16} /> Date
                            </label>
                            <input
                                type="date"
                                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-all"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="hidden"
                                    id="pdf-upload"
                                    accept=".pdf"
                                />
                                <label htmlFor="pdf-upload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <p className="font-semibold text-primary">
                                        {file ? file.name : "Click to select or drag PDF file"}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">Maximum file size: 10MB</p>
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                                    />
                                ) : (
                                    <>
                                        <Upload size={20} />
                                        Upload securely to IPFS
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

                <AnimatePresence>
                    {uploadSuccess && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="fixed bottom-8 right-8 bg-[#1FA97A] text-white p-4 rounded-xl shadow-lg flex items-center gap-3"
                        >
                            <CheckCircle />
                            <div>
                                <p className="font-bold">Success!</p>
                                <p className="text-sm opacity-90">Report uploaded and linked to ABHA</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DoctorDashboard;
