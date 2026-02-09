import { FacialFeatures } from '@/lib/types';
import { motion } from 'framer-motion';

interface Props {
  features: FacialFeatures;
}

export function AnimatedFace({ features }: Props) {
  // Eye shapes
  const eyeHeight = features.eyeState === 'open' ? 14 : features.eyeState === 'relaxed' ? 8 : 10;
  const eyeRy = features.eyeState === 'open' ? 7 : features.eyeState === 'relaxed' ? 4 : 5;
  const pupilR = features.eyeState === 'tense' ? 3.5 : 3;

  // Eyebrow Y offset
  const browY = features.eyebrowPosition === 'raised' ? -6 : features.eyebrowPosition === 'furrowed' ? 2 : 0;
  const browAngle = features.eyebrowPosition === 'furrowed' ? 8 : features.eyebrowPosition === 'raised' ? -4 : 0;

  // Mouth path
  const getMouthPath = () => {
    if (features.mouthShape === 'smile') return 'M 35 72 Q 50 85 65 72';
    if (features.mouthShape === 'frown') return 'M 35 78 Q 50 68 65 78';
    return 'M 37 75 L 63 75';
  };

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-32 h-32" aria-label="Animated face">
        {/* Face */}
        <motion.circle
          cx={50} cy={50} r={42}
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Left eyebrow */}
        <motion.line
          x1={30} y1={30} x2={42} y2={30}
          stroke="hsl(var(--foreground))"
          strokeWidth={2.5}
          strokeLinecap="round"
          animate={{
            y1: 30 + browY,
            y2: 30 + browY + browAngle * 0.15,
            x1: 30,
            x2: 42,
          }}
          transition={{ type: 'spring', stiffness: 200 }}
        />

        {/* Right eyebrow */}
        <motion.line
          x1={58} y1={30} x2={70} y2={30}
          stroke="hsl(var(--foreground))"
          strokeWidth={2.5}
          strokeLinecap="round"
          animate={{
            y1: 30 + browY + browAngle * 0.15,
            y2: 30 + browY,
            x1: 58,
            x2: 70,
          }}
          transition={{ type: 'spring', stiffness: 200 }}
        />

        {/* Left eye */}
        <motion.ellipse
          cx={36} cy={42}
          rx={7}
          fill="hsl(var(--background))"
          stroke="hsl(var(--foreground))"
          strokeWidth={1.5}
          animate={{ ry: eyeRy }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <motion.circle
          cx={36} cy={42}
          fill="hsl(var(--foreground))"
          animate={{ r: pupilR }}
          transition={{ type: 'spring', stiffness: 300 }}
        />

        {/* Right eye */}
        <motion.ellipse
          cx={64} cy={42}
          rx={7}
          fill="hsl(var(--background))"
          stroke="hsl(var(--foreground))"
          strokeWidth={1.5}
          animate={{ ry: eyeRy }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <motion.circle
          cx={64} cy={42}
          fill="hsl(var(--foreground))"
          animate={{ r: pupilR }}
          transition={{ type: 'spring', stiffness: 300 }}
        />

        {/* Mouth */}
        <motion.path
          d={getMouthPath()}
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={false}
          animate={{ d: getMouthPath() }}
          transition={{ type: 'spring', stiffness: 200 }}
        />
      </svg>
    </div>
  );
}
