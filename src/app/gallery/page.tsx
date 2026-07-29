import { Suspense } from 'react';
import GalleryClient from './GalleryClient';
import styles from './page.module.css';

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Initializing Gallery...</span>
        </div>
      }
    >
      <GalleryClient />
    </Suspense>
  );
}
