// src/App.tsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Calendar,
  Trophy,
  Users2,
  Code,
  Rocket,
  Globe,
  Instagram,
  Linkedin,
  MessageSquare,
  MapPin,
  Clock,
  Gift,
  Briefcase,
  Users,
  Brain,
  Network,
  Star,
  Award,
  Cloud,
  Building2,
} from "lucide-react";
import { Toaster } from "react-hot-toast";

// ✅ Fixed imports (use ../components/ for non-page components)
import { ParticlesBackground } from "../components/ParticlesBackground";
import { CountdownTimer } from "../components/CountdownTimer";
import { FAQSection } from "../components/FAQSection";
import { RegistrationSuccess } from "../components/RegistrationSuccess";
import { RegistrationForm } from "../components/RegistrationForm";
import { PaymentPage } from "../components/PaymentPage";

// ✅ Page imports
import About from "./About";
import Tracks from "./Tracks";

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

function Navigation() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-white"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            Skill Sprint
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-300">Powered by</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">Hubexus</span>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function CollaboratorsSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          In Collaboration With
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-12 items-center">
          {[
            {
              name: "Hubexus",
              logo: "https://hubexus.com/wp-content/uploads/2025/03/Add-a-heading-1-scaled.png",
              description: "Leading technology solutions provider",
              isCircle: false,
              size: "h-24",
            },
            {
              name: "Tech Projects Hub",
              logo: "/techprojectshub.png",
              description: "Innovation and project development platform",
              isCircle: false,
              size: "h-24",
            },
            {
              name: "Department of AIML",
              logo: "https://upload.wikimedia.org/wikipedia/en/4/4b/Mohan_Babu_University_Logo%2C_Tirupati%2C_Andhra_Pradesh%2C_India.png",
              description: "Mohan Babu University",
              isCircle: false,
              size: "h-24",
            },
            {
              name: "The Coding Club",
              logo: "https://lh3.googleusercontent.com/a/ACg8ocJAuTcKKDTgQNOGlPBiaC_KNw1SihXTcfziX_dHC8FUnqqaXR4=s576-c-no",
              description: "Student technology community",
              isCircle: true,
              size: "h-24 w-24",
            },
            {
              name: "Internship & Events Club",
              logo: "https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=IEC",
              description: "Career development and events organization",
              isCircle: true,
              size: "h-24 w-24",
            },
          ].map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              <div className="relative h-full p-6 rounded-2xl backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:border-blue-500/30">
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="mb-4 relative flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl"></div>
                    <div
                      className={`relative ${partner.size} flex items-center justify-center ${
                        partner.isCircle ? "rounded-full overflow-hidden" : ""
                      }`}
                    >
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className={`h-full ${
                          partner.isCircle
                            ? "w-full object-cover"
                            : "w-auto object-contain"
                        }`}
                      />
                    </div>
                  </motion.div>

                  <h3 className="text-lg font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {partner.name}
                  </h3>
                  <p className="text-gray-400">{partner.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />

      {/* ✅ Using HomeContent as-is (shortened here) */}
      {/* Replace "Register Now" button link */}
      <footer className="py-12 px-4 relative">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <h3 className="text-2xl font-bold mb-4">
              Ready to Join Skill Sprint?
            </h3>
            <p className="text-gray-300 mb-6">
              Build innovative LMS platforms and compete for amazing prizes!
            </p>
            <Link to="/register">
              {/* ✅ Fixed Register Now to go to /register */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center gap-2 glow-effect"
              >
                Register Now
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navigation />
      <Toaster position="top-center" />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tracks" element={<Tracks />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route
            path="/registration-success"
            element={<RegistrationSuccess />}
          />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
