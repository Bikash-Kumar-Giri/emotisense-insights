import { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ImageUploadInput() {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden bg-secondary border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => !preview && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <AnimatePresence>
          {preview ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
              <img src={preview} alt="Uploaded face" className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none border-2 border-primary/30 rounded-lg" />
              <button onClick={(e) => { e.stopPropagation(); clear(); }} className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 hover:bg-destructive/30 text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <div className="p-4 rounded-full bg-primary/10">
                <Image className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground/80">Drop image here or click to upload</p>
                <p className="text-xs mt-1">JPEG, PNG, WebP</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!preview && (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 transition-all"
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </button>
      )}
      <p className="text-xs text-muted-foreground text-center max-w-sm">
        Image is processed in-browser and discarded after analysis.
      </p>
    </div>
  );
}
