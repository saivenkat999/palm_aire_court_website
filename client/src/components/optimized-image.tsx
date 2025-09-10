import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string | string[];
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = '/assets/Logo.png' 
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    if (Array.isArray(src)) {
      return src[0] || fallbackSrc;
    }
    return src || fallbackSrc;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Update currentSrc when src prop changes
  useEffect(() => {
    const newSrc = Array.isArray(src) ? src[0] || fallbackSrc : src || fallbackSrc;
    if (newSrc !== currentSrc) {
      setCurrentSrc(newSrc);
      setIsLoading(true);
      setHasError(false);
    }
  }, [src, fallbackSrc]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  if (hasError && currentSrc === fallbackSrc) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Loading...</span>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}
