import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Activity, Lock, Phone } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold glow-text mb-6"
          >
            Aarogya Chain
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 mb-10"
          >
            ABHA Based Digital Health Records
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/patient-login" className="btn-primary no-underline text-lg px-8 py-4">
              I am a Patient
            </Link>
            <Link to="/doctor-login" className="btn-secondary no-underline text-lg px-8 py-4">
              I am a Doctor / Hospital
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Shield className="text-primary w-8 h-8" />}
              title="Digital Health Records"
              description="Access your medical history anywhere, anytime with your ABHA number."
            />
            <FeatureCard 
              icon={<Activity className="text-primary w-8 h-8" />}
              title="Emergency Doctor Access"
              description="Critical medical data available for doctors in seconds during emergencies."
            />
            <FeatureCard 
              icon={<Lock className="text-primary w-8 h-8" />}
              title="Secure IPFS Storage"
              description="Your records are encrypted and stored on decentralized IPFS network."
            />
            <FeatureCard 
              icon={<Shield className="text-primary w-8 h-8" />}
              title="Insurance Verification"
              description="Seamless verification for insurance claims and hospital admissions."
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center glass-card p-12">
          <Lock className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Uncompromising Security</h2>
          <p className="text-lg text-gray-600">
            We use industry-standard encryption and Blockchain-inspired IPFS storage to ensure that only authorized doctors and you can access your private health data.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <footer id="contact" className="py-12 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Phone className="w-8 h-8 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Get in Touch</h3>
          <p>support@aarogyachain.in</p>
          <div className="mt-8 pt-8 border-t border-white/20">
            <p>&copy; 2026 Aarogya Chain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card p-8 text-center"
  >
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default LandingPage;
