import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './optimized-image';

interface EnhancedPhotoGalleryProps {
  photos: string[];
  unitName: string;
  className?: string;
}

export function EnhancedPhotoGallery({ photos, unitName, className = '' }: EnhancedPhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance to trigger navigation
  const minSwipeDistance = 50;

  // Touch handlers for swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedPhotoIndex(index);
    scrollThumbnailIntoView(index);
  };

  // Scroll selected thumbnail into view
  const scrollThumbnailIntoView = (index: number) => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const thumbnail = container.children[index] as HTMLElement;
      
      if (thumbnail) {
        const containerRect = container.getBoundingClientRect();
        const thumbnailRect = thumbnail.getBoundingClientRect();
        
        if (thumbnailRect.left < containerRect.left) {
          container.scrollLeft -= containerRect.left - thumbnailRect.left + 16;
        } else if (thumbnailRect.right > containerRect.right) {
          container.scrollLeft += thumbnailRect.right - containerRect.right + 16;
        }
      }
    }
  };

  // Navigation handlers
  const handlePrevious = () => {
    const newIndex = selectedPhotoIndex > 0 ? selectedPhotoIndex - 1 : photos.length - 1;
    handleThumbnailClick(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedPhotoIndex < photos.length - 1 ? selectedPhotoIndex + 1 : 0;
    handleThumbnailClick(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPhotoIndex]);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No photos available</span>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Hero Image Section */}
      <div className="relative group mb-4">
        <div 
          className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <OptimizedImage
            src={photos[selectedPhotoIndex]}
            alt={`${unitName} - Photo ${selectedPhotoIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}
        
        {/* Photo Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {selectedPhotoIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Thumbnail Carousel */}
      {photos.length > 1 && (
        <div className="relative">
          <div
            ref={thumbnailContainerRef}
            className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === selectedPhotoIndex
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={`View photo ${index + 1}`}
              >
                <OptimizedImage
                  src={photo}
                  alt={`${unitName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          
          {/* Scroll Fade Indicators */}
          <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}
