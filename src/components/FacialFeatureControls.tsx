import { FacialFeatures, EyeState, MouthShape, EyebrowPosition } from '@/lib/types';
import { Eye, Smile, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  features: FacialFeatures;
  onChange: (features: FacialFeatures) => void;
}

const eyeOptions: { value: EyeState; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'tense', label: 'Tense' },
];

const mouthOptions: { value: MouthShape; label: string }[] = [
  { value: 'smile', label: 'Smile' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'frown', label: 'Frown' },
];

const eyebrowOptions: { value: EyebrowPosition; label: string }[] = [
  { value: 'raised', label: 'Raised' },
  { value: 'normal', label: 'Normal' },
  { value: 'furrowed', label: 'Furrowed' },
];

function FeatureSelector<T extends string>({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
        <Icon className="w-4 h-4 text-primary" />
        {label}
      </div>
      <div className="flex gap-2">
        {options.map((opt) => (
          <motion.button
            key={opt.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              value === opt.value
                ? 'bg-primary text-primary-foreground glow-primary'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
            }`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function FacialFeatureControls({ features, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 space-y-5"
    >
      <h3 className="text-sm font-semibold text-primary font-mono tracking-wider uppercase">
        Facial Feature Parameters
      </h3>

      <FeatureSelector
        label="Eye State"
        icon={Eye}
        options={eyeOptions}
        value={features.eyeState}
        onChange={(v) => onChange({ ...features, eyeState: v })}
      />

      <FeatureSelector
        label="Mouth Shape"
        icon={Smile}
        options={mouthOptions}
        value={features.mouthShape}
        onChange={(v) => onChange({ ...features, mouthShape: v })}
      />

      <FeatureSelector
        label="Eyebrow Position"
        icon={ArrowUp}
        options={eyebrowOptions}
        value={features.eyebrowPosition}
        onChange={(v) => onChange({ ...features, eyebrowPosition: v })}
      />
    </motion.div>
  );
}
