'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Maximize2, Image as ImageIcon } from 'lucide-react';
import { decodeImagesParam } from '@/utils/url';
import Lightbox from '@/components/Lightbox';
import styles from './page.module.css';

function parseInitialIndex(value: string | null, imageCount: number): number | null {
  if (value === null || imageCount === 0) return null;

  const index = parseInt(value, 10);
  if (!Number.isNaN(index) && index >= 0 && index < imageCount) {
    return index;
  }

  return null;
}

function GalleryContent({
  rawImages,
  initialIndexParam,
  router,
}: {
  rawImages: string | null;
  initialIndexParam: string | null;
  router: ReturnType<typeof useRouter>;
}) {
  const images = useMemo(() => {
    if (!rawImages) return [];
    return decodeImagesParam(rawImages);
  }, [rawImages]);

  const initialLightboxIndex = useMemo(() => {
    const parsed = parseInitialIndex(initialIndexParam, images.length);
    if (parsed !== null) return parsed;
    if (images.length === 1) return 0;
    return null;
  }, [images.length, initialIndexParam]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(initialLightboxIndex);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('index', index.toString());
    window.history.replaceState({}, '', currentUrl.toString());
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('index');
    window.history.replaceState({}, '', currentUrl.toString());
  };

  const handleGoBack = () => {
    router.back();
  };

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
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <Image
            src="/icon1.png"
            alt="Better Markdown app icon"
            width={30}
            height={30}
            className={styles.logoBadge}
          />
          <Link href="/" className={styles.logoText}>
            Better Markdown
          </Link>
        </div>
      </nav>

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

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Powered by <Link href="/" className={styles.footerLink}>Better Markdown</Link> badge system.
        </p>
      </footer>

      {lightboxIndex !== null && (
        <Lightbox
          key={lightboxIndex}
          images={images}
          initialIndex={lightboxIndex}
          onClose={handleCloseLightbox}
        />
      )}
    </div>
  );
}

export default function GalleryClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawImages = searchParams.get('images');
  const initialIndexParam = searchParams.get('index');
  const searchKey = searchParams.toString();

  return (
    <GalleryContent
      key={searchKey}
      rawImages={rawImages}
      initialIndexParam={initialIndexParam}
      router={router}
    />
  );
}
