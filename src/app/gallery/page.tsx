'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Maximize2, Image as ImageIcon } from 'lucide-react';
import { decodeImagesParam } from '@/utils/url';
import Lightbox from '@/components/Lightbox';
import styles from './page.module.css';

function GalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawImages = searchParams.get('images');
  const initialIndexParam = searchParams.get('index');

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const hasAutoOpenedSingleImageRef = useRef(false);

  // Decode images list from URL query
  useEffect(() => {
    if (rawImages) {
      const decoded = decodeImagesParam(rawImages);
      setImages(decoded);
    } else {
      setImages([]);
    }
    setLoading(false);
  }, [rawImages]);

  // Open lightbox automatically when the gallery has a single image, or when an index is specified in the URL query
  useEffect(() => {
    if (images.length === 0) {
      return;
    }

    if (initialIndexParam !== null) {
      const index = parseInt(initialIndexParam, 10);
      if (!isNaN(index) && index >= 0 && index < images.length) {
        setLightboxIndex(index);
      }
      return;
    }

    if (images.length === 1 && !hasAutoOpenedSingleImageRef.current) {
      hasAutoOpenedSingleImageRef.current = true;
      setLightboxIndex(0);
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('index', '0');
      window.history.replaceState({}, '', currentUrl.toString());
    }
  }, [images, initialIndexParam]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    // Update the URL to include the index for bookmarking/sharing, but don't reload
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('index', index.toString());
    window.history.replaceState({}, '', currentUrl.toString());
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
    // Remove index from URL query
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('index');
    window.history.replaceState({}, '', currentUrl.toString());
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Loading gallery...</span>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <ImageIcon size={48} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>No Images Found</h2>
          <p className={styles.emptyText}>
            No image parameters were detected. Create a new image layout in the dashboard.
          </p>
          <button className={styles.backBtn} onClick={handleGoBack}>
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backLink} onClick={handleGoBack} title="Go back to the previous page">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div className={styles.divider} />
          <div className={styles.titleInfo}>
            <h1 className={styles.title}>Better Gallery</h1>
            <span className={styles.countBadge}>
              {images.length} {images.length === 1 ? 'image' : 'images'}
            </span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.logo}>BETTER MARKDOWN</span>
        </div>
      </header>

      {/* Masonry / Grid Layout */}
      <main className={styles.main}>
        <div className={styles.grid}>
          {images.map((url, i) => (
            <div 
              key={i} 
              className={styles.card}
              onClick={() => handleOpenLightbox(i)}
            >
              <div className={styles.imageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={url} 
                  alt={`Gallery image ${i + 1}`} 
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.overlay}>
                  <div className={styles.expandIcon}>
                    <Maximize2 size={16} />
                  </div>
                  <span className={styles.indexTag}>{i + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Powered by <a href="/" className={styles.footerLink}>Better Markdown</a> badge system.
        </p>
      </footer>

      {/* Lightbox Trigger */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={handleCloseLightbox}
        />
      )}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <span className={styles.loadingText}>Initializing Gallery...</span>
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}
