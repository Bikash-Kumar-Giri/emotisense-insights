import { FacialFeatures, EmotionScore, EmotionResult, EmotionType } from './types';

function calculateEmotionScores(features: FacialFeatures): EmotionScore[] {
  const scores: EmotionScore[] = [
    { emotion: 'happy', score: 0, reasons: [] },
    { emotion: 'sad', score: 0, reasons: [] },
    { emotion: 'angry', score: 0, reasons: [] },
    { emotion: 'neutral', score: 0, reasons: [] },
    { emotion: 'anxious', score: 0, reasons: [] },
  ];

  const get = (e: EmotionType) => scores.find(s => s.emotion === e)!;

  // Happy rules
  if (features.mouthShape === 'smile') { get('happy').score += 45; get('happy').reasons.push('Smiling mouth detected'); }
  if (features.eyeState === 'relaxed') { get('happy').score += 25; get('happy').reasons.push('Relaxed eyes indicate comfort'); }
  if (features.eyebrowPosition === 'raised') { get('happy').score += 15; get('happy').reasons.push('Raised eyebrows suggest positive surprise'); }
  if (features.eyeState === 'open' && features.mouthShape === 'smile') { get('happy').score += 10; get('happy').reasons.push('Open eyes with smile show engagement'); }

  // Sad rules
  if (features.mouthShape === 'frown') { get('sad').score += 45; get('sad').reasons.push('Frowning mouth detected'); }
  if (features.eyeState === 'relaxed' && features.mouthShape === 'frown') { get('sad').score += 20; get('sad').reasons.push('Droopy eyes with frown suggest sadness'); }
  if (features.eyebrowPosition === 'normal' && features.mouthShape === 'frown') { get('sad').score += 15; get('sad').reasons.push('Neutral brows with frown indicate melancholy'); }

  // Angry rules
  if (features.eyebrowPosition === 'furrowed') { get('angry').score += 35; get('angry').reasons.push('Furrowed eyebrows indicate tension'); }
  if (features.eyeState === 'tense') { get('angry').score += 30; get('angry').reasons.push('Tense eyes suggest frustration'); }
  if (features.mouthShape === 'frown' && features.eyebrowPosition === 'furrowed') { get('angry').score += 20; get('angry').reasons.push('Frown with furrowed brows is a strong anger signal'); }

  // Neutral rules
  if (features.mouthShape === 'neutral') { get('neutral').score += 35; get('neutral').reasons.push('Neutral mouth position'); }
  if (features.eyebrowPosition === 'normal') { get('neutral').score += 30; get('neutral').reasons.push('Normal eyebrow position'); }
  if (features.eyeState === 'open' && features.mouthShape === 'neutral') { get('neutral').score += 15; get('neutral').reasons.push('Open eyes with neutral expression'); }

  // Anxious rules
  if (features.eyeState === 'tense') { get('anxious').score += 30; get('anxious').reasons.push('Tense eyes suggest worry'); }
  if (features.eyebrowPosition === 'raised' && features.eyeState === 'tense') { get('anxious').score += 25; get('anxious').reasons.push('Raised brows with tense eyes indicate anxiety'); }
  if (features.eyebrowPosition === 'furrowed' && features.mouthShape === 'neutral') { get('anxious').score += 20; get('anxious').reasons.push('Furrowed brows with closed mouth suggest unease'); }
  if (features.eyeState === 'open' && features.eyebrowPosition === 'raised') { get('anxious').score += 15; get('anxious').reasons.push('Wide open eyes with raised brows show alertness'); }

  // Ensure minimum scores and add default reasons
  scores.forEach(s => {
    if (s.score === 0) { s.score = 5; s.reasons.push('Minimal feature match'); }
  });

  // Normalize to 100%
  const total = scores.reduce((sum, s) => sum + s.score, 0);
  scores.forEach(s => { s.score = Math.round((s.score / total) * 100); });

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  return scores;
}

export function analyzeEmotion(features: FacialFeatures): EmotionResult {
  const emotionScores = calculateEmotionScores(features);
  const top = emotionScores[0];

  return {
    detectedEmotion: top.emotion,
    confidenceLevel: top.score,
    facialFeaturesDetected: { ...features },
    emotionScores,
    timestamp: new Date().toLocaleTimeString(),
  };
}

export function generateReport(result: EmotionResult): string {
  const lines = [
    '═══════════════════════════════════════',
    '   AI EMOTION DETECTION — ANALYSIS REPORT',
    '═══════════════════════════════════════',
    '',
    `Timestamp: ${result.timestamp}`,
    `Detected Emotion: ${result.detectedEmotion.toUpperCase()}`,
    `Confidence: ${result.confidenceLevel}%`,
    '',
    '--- Facial Features Detected ---',
    `  Eye State: ${result.facialFeaturesDetected.eyeState}`,
    `  Mouth Shape: ${result.facialFeaturesDetected.mouthShape}`,
    `  Eyebrow Position: ${result.facialFeaturesDetected.eyebrowPosition}`,
    '',
    '--- Emotion Scores ---',
    ...result.emotionScores.map(s =>
      `  ${s.emotion.toUpperCase()}: ${s.score}%\n    Reasons: ${s.reasons.join('; ')}`
    ),
    '',
    '--- Disclaimer ---',
    'This system provides facial emotion insights for educational',
    'and awareness purposes only. It is not intended for',
    'psychological diagnosis or clinical use.',
    '',
    '═══════════════════════════════════════',
  ];
  return lines.join('\n');
}
