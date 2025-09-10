import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import { Check, Home } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { ParticlesBackground } from './ParticlesBackground';

interface LocationState {
  teamName?: string;
}

export function RegistrationSuccess() {
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const teamName = locationState?.teamName;

  // Fire confetti once on mount
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <ParticlesBackground />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-lg w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-500/20 border-2 border-green-400">
            <Check className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-green-400">
          Payment Submitted Successfully! 🎉
        </h1>
        <p className="text-gray-300 mb-6">
          {teamName ? (
            <>
              Team <span className="font-semibold text-white">{teamName}</span> has been registered for{" "}
              <span className="font-semibold text-white">Skill Sprint</span>.
              <br />
              Your payment screenshot has been submitted for verification.
            </>
          ) : (
            <>
              Your team has been registered for{" "}
              <span className="font-semibold text-white">Skill Sprint</span>.
              <br />
              Your payment screenshot has been submitted for verification.
            </>
          )}
        </p>

        <div className="glass-card p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">What's Next?</h3>
          <ul className="text-left text-gray-300 space-y-2">
            <li>• Your payment will be verified within 24 hours</li>
            <li>• You'll receive a confirmation email once verified</li>
            <li>• Problem statements will be released on September 23rd</li>
            <li>• Join our WhatsApp group for updates</li>
          </ul>
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center gap-2 mx-auto"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
