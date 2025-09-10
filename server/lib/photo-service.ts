/**
 * Photo Service for managing unit images
 * Maps unit types to their respective photo directories and selects appropriate images
 */

export interface PhotoMapping {
  unitType: string;
  photos: string[];
}

export class PhotoService {
  // Available photos in 1BHK folder
  private static readonly COTTAGE_1BR_PHOTOS = [
    '/assets/1BHK/1.avif',
    '/assets/1BHK/2.avif',
    '/assets/1BHK/3.jpeg',
    '/assets/1BHK/4.avif',
    '/assets/1BHK/5.jpeg',
    '/assets/1BHK/6.jpeg',
    '/assets/1BHK/7.jpeg',
    '/assets/1BHK/8.jpeg',
    '/assets/1BHK/9.avif',
    '/assets/1BHK/10.webp',
    '/assets/1BHK/11.jpeg'
  ];

  // Available photos in 2BHK folder
  private static readonly COTTAGE_2BR_PHOTOS = [
    '/assets/2BHK/1.jpeg',
    '/assets/2BHK/2.avif',
    '/assets/2BHK/3.jpeg',
    '/assets/2BHK/4.jpeg',
    '/assets/2BHK/5.jpeg',
    '/assets/2BHK/6.avif',
    '/assets/2BHK/7.jpeg',
    '/assets/2BHK/8.jpeg',
    '/assets/2BHK/9.jpeg'
  ];

  // Available photos in Trailer folder
  private static readonly TRAILER_PHOTOS = [
    '/assets/Trailer/3FA299C7-A4A6-4626-B68F-CD12E1B57BFF (1).jpg',
    '/assets/Trailer/IMG_7832.jpg',
    '/assets/Trailer/Personal RV.jpg',
    '/assets/Trailer/WhatsApp Image 2025-08-27 at 09.09.37_a3e709a8.jpg'
  ];

  /**
   * Get photos for a specific unit based on its type and individual assignment
   * @param unitSlug - The unit slug (e.g., 'cottage-9606')
   * @param unitType - The unit type (e.g., 'COTTAGE_1BR', 'COTTAGE_2BR', 'TRAILER')
   * @returns Array of photo paths
   */
  static getPhotosForUnit(unitSlug: string, unitType: string): string[] {
    // For enhanced gallery experience, return ALL photos for the unit type
    // This enables the Airbnb-style photo browsing with hero image + thumbnail carousel
    
    switch (unitType) {
      case 'COTTAGE_1BR':
        return this.COTTAGE_1BR_PHOTOS; // Return ALL 11 photos
      case 'COTTAGE_2BR':
        return this.COTTAGE_2BR_PHOTOS; // Return ALL 9 photos
      case 'TRAILER':
        return this.TRAILER_PHOTOS; // Return ALL 4 photos
      default:
        return ['/assets/Logo.png']; // Fallback
    }
  }

  /**
   * Get photos based on unit type
   * @param unitType - The unit type
   * @returns Array of photo paths
   */
  static getPhotosByType(unitType: string): string[] {
    switch (unitType) {
      case 'COTTAGE_1BR':
        return this.COTTAGE_1BR_PHOTOS; // Return ALL photos for gallery
      case 'COTTAGE_2BR':
        return this.COTTAGE_2BR_PHOTOS; // Return ALL photos for gallery
      case 'TRAILER':
        return this.TRAILER_PHOTOS;
      default:
        return ['/assets/Logo.png']; // Fallback
    }
  }

  /**
   * Get a primary photo for unit card display
   * @param unitSlug - The unit slug
   * @param unitType - The unit type
   * @returns Primary photo path
   */
  static getPrimaryPhoto(unitSlug: string, unitType: string): string {
    const photos = this.getPhotosForUnit(unitSlug, unitType);
    return photos[0] || '/assets/Logo.png';
  }

  /**
   * Get all available photos for a unit type (for admin or management purposes)
   * @param unitType - The unit type
   * @returns All available photos for the type
   */
  static getAllPhotosByType(unitType: string): string[] {
    switch (unitType) {
      case 'COTTAGE_1BR':
        return this.COTTAGE_1BR_PHOTOS;
      case 'COTTAGE_2BR':
        return this.COTTAGE_2BR_PHOTOS;
      case 'TRAILER':
        return this.TRAILER_PHOTOS;
      default:
        return [];
    }
  }

  /**
   * Validate if a photo path exists in our available photos
   * @param photoPath - The photo path to validate
   * @returns Boolean indicating if photo exists
   */
  static isValidPhotoPath(photoPath: string): boolean {
    const allPhotos = [
      ...this.COTTAGE_1BR_PHOTOS,
      ...this.COTTAGE_2BR_PHOTOS,
      ...this.TRAILER_PHOTOS
    ];
    return allPhotos.includes(photoPath);
  }
}
