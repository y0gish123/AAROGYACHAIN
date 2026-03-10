import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  Activity,
  Lock,
  CheckCircle,
  ArrowRight,
  Mail,
  Globe,
  Users,
  Database
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="glass-card p-8 flex flex-col gap-4 border border-slate-100 hover:border-primary/30 transition-all group"
  >
    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
      <Icon className="text-primary w-8 h-8 group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-medical-bg scroll-smooth">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-green-100/50 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Aarogya <span className="text-primary">Chain</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              Secure Digital Health Records powered by decentralized storage.
              Taking Indian healthcare to the next level of security and accessibility.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link to="/login" className="btn-primary no-underline text-lg group flex items-center gap-2">
              I am a Patient <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-secondary no-underline text-lg group flex items-center gap-2">
              I am a Doctor / Hospital <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={Database}
              title="Digital Health Records"
              description="Access medical history anytime, anywhere with your unified ABHA number. Seamless synchronization across providers."
            />
            <FeatureCard
              icon={Users}
              title="Emergency Doctor Access"
              description="Grant critical medical data access to authorized doctors in seconds during emergencies. Every second counts."
            />
            <FeatureCard
              icon={Lock}
              title="Secure IPFS Storage"
              description="Your records are encrypted and stored on the decentralized IPFS network, ensuring zero data tampering and high availability."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Insurance Verification"
              description="Accelerate hospital admissions and insurance claim processing with instant, verifiable digital health certificates."
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 px-6 bg-medical-bg">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-12 md:p-16 border border-primary/20 flex flex-col md:flex-row items-center gap-16 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>

            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-bold text-slate-900">Uncompromising Security</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We protect your most sensitive data using bank-grade encryption and Blockchain-inspired IPFS storage.
                Our architecture ensures that only you and the doctors you authorize can access your private health information.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { icon: Shield, text: "End-to-end encryption" },
                  { icon: Database, text: "Blockchain inspired storage" },
                  { icon: Lock, text: "Doctor authorization control" },
                  { icon: Activity, text: "Full Audit Trail" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <item.icon className="text-primary w-5 h-5" />
                    </div>
                    <span className="font-semibold text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-full h-80 bg-gradient-to-br from-primary to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden shadow-blue-500/30"
              >
                <Lock className="text-white w-32 h-32 opacity-20 absolute" />
                <Shield className="text-white w-40 h-40 relative z-10 drop-shadow-2xl" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">Aarogya Chain</span>
            </div>
            <p className="max-w-md text-slate-400">
              Empowering patients and doctors with secure, decentralized digital health records across India.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
              <Mail className="text-primary w-6 h-6" /> Get in Touch
            </h4>
            <a href="mailto:support@aarogyachain.in" className="text-lg text-slate-300 hover:text-primary transition-colors no-underline">
              support@aarogyachain.in
            </a>
            <div className="flex gap-4 justify-center md:justify-start mt-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="font-bold">in</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="font-bold">𝕏</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
          © 2026 Aarogya Chain. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
