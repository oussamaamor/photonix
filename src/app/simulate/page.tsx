"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Plotly with SSR disabled
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// --- Simulation Types ---
interface MaterialParams { Eg0: number; alpha: number; beta: number }
interface SimulationConfig { Tmin: number; Tmax: number; steps: number; peakFwhm: number; amplitude: number; instrumentResolution: number }
interface Spectrum { temperature: number; Eg: number; energies: number[]; intensities: number[] }

// --- Simulation Function ---
export function runTemperatureSweep(material: MaterialParams, config: SimulationConfig): Spectrum[] {
  const spectra: Spectrum[] = [];
  const dT = (config.Tmax - config.Tmin) / (config.steps - 1);

  for (let i = 0; i < config.steps; i++) {
    const T = config.Tmin + i * dT;
    const Eg = material.Eg0 - (material.alpha * T * T) / (T + material.beta);

    const energies: number[] = [];
    const intensities: number[] = [];
    const numPoints = 200;

    for (let j = 0; j < numPoints; j++) {
      const E = Eg - 0.1 + (0.2 * j) / numPoints;
      const I = config.amplitude * Math.exp(-Math.pow(E - Eg, 2) / (2 * config.peakFwhm ** 2));
      energies.push(E);
      intensities.push(I);
    }
    spectra.push({ temperature: T, Eg, energies, intensities });
  }
  return spectra;
}

// --- React Component ---
export default function SimulatePage() {
  const [Eg0, setEg0] = useState(2.3);
  const [alpha, setAlpha] = useState(0.0005);
  const [beta, setBeta] = useState(200);
  const [Tmin, setTmin] = useState(100);
  const [Tmax, setTmax] = useState(400);
  const [steps, setSteps] = useState(50);

  const [spectra, setSpectra] = useState<Spectrum[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const runSimulation = () => {
    const results = runTemperatureSweep({ Eg0, alpha, beta }, { Tmin, Tmax, steps, peakFwhm: 0.05, amplitude: 1, instrumentResolution: 0.01 });
    setSpectra(results);
    setCurrentIndex(0);
  };

  const exportCSV = () => {
    if (!spectra.length) return;
    const csvContent = spectra
      .map((s) => `T=${s.temperature},` + s.energies.map((e, i) => `${e}:${s.intensities[i]}`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "simulation.csv";
    link.click();
  };

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <h1 className="text-2xl font-bold mb-6">Perovskite Simulation</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div><Label htmlFor="Eg0">Eg0 (eV)</Label><Input id="Eg0" type="number" step="0.01" value={Eg0} onChange={e => setEg0(parseFloat(e.target.value))} /></div>
        <div><Label htmlFor="alpha">Alpha</Label><Input id="alpha" type="number" step="0.0001" value={alpha} onChange={e => setAlpha(parseFloat(e.target.value))} /></div>
        <div><Label htmlFor="beta">Beta</Label><Input id="beta" type="number" step="1" value={beta} onChange={e => setBeta(parseFloat(e.target.value))} /></div>
        <div><Label htmlFor="Tmin">T min (K)</Label><Input id="Tmin" type="number" value={Tmin} onChange={e => setTmin(parseFloat(e.target.value))} /></div>
        <div><Label htmlFor="Tmax">T max (K)</Label><Input id="Tmax" type="number" value={Tmax} onChange={e => setTmax(parseFloat(e.target.value))} /></div>
        <div><Label htmlFor="steps">Steps</Label><Input id="steps" type="number" value={steps} onChange={e => setSteps(parseInt(e.target.value))} /></div>
      </div>

      <Button className="mb-4" onClick={runSimulation}>Run Simulation</Button>

      {spectra.length > 0 && (
        <div className="mb-6">
          <label className="block mb-1">Animate PL Spectrum:</label>
          <input type="range" min={0} max={spectra.length - 1} value={currentIndex} onChange={e => setCurrentIndex(parseInt(e.target.value))} className="w-full mb-1" />
          <p>T = {spectra[currentIndex].temperature.toFixed(1)} K</p>
          <Button className="mb-4 mt-2" onClick={exportCSV}>Export CSV</Button>
        </div>
      )}

      {spectra.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Plot
            data={[{ x: spectra.map(s => s.temperature), y: spectra.map(s => s.Eg), type: "scatter", mode: "lines+markers", name: "Eg(T)" }]}
            layout={{ 
              width: 500, 
              height: 400, 
              title: { text: "Bandgap vs Temperature" }, 
              xaxis: { title: { text: "T (K)" } }, // FIX: Wrapped string in { text: ... }
              yaxis: { title: { text: "Eg (eV)" } }  // FIX: Wrapped string in { text: ... }
            }}
          />
          <Plot
            data={[{ x: spectra[currentIndex].energies, y: spectra[currentIndex].intensities, type: "scatter", mode: "lines", name: "PL Spectrum" }]}
            layout={{ 
              width: 500, 
              height: 400, 
              title: { text: `PL Spectrum at T=${spectra[currentIndex].temperature.toFixed(1)} K` }, 
              xaxis: { title: { text: "Energy (eV)" } }, // FIX: Wrapped string in { text: ... }
              yaxis: { title: { text: "Intensity (a.u.)" } } // FIX: Wrapped string in { text: ... }
            }}
          />
        </div>
      )}
    </main>
  );
}