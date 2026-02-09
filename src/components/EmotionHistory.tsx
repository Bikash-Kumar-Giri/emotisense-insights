import { EmotionResult, EMOTION_CONFIG } from '@/lib/types';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Props {
  history: EmotionResult[];
}

const chartConfig: ChartConfig = {
  happy: { label: 'Happy', color: 'hsl(var(--emotion-happy))' },
  sad: { label: 'Sad', color: 'hsl(var(--emotion-sad))' },
  angry: { label: 'Angry', color: 'hsl(var(--emotion-angry))' },
  neutral: { label: 'Neutral', color: 'hsl(var(--emotion-neutral))' },
  anxious: { label: 'Anxious', color: 'hsl(var(--emotion-anxious))' },
};

export function EmotionHistory({ history }: Props) {
  if (history.length === 0) return null;

  const data = history.map((r, i) => {
    const entry: Record<string, unknown> = { index: `#${i + 1}`, time: r.timestamp };
    r.emotionScores.forEach((s) => { entry[s.emotion] = s.score; });
    return entry;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 space-y-4"
    >
      <h3 className="text-sm font-semibold text-primary font-mono tracking-wider uppercase flex items-center gap-2">
        <History className="w-4 h-4" /> Session History ({history.length})
      </h3>

      {/* Recent emotions */}
      <div className="flex gap-2 flex-wrap">
        {history.map((r, i) => (
          <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/60 border border-border text-xs">
            <span>{EMOTION_CONFIG[r.detectedEmotion].emoji}</span>
            <span className="font-mono text-muted-foreground">{r.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      {history.length >= 2 && (
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="index" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="happy" fill="var(--color-happy)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="sad" fill="var(--color-sad)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="angry" fill="var(--color-angry)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="neutral" fill="var(--color-neutral)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="anxious" fill="var(--color-anxious)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      )}
    </motion.div>
  );
}
