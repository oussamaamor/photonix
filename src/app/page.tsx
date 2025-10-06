"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FlaskConical, Brain, Database, LineChart } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Hero Section */}
      <section className="text-center py-24 px-6">
        <motion.h1
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Photonix — The AI-Powered Research Companion
        </motion.h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Analyze, visualize, and interpret your scientific data with the power of AI.  
          From spectroscopy to electrochemistry — Photonix understands your data.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="rounded-2xl px-8 text-lg">
            Try Demo
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-2xl px-8 text-lg border-2"
          >
            Request Access
          </Button>
        </div>
      </section>

      {/* Supported Techniques */}
      <section className="py-16 bg-slate-100">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Supported Techniques
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-4">
          {[
            "XRD",
            "Raman",
            "FTIR",
            "NMR",
            "XPS",
            "UV-Vis",
            "PL",
            "Square Wave Voltammetry",
            "Linear Sweep Voltammetry",
            "CV",
          ].map((tech, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow p-3 text-center font-medium text-slate-700"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI-Powered Analysis */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          AI That Understands Science
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: "Natural Language Understanding",
              desc: "Ask Photonix to generate plots, analyze spectra, or summarize experimental data in natural language.",
            },
            {
              icon: Database,
              title: "Smart Data Handling",
              desc: "Import multiple files (XRD, Raman, Electrochemical...) and Photonix will automatically classify and process them.",
            },
            {
              icon: LineChart,
              title: "Instant Visualization",
              desc: "Animate, overlay, or deconvolute curves easily with AI-assisted interpretation and rich visualization tools.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center"
            >
              <f.icon className="w-12 h-12 mb-4 text-indigo-600" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
        <h2 className="text-3xl font-semibold mb-6">
          Ready to Supercharge Your Research?
        </h2>
        <p className="text-lg mb-10 text-blue-100">
          Join researchers and labs using Photonix to automate and accelerate scientific insights.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="rounded-2xl px-8 text-lg font-semibold"
        >
          Join the Beta
        </Button>
      </section>
    </main>
  );
}
