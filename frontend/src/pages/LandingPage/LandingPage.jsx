import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  Activity,
  Lock,
  ArrowRight,
  Globe,
  Database,
  ChevronDown,
  CheckCircle,
  CheckCircle2,
  FileText,
  UserCheck,
  Building2,
  Stethoscope,
  UserCircle,
  ActivitySquare,
  ShieldCheck
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-primary/10 font-sans">
      <Navbar />

      {/* Hero Section - Government Style */}
      <section className="relative pt-32 pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.5,
                  delayChildren: 1.0
                }
              }
            }}
            className="flex-1 text-left space-y-8"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest"
            >
              <Globe size={12} className="animate-spin-slow" /> National Digital Health Infrastructure
            </motion.div>
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-light text-slate-900 leading-tight tracking-tight"
            >
              Integrated Security for <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2.0, delay: 1.8 }}
                className="text-primary font-bold inline-block"
              >
                Health Records
              </motion.span>
            </motion.h1>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium"
            >
              AarogyaChain provides a unified, decentralized platform for citizens and healthcare providers to manage medical diagnostics with guaranteed integrity.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link to="/login" className="btn-primary no-underline shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                Patient Portal Login
              </Link>
              <Link to="/doctor-login" className="px-8 py-3.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all no-underline flex items-center gap-2 group">
                Provider Access <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex items-center gap-8 pt-10 border-t border-slate-100"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">IPFS</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storage Protocol</span>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">ABHA</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity Sync</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -15, 0]
            }}
            transition={{
              opacity: { duration: 0.5, delay: 0.2 },
              scale: { duration: 0.5, delay: 0.2 },
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="flex-1 relative"
          >
            <div className="relative z-10 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-4 shadow-2xl">
              <img
                src="/premium_doctor_illustration_1773163377866.png"
                alt="Healthcare Professional"
                className="w-full h-auto rounded-2xl"
              />
            </div>
            {/* Decorative background element */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 180, 270, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 270, 180, 90, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-10 -left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10"
            />
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-slate-50 border-y border-slate-100 py-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
            <Building2 size={18} /> Tertiary Hospitals
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
            <Shield size={18} /> NDHM Compliant
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
            <Database size={18} /> IPFS Network
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
            <UserCircle size={18} /> ABHA Integrated
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
            <CheckCircle2 size={18} /> ISO Certified
          </motion.div>
        </motion.div>
      </div>

      {/* Core Services */}
      <section id="features" className="py-32 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="max-w-7xl mx-auto"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            className="max-w-2xl mb-20"
          >
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Service Ecosystem</h2>
            <h3 className="text-4xl font-black text-slate-900 leading-tight">Comprehensive Digital Health Infrastructure</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FileText,
                title: "Electronic Records",
                desc: "Secure storage of prescriptions, diagnostics, and lab reports accessible via ABHA UID.",
                color: "text-blue-600"
              },
              {
                icon: UserCheck,
                title: "Provider Verification",
                desc: "Stringent authentication for medical professionals and medical centers on the chain.",
                color: "text-emerald-600"
              },
              {
                icon: Database,
                title: "Decentralized IPFS",
                desc: "Distributed storage ensuring records are immutable and always available during emergencies.",
                color: "text-slate-600"
              },
              {
                icon: Shield,
                title: "Sovereign Privacy",
                desc: "Citizens maintain complete control over who can view or add to their medical history.",
                color: "text-blue-600"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group p-8 border border-slate-100 rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all bg-white"
              >
                <div className={`w-12 h-12 ${feature.color} mb-6 transition-transform group-hover:scale-110`}>
                  <feature.icon size={40} strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Security Protocol - Professional Light */}
      <section id="security" className="py-32 px-6 bg-slate-50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
            className="order-2 lg:order-1 relative"
          >
            <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-xl relative z-10">
              <div className="space-y-6">
                {[
                  "End-to-End Encryption protocol (AES-256)",
                  "ABHA-based Identity Verification",
                  "Distributed storage on decentralized nodes",
                  "Real-time audit log for citizens"
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                    className="flex items-center gap-4 group/item"
                  >
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                      <CheckCircle2 size={20} />
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 text-primary"
              >
                <Lock size={24} className="animate-pulse" />
                <p className="text-xs font-bold leading-relaxed uppercase tracking-wide">
                  State-of-the-art cryptographic protection ensuring citizen data sovereignty.
                </p>
              </motion.div>
            </div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }}
            className="order-1 lg:order-2 space-y-8"
          >
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Security Framework</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Government-Grade <br /> <span className="text-primary">Data Encryption</span></h3>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              AarogyaChain utilizes a bank-level security model ensuring your health records are accessible only by you and authorized healthcare providers.
            </p>
            <div className="flex items-center gap-10">
              <div className="text-left">
                <div className="text-3xl font-black text-slate-900 italic">256-BIT</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AES Protection</div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-left">
                <div className="text-3xl font-black text-slate-900 italic">E2EE</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vault Privacy</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-20 px-6 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center gap-2.5 justify-center md:justify-start">
              <div className="w-10 h-10 overflow-hidden rounded shadow-sm">
                <img src="/logo.jpeg" alt="AarogyaChain Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight uppercase italic">Aarogya<span className="text-primary">Chain</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed uppercase tracking-widest font-bold">
              National Medical Protocol for Citizen Sovereignty.
            </p>
          </div>

          <div className="flex justify-center md:justify-start gap-16 uppercase tracking-[.2em] font-black text-[10px] text-slate-400">
            <div className="space-y-4">
              <p className="text-slate-900 mb-6 tracking-[.4em]">Resource</p>
              <a href="#" className="block hover:text-primary transition-colors no-underline">Portal API</a>
              <a href="#" className="block hover:text-primary transition-colors no-underline">Documentation</a>
              <a href="#" className="block hover:text-primary transition-colors no-underline">Support</a>
            </div>
            <div className="space-y-4">
              <p className="text-slate-900 mb-6 tracking-[.4em]">Legal</p>
              <a href="#" className="block hover:text-primary transition-colors no-underline">Privacy Policy</a>
              <a href="#" className="block hover:text-primary transition-colors no-underline">Terms of Use</a>
              <a href="#" className="block hover:text-primary transition-colors no-underline">Compliances</a>
            </div>
          </div>

          <div className="text-center md:text-right space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 AarogyaChain</span>
            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Maintained by the National Health Hub <br /> in collaboration with Digital India.
            </p>
          </div>
        </div>
      </footer>
    </div >
  );
};

export default LandingPage;
