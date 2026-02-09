export type EmotionType = 'happy' | 'sad' | 'angry' | 'neutral' | 'anxious';

export type EyeState = 'open' | 'relaxed' | 'tense';
export type MouthShape = 'smile' | 'neutral' | 'frown';
export type EyebrowPosition = 'raised' | 'normal' | 'furrowed';

export interface FacialFeatures {
  eyeState: EyeState;
  mouthShape: MouthShape;
  eyebrowPosition: EyebrowPosition;
}

export interface EmotionScore {
  emotion: EmotionType;
  score: number;
  reasons: string[];
}

export interface EmotionResult {
  detectedEmotion: EmotionType;
  confidenceLevel: number;
  facialFeaturesDetected: FacialFeatures;
  emotionScores: EmotionScore[];
  timestamp: string;
}

export type InputMode = 'webcam' | 'upload';

export const EMOTION_CONFIG: Record<EmotionType, { emoji: string; label: string; color: string }> = {
  happy: { emoji: '😊', label: 'Happy', color: 'emotion-happy' },
  sad: { emoji: '😢', label: 'Sad', color: 'emotion-sad' },
  angry: { emoji: '😠', label: 'Angry', color: 'emotion-angry' },
  neutral: { emoji: '😐', label: 'Neutral', color: 'emotion-neutral' },
  anxious: { emoji: '😰', label: 'Anxious', color: 'emotion-anxious' },
};
