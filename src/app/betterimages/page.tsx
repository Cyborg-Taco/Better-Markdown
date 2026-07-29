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
  ExternalLink,
} from 'lucide-react';
import { encodeImagesParam } from '@/utils/url';
import Lightbox from '@/components/Lightbox';
import styles from './page.module.css';

// Premium developer-themed sample images
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80', // VSCode editor
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', // Matrix/terminal screen
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80', // Sleek terminal logs
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', // Clean IDE setup
];

export default function GeneratorPage() {
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
  const [aspect, setAspect] = useState('original');
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

      {/* Main Workspace split */}
      <div className={styles.workspace}>
        {/* Left Control Panel */}
        <section className={styles.controlPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.headerTitle}>
              <Sparkles size={16} className={styles.glowIcon} />
              <h2>Configurator</h2>
            </div>
            <div className={styles.headerActions}>
              <button onClick={loadSamples} className={styles.textBtn} title="Sample Images">
                Sample Images
              </button>
              <button onClick={resetGenerator} className={styles.iconBtn} title="Reset values">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className={styles.modeTabs}>
            <button 
              className={`${styles.modeTab} ${layoutMode === 'svg' ? styles.active : ''}`}
              onClick={() => { setLayoutMode('svg'); setLayout('grid'); }}
            >
              <Grid size={15} />
              <div className={styles.tabLabels}>
                <span>SVG Badge Grid</span>
                <span className={styles.tabSubText}>Dynamic server rendering</span>
              </div>
            </button>
            <button 
              className={`${styles.modeTab} ${layoutMode === 'table' ? styles.active : ''}`}
              onClick={() => { setLayoutMode('table'); setCols(2); }}
            >
              <Table size={15} />
              <div className={styles.tabLabels}>
                <span>Native Markdown Table</span>
                <span className={styles.tabSubText}>Client-side HTML grids</span>
              </div>
            </button>
          </div>

          {/* URL Input Form */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Image Source URLs <span className={styles.count}>({imageUrls.length})</span>
            </label>
            <div className={styles.urlRows}>
              {imageUrls.map((url, index) => (
                <div key={index} className={styles.urlRow}>
                  <span className={styles.rowNumber}>{index + 1}</span>
                  <input
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className={styles.urlInput}
                  />
                  <div className={styles.rowActions}>
                    <button 
                      onClick={() => moveItem(index, 'up')} 
                      disabled={index === 0}
                      className={styles.rowBtn}
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      onClick={() => moveItem(index, 'down')} 
                      disabled={index === imageUrls.length - 1}
                      className={styles.rowBtn}
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button 
                      onClick={() => deleteUrlRow(index)}
                      className={`${styles.rowBtn} ${styles.delete}`}
                      title="Delete row"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addUrlRow} className={styles.addBtn}>
              <Plus size={14} /> Add Image Slot
            </button>
          </div>

          {/* Grid Settings details */}
          <div className={styles.settingsGroup}>
            <h3 className={styles.groupTitle}>Layout Settings</h3>
            
            <div className={styles.settingsGrid}>
              {/* Columns count */}
              {(layoutMode !== 'svg' || layout === 'grid') && (
                <div className={styles.setting}>
                  <label>Columns</label>
                  <select 
                    value={cols} 
                    onChange={(e) => setCols(parseInt(e.target.value, 10))}
                    className={styles.selectInput}
                    disabled={layout === 'col' && layoutMode === 'svg'}
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} Column{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Layout structure (SVG only) */}
              {layoutMode === 'svg' && (
                <div className={styles.setting}>
                  <label>Alignment</label>
                  <select 
                    value={layout} 
                    onChange={(e) => setLayout(e.target.value as any)}
                    className={styles.selectInput}
                  >
                    <option value="grid">Grid Layout</option>
                    <option value="row">Row (Horizontal)</option>
                    <option value="col">Column (Vertical)</option>
                  </select>
                </div>
              )}

              {/* Aspect Ratio */}
              <div className={styles.setting}>
                <label>Aspect Ratio</label>
                <select 
                  value={aspect} 
                  onChange={(e) => setAspect(e.target.value)}
                  className={styles.selectInput}
                  disabled={layoutMode === 'table'}
                >
                  <option value="original">Original Aspect Ratio</option>
                  <option value="1:1">Square (1:1)</option>
                  <option value="16:9">Widescreen (16:9)</option>
                  <option value="4:3">Standard (4:3)</option>
                  <option value="3:2">Photo (3:2)</option>
                  <option value="2:1">Banner (2:1)</option>
                </select>
              </div>

              {/* SVG dimensions */}
              {layoutMode === 'svg' && (
                <div className={styles.setting}>
                  <label>Badge Width: {width}px</label>
                  <input 
                    type="range" 
                    min="300" 
                    max="1200" 
                    step="50"
                    value={width} 
                    onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                    className={styles.slider}
                  />
                </div>
              )}

              {/* Table image cell width (Table only) */}
              {layoutMode === 'table' && (
                <div className={styles.setting}>
                  <label>Image Width: {cellWidth === 0 ? 'Original' : `${cellWidth}px`}</label>
                  <input 
                    type="range" 
                    min="100" 
                    max="800" 
                    step="20"
                    value={cellWidth} 
                    onChange={(e) => setCellWidth(parseInt(e.target.value, 10))}
                    className={styles.slider}
                  />
                </div>
              )}

              {/* Gap (SVG only) */}
              {layoutMode === 'svg' && (
                <div className={styles.setting}>
                  <label>Spacing: {gap}px</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="40" 
                    value={gap} 
                    onChange={(e) => setGap(parseInt(e.target.value, 10))}
                    className={styles.slider}
                  />
                </div>
              )}

              {/* Border Radius (SVG only) */}
              {layoutMode === 'svg' && (
                <div className={styles.setting}>
                  <label>Roundness: {radius}px</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="32" 
                    value={radius} 
                    onChange={(e) => setRadius(parseInt(e.target.value, 10))}
                    className={styles.slider}
                  />
                </div>
              )}

              {/* Border Settings (SVG only) */}
              {layoutMode === 'svg' && (
                <>
                  <div className={styles.setting}>
                    <label>Border Width: {borderWidth}px</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="5" 
                      value={borderWidth} 
                      onChange={(e) => setBorderWidth(parseInt(e.target.value, 10))}
                      className={styles.slider}
                    />
                  </div>
                  <div className={styles.setting}>
                    <label>Border Color</label>
                    <select 
                      value={borderColor} 
                      onChange={(e) => setBorderColor(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="rgba(255,255,255,0.08)">Subtle Slate (Default)</option>
                      <option value="rgba(255,255,255,0.2)">Clean Light Border</option>
                      <option value="rgba(59,130,246,0.3)">Glowing Blue</option>
                      <option value="rgba(139,92,246,0.3)">Neo Purple</option>
                      <option value="transparent">None</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Right Output Panel */}
        <section className={styles.outputPanel}>
          <div className={styles.panelTabs}>
            <div className={styles.tabsLeft}>
              <button 
                className={`${styles.panelTab} ${activeTab === 'preview' ? styles.active : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <Eye size={14} />
                <span>README Mock View</span>
              </button>
              <button 
                className={`${styles.panelTab} ${activeTab === 'code' ? styles.active : ''}`}
                onClick={() => setActiveTab('code')}
              >
                <Code size={14} />
                <span>Markdown Syntax</span>
              </button>
            </div>
            
            {activeUrls.length > 0 && (
              <button 
                className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                onClick={handleCopyCode}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            )}
          </div>

          <div className={styles.outputBody}>
            {activeUrls.length === 0 ? (
              <div className={styles.emptyOutput}>
                <ImageIcon size={32} className={styles.outputEmptyIcon} />
                <p>Provide at least one image URL to generate preview</p>
              </div>
            ) : (
              <>
                {/* Visual README Preview */}
                {activeTab === 'preview' && (
                  <div className={styles.readmeContainer}>
                    <div className={styles.readmeHeader}>
                      <div className={styles.circle} />
                      <div className={styles.circle} />
                      <div className={styles.circle} />
                      <span className={styles.readmeTitle}>README.md preview</span>
                    </div>
                    
                    <div className={styles.readmeContent}>
                      {/* Mock GitHub Renderer */}
                      <div className={styles.mockGithubRenderer}>
                        {layoutMode === 'svg' ? (
                          /* SVG Badge Mock */
                          <a href={galleryUrl} target="_blank" rel="noreferrer" className={styles.badgeLink}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={apiBadgeUrl} 
                              alt="SVG Gallery Grid Badge" 
                              className={styles.badgeImage}
                              style={{ maxWidth: '100%' }}
                            />
                          </a>
                        ) : (
                          /* Markdown Table Mock */
                          <div className={styles.mockTableContainer}>
                            <table className={styles.mockTable}>
                              <tbody>
                                {Array.from({ length: Math.ceil(activeUrls.length / Math.min(cols, activeUrls.length)) }).map((_, rowIndex) => {
                                  const columnsCount = Math.min(cols, activeUrls.length);
                                  return (
                                    <tr key={rowIndex}>
                                      {Array.from({ length: columnsCount }).map((_, colIndex) => {
                                        const idx = rowIndex * columnsCount + colIndex;
                                        if (idx < activeUrls.length) {
                                          return (
                                            <td key={colIndex}>
                                              <div 
                                                className={styles.tableCellWrapper}
                                                onClick={() => setLocalLightboxIndex(idx)}
                                              >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                  src={activeUrls[idx]} 
                                                  alt={`Image ${idx + 1}`}
                                                  width={cellWidth > 0 ? cellWidth : undefined}
                                                  style={{ maxWidth: '100%', cursor: 'pointer' }}
                                                />
                                              </div>
                                            </td>
                                          );
                                        }
                                        return <td key={colIndex} />;
                                      })}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                            <div className={styles.tableTooltip}>
                              <span>💡 Clicking images in README table takes users to individual index in lightbox.</span>
                              <a href={galleryUrl} target="_blank" rel="noreferrer" className={styles.tooltipLink}>
                                Open Web Gallery <ExternalLink size={11} />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Raw Code Preview */}
                {activeTab === 'code' && (
                  <div className={styles.codeblockContainer}>
                    <div className={styles.codeHeader}>
                      <span className={styles.codeLang}>markdown</span>
                    </div>
                    <pre className={styles.codePre}>
                      <code>{currentMarkdownCode}</code>
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* Local Dashboard Lightbox Preview for Markdown Table Mock */}
      {localLightboxIndex !== null && (
        <Lightbox
          images={activeUrls}
          initialIndex={localLightboxIndex}
          onClose={() => setLocalLightboxIndex(null)}
        />
      )}
    </div>
  );
}
