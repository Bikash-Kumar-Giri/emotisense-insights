import { EmotionResult, EMOTION_CONFIG, EmotionType } from '@/lib/types';
import { generateReport } from '@/lib/emotionEngine';
import { Download, Clock, Brain, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  result: EmotionResult | null;
  isAnalyzing: boolean;
}

const emotionBarColors: Record<EmotionType, string> = {
  happy: 'bg-emotion-happy',
  sad: 'bg-emotion-sad',
  angry: 'bg-emotion-angry',
  neutral: 'bg-emotion-neutral',
  anxious: 'bg-emotion-anxious',
};

function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        <Brain className="absolute inset-0 m-auto w-7 h-7 text-primary animate-pulse" />
      </div>
      <p className="text-sm text-muted-foreground font-mono">Analyzing facial features...</p>
    </motion.div>
  );
}

export function EmotionDashboard({ result, isAnalyzing }: Props) {
  const downloadReport = () => {
    if (!result) return;
    const text = generateReport(result);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotion-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary font-mono tracking-wider uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Analysis Results
        </h3>
        {result && (
          <button
            onClick={downloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Report
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <LoadingOverlay key="loading" />
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Primary emotion */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
              <span className="text-4xl">{EMOTION_CONFIG[result.detectedEmotion].emoji}</span>
              <div>
                <p className="text-xl font-bold text-foreground">{EMOTION_CONFIG[result.detectedEmotion].label}</p>
                <p className="text-sm text-muted-foreground">Confidence: <span className="text-primary font-mono font-semibold">{result.confidenceLevel}%</span></p>
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono">{result.timestamp}</span>
            </div>

            {/* Scores */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Emotion Scores</p>
              {result.emotionScores.map((s) => (
                <div key={s.emotion} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span>{EMOTION_CONFIG[s.emotion].emoji}</span>
                      <span className="font-medium text-foreground/80">{EMOTION_CONFIG[s.emotion].label}</span>
                    </span>
                    <span className="font-mono text-muted-foreground">{s.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`h-full rounded-full ${emotionBarColors[s.emotion]}`}
                    />
                  </div>
                  {s.emotion === result.detectedEmotion && s.reasons.length > 0 && (
                    <ul className="pl-5 space-y-0.5">
                      {s.reasons.map((r, i) => (
                        <li key={i} className="text-[11px] text-muted-foreground list-disc">{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Feature summary */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Detected Features</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Eyes', value: result.facialFeaturesDetected.eyeState },
                  { label: 'Mouth', value: result.facialFeaturesDetected.mouthShape },
                  { label: 'Brows', value: result.facialFeaturesDetected.eyebrowPosition },
                ].map((f) => (
                  <div key={f.label} className="text-center p-2 rounded-md bg-secondary/60 border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase">{f.label}</p>
                    <p className="text-xs font-medium text-foreground mt-0.5 capitalize">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3"
          >
            <Brain className="w-10 h-10 text-primary/30" />
            <p className="text-sm">Adjust facial features and run analysis</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
