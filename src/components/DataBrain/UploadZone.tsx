import React, { useState } from 'react';
import { Upload, FileText, Database, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseFile, AnalysisResult } from '@/lib/data-utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface UploadZoneProps {
  onDataLoaded: (data: AnalysisResult) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      toast.error('Invalid file format. Please upload CSV or JSON.');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate progress for "AI Thinking" vibe
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await parseFile(file);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onDataLoaded(result);
        setIsProcessing(false);
        toast.success(`Successfully analyzed ${file.name}`);
      }, 500);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast.error('Failed to process data brain ingestion.');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/0886198e-96ec-4280-82b6-a986c56b2af3/data-brain-hero-ai-f35eb2bf-1782797975061.webp" 
               alt="Neural Data Brain" 
               className="w-32 h-32 rounded-full border-2 border-purple-500/30 shadow-[0_0_50px_rgba(124,58,237,0.3)] object-cover" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Feed the Brain
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Drop your dataset (CSV, JSON) into the neural engine. 
          Our AI instantly cleans, analyzes, and deciphers hidden intelligence.
        </p>
      </motion.div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative group cursor-pointer transition-all duration-500 rounded-3xl border-2 border-dashed ${
          isDragging ? 'border-cyan-500 bg-cyan-500/5' : 'border-purple-500/20 bg-zinc-900/50 hover:border-purple-500/40'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-3xl pointer-events-none" />
        
        <div className="p-12 md:p-24 flex flex-col items-center justify-center text-center relative z-10">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-32 h-32 mb-8">
                  <svg className="w-full h-full rotate-[-90deg]">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-zinc-800"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="377"
                      initial={{ strokeDashoffset: 377 }}
                      animate={{ strokeDashoffset: 377 - (377 * uploadProgress) / 100 }}
                      className="text-purple-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Database className="w-10 h-10 text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2 italic">Synthesizing Neural Patterns...</h3>
                <p className="text-zinc-400">Normalizing data structures and detecting anomalies</p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Upload className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Initialize Data Stream</h3>
                <p className="text-zinc-400 mb-8">Click to browse or drag & drop files</p>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".csv,.json"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <Button 
                  asChild
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 h-auto text-lg"
                >
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Select Dataset
                  </label>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Database className="w-5 h-5 text-purple-400" />, title: "Auto-Standardize", desc: "Formats dates, currencies, and strings instantly." },
          { icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" />, title: "Smart Cleaning", desc: "Detects missing values and fixes structural errors." },
          { icon: <AlertCircle className="w-5 h-5 text-amber-400" />, title: "Anomaly Scan", desc: "Finds outliers and patterns in seconds." },
        ].map((feat, i) => (
          <Card key={i} className="bg-zinc-900/30 border-zinc-800 p-6 rounded-2xl hover:bg-zinc-900/50 transition-colors">
            <div className="mb-4">{feat.icon}</div>
            <h4 className="font-semibold text-white mb-1">{feat.title}</h4>
            <p className="text-sm text-zinc-500">{feat.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
