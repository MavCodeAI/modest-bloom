import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
  path: string;
}

export interface UploadOptions {
  bucket?: string;
  folder?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  transform?: {
    width?: number;
    height?: number;
    quality?: number;
  };
}

export const useFileUpload = (options: UploadOptions = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    bucket = 'product-images',
    folder = 'general',
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    transform
  } = options;

  return useMutation({
    mutationFn: async (file: File): Promise<UploadedFile> => {
      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed`);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        url: publicUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        path: data.path
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] });
      toast({
        title: 'فائل اپ لوڈ ہو گئی',
        description: `${data.name} کامیابی سے اپ لوڈ ہو گئی۔`,
      });
    },
    onError: (error) => {
      toast({
        title: 'اپ لوڈ میں خرابی',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useMultipleFileUpload = (options: UploadOptions = {}) => {
  const singleUpload = useFileUpload(options);
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (files: File[]): Promise<UploadedFile[]> => {
      const uploadPromises = files.map(file => singleUpload.mutateAsync(file));
      return Promise.all(uploadPromises);
    },
    onSuccess: (results) => {
      toast({
        title: 'تمام فائلیں اپ لوڈ ہو گئیں',
        description: `${results.length} فائلیں کامیابی سے اپ لوڈ ہو گئیں۔`,
      });
    },
    onError: (error) => {
      toast({
        title: 'اپ لوڈ میں خرابی',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteFile = (bucket: string = 'product-images') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (path: string): Promise<void> => {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] });
      toast({
        title: 'فائل ڈیلیٹ ہو گئی',
        description: 'فائل کامیابی سے ڈیلیٹ ہو گئی۔',
      });
    },
    onError: (error) => {
      toast({
        title: 'ڈیلیشن میں خرابی',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useProductImageUpload = () => {
  return useFileUpload({
    bucket: 'product-images',
    folder: 'products',
    maxSize: 2 * 1024 * 1024, // 2MB for product images
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    transform: {
      width: 800,
      height: 800,
      quality: 80
    }
  });
};

export const useProductGalleryUpload = () => {
  const multipleUpload = useMultipleFileUpload({
    bucket: 'product-images',
    folder: 'products/gallery',
    maxSize: 2 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  return multipleUpload;
};

export const useCategoryImageUpload = () => {
  return useFileUpload({
    bucket: 'category-images',
    folder: 'categories',
    maxSize: 1 * 1024 * 1024, // 1MB for category images
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    transform: {
      width: 400,
      height: 300,
      quality: 85
    }
  });
};

// Hook for optimizing images before upload
export const useImageOptimizer = () => {
  const optimizeImage = async (file: File, options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}): Promise<File> => {
    const { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  return { optimizeImage };
};

// Hook for managing uploaded files list
export const useUploadedFiles = (bucket: string = 'product-images', folder?: string) => {
  return useMutation({
    mutationFn: async (): Promise<UploadedFile[]> => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || '', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      // Get public URLs for all files
      const filesWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(folder ? `${folder}/${file.name}` : file.name);

          return {
            url: publicUrl,
            name: file.name,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'unknown',
            path: folder ? `${folder}/${file.name}` : file.name
          } as UploadedFile;
        })
      );

      return filesWithUrls;
    },
  });
};
