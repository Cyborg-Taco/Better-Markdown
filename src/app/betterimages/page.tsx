import { Suspense } from 'react';
import BetterImagesClient from './BetterImagesClient';
import styles from './page.module.css';

type SearchParams = {
  mode?: string | string[];
};

export default async function BetterImagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const initialLayoutMode = mode === 'badge' ? 'badge' : 'svg';

  return (
    <Suspense
      fallback={
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Loading generator...</span>
        </div>
      }
    >
      <BetterImagesClient initialLayoutMode={initialLayoutMode} />
    </Suspense>
  );
}
