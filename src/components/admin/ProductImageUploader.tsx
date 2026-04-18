import { useCallback, useState } from 'react';
import { Upload, X, Loader2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const ProductImageUploader = ({ images, onChange }: ProductImageUploaderProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const valid: File[] = [];
      for (const f of files) {
        if (!ALLOWED.includes(f.type)) {
          toast({
            title: 'Invalid file type',
            description: `${f.name} skipped — only JPG, PNG, WEBP, GIF allowed.`,
            variant: 'destructive',
          });
          continue;
        }
        if (f.size > MAX_SIZE) {
          toast({
            title: 'File too large',
            description: `${f.name} skipped — max 5MB.`,
            variant: 'destructive',
          });
          continue;
        }
        valid.push(f);
      }
      if (valid.length === 0) return;

      setUploading(true);
      setProgress({ done: 0, total: valid.length });
      const uploaded: string[] = [];

      for (let i = 0; i < valid.length; i++) {
        const file = valid[i];
        const ext = file.name.split('.').pop();
        const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(path, file, { cacheControl: '3600', upsert: false });

        if (error) {
          toast({
            title: 'Upload failed',
            description: `${file.name}: ${error.message}`,
            variant: 'destructive',
          });
        } else {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(data.path);
          uploaded.push(urlData.publicUrl);
        }
        setProgress({ done: i + 1, total: valid.length });
      }

      if (uploaded.length > 0) {
        onChange([...images, ...uploaded]);
        toast({
          title: 'Images uploaded',
          description: `${uploaded.length} image(s) added successfully.`,
        });
      }

      setUploading(false);
      setProgress({ done: 0, total: 0 });
    },
    [images, onChange, toast]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    uploadFiles(files);
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor="image-upload-input"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/30 hover:bg-muted/50',
          uploading && 'pointer-events-none opacity-60'
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Uploading {progress.done} of {progress.total}...
            </p>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">Drag & drop images here</p>
            <p className="text-xs text-muted-foreground">
              or click to browse — JPG, PNG, WEBP, GIF up to 5MB
            </p>
          </>
        )}
        <input
          id="image-upload-input"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={onFileSelect}
          disabled={uploading}
        />
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
            >
              <img
                src={url}
                alt={`Product ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {idx === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary text-primary-foreground">
                  Main
                </span>
              )}
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7"
                  onClick={() => moveImage(idx, idx - 1)}
                  disabled={idx === 0}
                  title="Move left"
                >
                  <GripVertical className="h-3 w-3 rotate-180" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-7 w-7"
                  onClick={() => removeImage(idx)}
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7"
                  onClick={() => moveImage(idx, idx + 1)}
                  disabled={idx === images.length - 1}
                  title="Move right"
                >
                  <GripVertical className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
