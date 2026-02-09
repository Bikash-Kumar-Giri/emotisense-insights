import { useState, useCallback } from 'react';
import { Camera, ImageIcon, Scan, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WebcamInput } from '@/components/WebcamInput';
import { ImageUploadInput } from '@/components/ImageUploadInput';
import { FacialFeatureControls } from '@/components/FacialFeatureControls';
import { EmotionDashboard } from '@/components/EmotionDashboard';
import { EmotionHistory } from '@/components/EmotionHistory';
import { AnimatedFace } from '@/components/AnimatedFace';
import { ThemeToggle } from '@/components/ThemeToggle';
import { analyzeEmotion } from '@/lib/emotionEngine';
import { FacialFeatures, InputMode, EmotionResult } from '@/lib/types';

const Index = () => {
  const [mode, setMode] = useState<InputMode>('webcam');
  const [features, setFeatures] = useState<FacialFeatures>({
    eyeState: 'open',
    mouthShape: 'neutral',
    eyebrowPosition: 'normal',
  });
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<EmotionResult[]>([]);

  const runAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const res = analyzeEmotion(features);
      setResult(res);
      setHistory((prev) => [...prev, res]);
      setIsAnalyzing(false);
    }, 1200);
  }, [features]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/15 glow-primary">
              <Scan className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground glow-text">AI Emotion Detection</h1>
              <p className="text-[11px] text-muted-foreground font-mono">Explainable facial analysis system</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode toggle */}
            <div className="flex items-center bg-secondary rounded-lg p-1 border border-border">
              {([
                { id: 'webcam' as InputMode, label: 'Webcam', icon: Camera },
                { id: 'upload' as InputMode, label: 'Upload', icon: ImageIcon },
              ]).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    mode === m.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <m.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column — input + controls */}
          <div className="space-y-6">
            {/* Input panel */}
            <motion.div layout className="glass rounded-xl p-5">
              <h2 className="text-sm font-semibold text-primary font-mono tracking-wider uppercase mb-4">
                {mode === 'webcam' ? 'Live Webcam Feed' : 'Image Upload'}
              </h2>
              <AnimatePresence mode="wait">
                {mode === 'webcam' ? (
                  <motion.div key="webcam" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <WebcamInput />
                  </motion.div>
                ) : (
                  <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <ImageUploadInput />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Animated face preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-primary font-mono tracking-wider uppercase mb-3">
                Feature Preview
              </h3>
              <AnimatedFace features={features} />
            </motion.div>

            {/* Feature controls */}
            <FacialFeatureControls features={features} onChange={setFeatures} />

            {/* Analyze button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-primary text-primary-foreground glow-primary hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Scan className="w-4 h-4" />
              {isAnalyzing ? 'Analyzing...' : 'Run Emotion Analysis'}
            </motion.button>
          </div>

          {/* Right column — results + history */}
          <div className="space-y-6">
            <EmotionDashboard result={result} isAnalyzing={isAnalyzing} />
            <EmotionHistory history={history} />
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass rounded-xl p-4 flex items-start gap-3 max-w-3xl mx-auto"
        >
          <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground/80">Disclaimer:</span>{' '}
            This system provides facial emotion insights for educational and awareness purposes only. It is not intended for psychological diagnosis or clinical use. No facial images or video data are stored or transmitted.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
