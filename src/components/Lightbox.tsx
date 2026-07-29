'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Pause, Download, Link } from 'lucide-react';
import styles from './Lightbox.module.css';

interface LightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Sync index if initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
  }, [initialIndex]);

  // Navigate functions
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoom(1);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoom(1);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  // Slideshow Logic
  useEffect(() => {
    if (isPlaying) {
      slideshowTimerRef.current = setInterval(() => {
        handleNext();
      }, 4000); // 4 seconds per slide
    } else {
      if (slideshowTimerRef.current) {
        clearInterval(slideshowTimerRef.current);
      }
    }

    return () => {
      if (slideshowTimerRef.current) {
        clearInterval(slideshowTimerRef.current);
      }
    };
  }, [isPlaying, handleNext]);

  // Toast notifier
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Zoom control
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleZoomReset = () => setZoom(1);

  // Copy link
  const handleShare = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('index', currentIndex.toString());
    navigator.clipboard.writeText(currentUrl.toString());
    triggerToast('Share link copied to clipboard');
  };

  // Download image
  const handleDownload = async () => {
    try {
      const url = images[currentIndex];
      const filename = url.substring(url.lastIndexOf('/') + 1) || `image-${currentIndex}.png`;
      
      triggerToast('Starting download...');
      
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error(e);
      triggerToast('Download failed. Right-click image to save.');
    }
  };

  // Swipe Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diffX = touchStartXRef.current - touchEndXRef.current;
    const threshold = 50; // minimum distance

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    // Reset values
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* Slideshow Progress Bar */}
      {isPlaying && <div className={styles.progressBar} key={currentIndex} />}

      {/* Toolbar */}
      <div className={styles.toolbar} onClick={(e) => e.stopPropagation()}>
        <div className={styles.counter}>
          {currentIndex + 1} <span className={styles.slash}>/</span> {images.length}
        </div>
        <div className={styles.tools}>
          <button className={styles.toolBtn} onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button className={styles.toolBtn} onClick={handleZoomOut} disabled={zoom <= 0.5} title="Zoom Out">
            <ZoomOut size={18} />
          </button>
          <button className={styles.toolBtn} onClick={handleZoomReset} title="Reset Zoom" style={{ fontSize: '11px', fontWeight: 'bold' }}>
            {Math.round(zoom * 100)}%
          </button>
          <button className={styles.toolBtn} onClick={handleZoomIn} disabled={zoom >= 3} title="Zoom In">
            <ZoomIn size={18} />
          </button>
          <button className={styles.toolBtn} onClick={handleShare} title="Copy Link to Image">
            <Link size={18} />
          </button>
          <button className={styles.toolBtn} onClick={handleDownload} title="Download Image">
            <Download size={18} />
          </button>
          <div className={styles.separator} />
          <button className={styles.closeBtn} onClick={onClose} title="Close Lightbox (Esc)">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Left/Right Navigation */}
      {images.length > 1 && (
        <>
          <button 
            className={`${styles.navBtn} ${styles.prev}`} 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className={`${styles.navBtn} ${styles.next}`} 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div className={styles.viewport} onClick={onClose}>
        <div 
          className={styles.imageWrapper}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            style={{ transform: `scale(${zoom})` }}
            className={styles.lightboxImage}
          />
        </div>
      </div>

      {/* Modern minimal Toast message */}
      <div className={`${styles.toast} ${showToast ? styles.show : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
}
