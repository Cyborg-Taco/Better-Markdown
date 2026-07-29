'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Check, 
  Grid, 
  Table, 
  Eye, 
  Code,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { encodeImagesParam } from '@/utils/url';
import Lightbox from '@/components/Lightbox';
import styles from './page.module.css';

// Premium developer-themed sample images
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80', // VSCode editor
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', // Matrix/terminal screen
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80', // Sleek terminal logs
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'  // Clean IDE setup
];

export default function HomePage() {
  // State
  const [imageUrls, setImageUrls] = useState<string[]>(['', '']);
  const [layoutMode, setLayoutMode] = useState<'svg' | 'table'>('svg');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  
  // Gallery options
  const [layout, setLayout] = useState<'grid' | 'row' | 'col'>('grid');
  const [cols, setCols] = useState(2);
  const [gap, setGap] = useState(10);
  const [radius, setRadius] = useState(8);
  const [aspect, setAspect] = useState('1:1');
  const [width, setWidth] = useState(800);
  const [cellWidth, setCellWidth] = useState(380); // for Markdown Table HTML images
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderColor, setBorderColor] = useState('rgba(255,255,255,0.08)');

  // Lightbox preview on dashboard
  const [localLightboxIndex, setLocalLightboxIndex] = useState<number | null>(null);

  // Get base site URL
  const [origin, setOrigin] = useState('https://better-markdown.vercel.app');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Filter out empty URLs
  const activeUrls = imageUrls.map(url => url.trim()).filter(Boolean);

  // Load samples
  const loadSamples = () => {
    setImageUrls([...SAMPLE_IMAGES]);
  };

  // Reset
  const resetGenerator = () => {
    setImageUrls(['', '']);
    setLayout('grid');
    setCols(2);
    setGap(10);
    setRadius(8);
    setAspect('1:1');
    setWidth(800);
    setCellWidth(380);
    setBorderWidth(1);
    setBorderColor('rgba(255,255,255,0.08)');
  };

  // URL input change
  const handleUrlChange = (index: number, value: string) => {
    const next = [...imageUrls];
    next[index] = value;
    setImageUrls(next);
  };

  // Add row
  const addUrlRow = () => {
    setImageUrls([...imageUrls, '']);
  };

  // Delete row
  const deleteUrlRow = (index: number) => {
    if (imageUrls.length <= 1) {
      setImageUrls(['']);
      return;
    }
    const next = imageUrls.filter((_, i) => i !== index);
    setImageUrls(next);
  };

  // Move item up/down
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === imageUrls.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const next = [...imageUrls];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setImageUrls(next);
  };

  // Generate output URLs & markdown code
  const b64Param = activeUrls.length > 0 ? encodeImagesParam(activeUrls) : '';
  const galleryUrl = `${origin}/gallery?images=${b64Param}`;
  
  // Build API Badge URL
  const apiParams = new URLSearchParams();
  if (b64Param) apiParams.set('images', b64Param);
  if (layout !== 'grid') apiParams.set('layout', layout);
  if (cols !== 2 && layout === 'grid') apiParams.set('cols', cols.toString());
  if (gap !== 10) apiParams.set('gap', gap.toString());
  if (radius !== 8) apiParams.set('radius', radius.toString());
  if (aspect !== '1:1') apiParams.set('aspect', aspect);
  if (width !== 800) apiParams.set('width', width.toString());
  if (borderWidth !== 1 || borderColor !== 'rgba(255,255,255,0.08)') {
    apiParams.set('border', `${borderColor}:${borderWidth}`);
  }

  const apiBadgeUrl = `${origin}/api/gallery?${apiParams.toString()}`;

  // Markdown code outputs
  const svgMarkdownCode = `[![Better Gallery](${apiBadgeUrl})](${galleryUrl})`;

  const getTableMarkdownCode = () => {
    if (activeUrls.length === 0) return '<!-- Add image URLs to generate table -->';
    
    // Determine columns
    const columnsCount = Math.min(Math.max(cols, 1), activeUrls.length);
    
    // Header
    let md = '| ' + Array(columnsCount).fill(' ').join(' | ') + ' |\n';
    md += '| ' + Array(columnsCount).fill('---').join(' | ') + ' |\n';
    
    // Rows
    const rowsCount = Math.ceil(activeUrls.length / columnsCount);
    for (let r = 0; r < rowsCount; r++) {
      let rowContent = '| ';
      for (let c = 0; c < columnsCount; c++) {
        const idx = r * columnsCount + c;
        if (idx < activeUrls.length) {
          const url = activeUrls[idx];
          const itemGalleryLink = `${galleryUrl}&index=${idx}`;
          // Generate raw HTML tag so size can be locked
          const widthAttr = cellWidth > 0 ? ` width="${cellWidth}"` : '';
          rowContent += `<a href="${itemGalleryLink}"><img src="${url}"${widthAttr} alt="Image ${idx + 1}" /></a>`;
        } else {
          rowContent += ' ';
        }
        rowContent += ' | ';
      }
      md += rowContent + '\n';
    }
    
    return md.trim();
  };

  const currentMarkdownCode = layoutMode === 'svg' ? svgMarkdownCode : getTableMarkdownCode();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentMarkdownCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <span className={styles.logoBadge}>PRO</span>
          <span className={styles.logoText}>Better Markdown</span>
        </div>
        <div className={styles.navRight}>
          <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.navLink}>
            GitHub Camo Friendly
          </a>
        </div>
      </nav>

      {/* Feature List */}
      <main className={styles.workspace}>
        <h2 className={styles.groupTitle}>Toolkit Features</h2>
        <ul className={styles.settingsGrid}>
          <li className={styles.setting}>
            <a href="/betterimages" className={styles.textBtn}>Better Images Generator</a>
          </li>
          <li className={styles.setting}>
            <a href="/widgets" className={styles.textBtn}>Customizable Widgets</a>
          </li>
          {/* Add more feature links as you build them */}
        </ul>
      </main>
    </div>
  );
}
