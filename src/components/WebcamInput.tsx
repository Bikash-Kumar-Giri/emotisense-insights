import { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WebcamInput() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
    } catch {
      setError('Unable to access webcam. Please grant camera permissions.');
    }
  }, []);

  const stopWebcam = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsActive(false);
  }, []);

  useEffect(() => () => { streamRef.current?.getTracks().forEach(t => t.stop()); }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden bg-secondary border border-border">
        <AnimatePresence>
          {isActive ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none border-2 border-primary/30 rounded-lg" />
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                <div className="scan-line w-full h-1/3" />
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse-glow" />
                <span className="text-xs font-mono text-foreground/80">LIVE</span>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <CameraOff className="w-12 h-12" />
              <p className="text-sm">Camera inactive</p>
            </motion.div>
          )}
        </AnimatePresence>
        {error && (
          <div className="absolute bottom-3 left-3 right-3 bg-destructive/20 border border-destructive/40 rounded-md p-2">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}
      </div>

      <button
        onClick={isActive ? stopWebcam : startWebcam}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
          isActive
            ? 'bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30'
            : 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 glow-primary'
        }`}
      >
        {isActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
        {isActive ? 'Stop Camera' : 'Start Camera'}
      </button>
      <p className="text-xs text-muted-foreground text-center max-w-sm">
        Video is processed locally. No frames are stored or transmitted.
      </p>
    </div>
  );
}
