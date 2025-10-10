"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface Dataset {
  name: string;
  headers: string[];
  data: number[][];
}

export default function AnalyzePage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const newDatasets: Dataset[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = await file.text();
      // Use regex to split by comma or tab
      const rows = text.trim().split("\n").map(r => r.split(/,|\t/).map(Number));
      // Assume the first row might be headers, but treat as data for simplicity here
      // Headers are auto-generated if the first row is data, too
      newDatasets.push({ name: file.name, headers: rows[0].map((_, idx) => `Col ${idx+1}`), data: rows });
    }
    setDatasets(newDatasets);
    setSelectedIndex(0);
  };

  const exportCSV = (dataset: Dataset) => {
    const csv = dataset.data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${dataset.name}_export.csv`;
    link.click();
  };

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <h1 className="text-2xl font-bold mb-6">Multi-Analysis Data Analyzer</h1>

      <div className="mb-4">
        <Label htmlFor="fileUpload">Upload your data files (CSV/TXT)</Label>
        <Input id="fileUpload" type="file" multiple onChange={e => handleFiles(e.target.files)} />
      </div>

      {datasets.length > 0 && (
        <>
          <Label>Select dataset:</Label>
          <select value={selectedIndex} onChange={e => setSelectedIndex(parseInt(e.target.value))} className="mb-4">
            {datasets.map((d, idx) => <option key={idx} value={idx}>{d.name}</option>)}
          </select>

          <Button className="mb-4" onClick={() => exportCSV(datasets[selectedIndex])}>Export CSV</Button>

          {/* Data Table */}
          <div className="overflow-auto max-h-64 border mb-4">
            <table className="min-w-full border">
              <thead>
                <tr>{datasets[selectedIndex].headers.map((h, idx) => <th key={idx} className="border px-2">{h}</th>)}</tr>
              </thead>
              <tbody>
                {datasets[selectedIndex].data.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((val, j) => <td key={j} className="border px-2">{val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Plot */}
          <Plot
            data={datasets[selectedIndex].headers.map((h, idx) => ({
              x: datasets[selectedIndex].data.map(row => row[0]),
              y: datasets[selectedIndex].data.map(row => row[idx]),
              type: "scatter",
              mode: "lines+markers",
              name: h
            }))}
            layout={{ 
              width: 800, 
              height: 400, 
              title: { text: datasets[selectedIndex].name },
              // ADDED FIX: Setting explicit axis titles with the required { text: string } format
              xaxis: { title: { text: datasets[selectedIndex].headers[0] || 'X-Axis' } },
              yaxis: { title: { text: 'Data Value' } } 
            }}
          />

          {/* AI Insights Stub */}
          <div className="mt-4 p-4 border bg-white">
            <h2 className="font-bold mb-2">AI Insights (coming soon)</h2>
            <p>This section will analyze your dataset and provide suggestions on graph types, highlight peaks, or summarize patterns automatically.</p>
          </div>
        </>
      )}
    </main>
  );
}