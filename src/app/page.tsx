import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Grid2x2, Image as ImageIcon, ImagePlus } from 'lucide-react';
import styles from './page.module.css';

const TOOLS = [
  {
    title: 'Widgets',
    description: 'Build README badges and small cards with icons, colors, borders, and links.',
    href: '/widgets',
    icon: Grid2x2,
    tag: 'Markdown cards',
  },
  {
    title: 'Image layouts',
    description: 'Generate gallery markdown for image grids, compact gallery badges, and clean preview layouts.',
    href: '/betterimages',
    icon: ImagePlus,
    tag: 'Gallery builder',
  },
  {
    title: 'Gallery view',
    description: 'Open the gallery badge and image gallery builder in one place.',
    href: '/betterimages?mode=badge',
    icon: ImageIcon,
    tag: 'Gallery tool',
  },
];

export default function HomePage() {
  return (
    <main className={styles.container}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <Image src="/icon1.png" alt="Better Markdown app icon" width={34} height={34} className={styles.brandIcon} />
          <div className={styles.brandText}>
            <Link href="/" className={styles.brandName}>
              Better Markdown
            </Link>
            <p className={styles.brandNote}>Open a tool and keep moving.</p>
          </div>
        </div>
      </header>

      <section className={styles.content}>
        <div className={styles.intro}>
          <p className={styles.kicker}>Tools</p>
          <h1>Make README content easier to build and reuse.</h1>
          <p className={styles.summary}>
            Better Markdown gives you a few simple tools for turning links, images, and widgets
            into markdown that is ready to drop into GitHub docs.
          </p>
        </div>

        <div className={styles.toolGrid}>
          {TOOLS.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link key={tool.title} href={tool.href} className={styles.toolCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <Icon size={18} />
                  </div>
                  <span className={styles.cardTag}>{tool.tag}</span>
                </div>
                <div className={styles.cardBody}>
                  <h2>{tool.title}</h2>
                  <p>{tool.description}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span>Open tool</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
