/**
 * ImageGallery — Element image gallery section.
 *
 * Displays sample photographs, spectral images, and 2D Bohr models
 * with proper fallback to remote URLs if local assets fail.
 */
import React from 'react';
import type { Element } from '@/types/Element';

interface ImageGalleryProps {
  element: Element;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ element }) => {
  return (
    <section className="element-section element-image-section">
      <h2>
        <span className="section-icon">📷</span> Image Gallery
      </h2>
      <div className="image-gallery-grid">
        {/* Sample photograph */}
        {element.image && (element.image.local_url || element.image.url) && (
          <div>
            <h3 className="gallery-subtitle">Sample Image</h3>
            <img
              src={element.image.local_url || element.image.url}
              alt={element.image.title || `${element.name} sample`}
              loading="lazy"
              onError={(e) => {
                if (element.image) {
                  (e.target as HTMLImageElement).src = element.image.url;
                }
              }}
              className="gallery-image"
            />
            {element.image.title && (
              <p className="gallery-image-title">{element.image.title}</p>
            )}
            <p className="image-attribution">{element.image.attribution}</p>
          </div>
        )}

        {/* Emission / absorption spectrum */}
        {(element.local_spectral_img || element.spectral_img) && (
          <div>
            <h3 className="gallery-subtitle">Spectral Image</h3>
            <img
              src={element.local_spectral_img || element.spectral_img!}
              alt={`${element.name} spectrum`}
              loading="lazy"
              onError={(e) => {
                if (element.spectral_img) {
                  (e.target as HTMLImageElement).src = element.spectral_img;
                }
              }}
              className="gallery-image"
            />
          </div>
        )}

        {/* 2D Bohr model diagram */}
        {(element.local_bohr_model_image || element.bohr_model_image) && (
          <div>
            <h3 className="gallery-subtitle">Bohr Model (2D)</h3>
            <div className="bohr-2d-container">
              <img
                src={element.local_bohr_model_image || element.bohr_model_image!}
                alt={`${element.name} 2D Bohr model`}
                loading="lazy"
                onError={(e) => {
                  if (element.bohr_model_image) {
                    (e.target as HTMLImageElement).src = element.bohr_model_image;
                  }
                }}
                className="bohr-2d-image"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(ImageGallery);
