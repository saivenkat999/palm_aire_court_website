import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface GalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function Gallery({ images, alt, className = "" }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  // Mobile carousel view
  if (isMobile) {
    return (
      <div className={`relative ${className}`} data-testid="gallery-carousel">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <img
            src={images[currentIndex]}
            alt={`${alt} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                onClick={prevImage}
                data-testid="gallery-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={nextImage}
                data-testid="gallery-next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    data-testid={`gallery-dot-${index}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Desktop grid view
  return (
    <div className={`grid gap-4 ${className}`} data-testid="gallery-grid">
      {images.length >= 1 && (
        <div className="col-span-2 row-span-2">
          <img
            src={images[0]}
            alt={`${alt} - Main image`}
            className="w-full h-64 object-cover rounded-lg"
            data-testid="gallery-main-image"
          />
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        {images.slice(1, 4).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${alt} - Image ${index + 2}`}
            className="w-full h-32 object-cover rounded-lg"
            data-testid={`gallery-thumb-${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
