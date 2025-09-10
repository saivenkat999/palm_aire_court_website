import { EnhancedPhotoGallery } from './enhanced-photo-gallery';

interface GalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function Gallery({ images, alt, className = "" }: GalleryProps) {
  return (
    <EnhancedPhotoGallery
      photos={images}
      unitName={alt}
      className={className}
    />
  );
}
