'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import Lightbox from '@/components/Lightbox';
import styles from './page.module.css';

type WidgetType = 'card' | 'info' | 'download';
type TextAlign = 'left' | 'center' | 'right';
type IconAlign = 'left' | 'right';

interface WidgetConfig {
  type: WidgetType;
  label: string;
  value: string;
  bg: string;
  fg: string;
  url: string;
  title: string;
  subtitle: string;
  description: string;
  borderColor: string;
  borderWidth: number;
  radius: number;
  width: number;
  height: number;
  align: TextAlign;
  icon: string;
  iconSize?: number;
  iconAlign: IconAlign;
}

const ICON_OPTIONS = [
  { value: 'none', label: 'No Icon' },
  { value: 'star', label: 'Star' },
  { value: 'check', label: 'Check' },
  { value: 'arrow', label: 'Arrow' },
  { value: 'info', label: 'Info' },
  { value: 'download', label: 'Download' },
  { value: 'link', label: 'Link' },
  { value: 'heart', label: 'Heart' },
  { value: 'github', label: 'GitHub' },
];

const SAMPLE_WIDGETS: WidgetConfig[] = [
  {
    type: 'card',
    label: 'Card',
    value: '',
    bg: '#3b82f6',
    fg: '#ffffff',
    url: 'https://github.com',
    title: 'Downloads',
    subtitle: 'Latest release',
    description: 'Grab the newest build of our tool with all the latest fixes and features.',
    borderColor: '#1f2937',
    borderWidth: 1,
    radius: 10,
    width: 260,
    height: 130,
    align: 'left',
    icon: 'download',
    iconSize: 20,
    iconAlign: 'left',
  },
  {
    type: 'card',
    label: 'Card',
    value: '',
    bg: '#10b981',
    fg: '#ffffff',
    url: 'https://github.com',
    title: 'Documentation',
    subtitle: 'Read the docs',
    description: 'Detailed guides, API reference, and examples to get you started quickly.',
    borderColor: '#0f766e',
    borderWidth: 1,
    radius: 10,
    width: 260,
    height: 130,
    align: 'left',
    icon: 'info',
    iconSize: 20,
    iconAlign: 'right',
  },
];

function cloneDefaults(): WidgetConfig {
  return {
    type: 'card',
    label: 'Label',
    value: 'Value',
    bg: '#8b5cf6',
    fg: '#ffffff',
    url: '',
    title: 'My Widget',
    subtitle: 'Subtitle text',
    description: 'Add a description for your widget.',
    borderColor: '#1f2937',
    borderWidth: 1,
    radius: 10,
    width: 200,
    height: 50,
    align: 'center',
    icon: 'none',
    iconSize: 20,
    iconAlign: 'left',
  };
}

function hexToColorInput(hex: string): string {
  if (!hex) return '#3b82f6';
  return hex;
}

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    cloneDefaults(),
    cloneDefaults(),
  ]);
  const [advancedOpen, setAdvancedOpen] = useState<boolean[]>([false, false]);

  const [layoutMode, setLayoutMode] = useState<'svg' | 'table'>('svg');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const [cols, setCols] = useState(2);
  const [spacing, setSpacing] = useState(12);

  const [localLightboxIndex, setLocalLightboxIndex] = useState<number | null>(null);

  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://better-markdown.vercel.app';

  const loadSamples = () => setWidgets(SAMPLE_WIDGETS);

  const resetGenerator = () => {
    setWidgets([cloneDefaults()]);
    setLayoutMode('svg');
    setCols(2);
    setSpacing(12);
  };

  const addWidget = () => {
    setWidgets([...widgets, cloneDefaults()]);
    setAdvancedOpen([...advancedOpen, false]);
  };

  const removeWidget = (index: number) => {
    if (widgets.length <= 1) {
      setWidgets([cloneDefaults()]);
      setAdvancedOpen([false]);
      return;
    }
    setWidgets(widgets.filter((_, i) => i !== index));
    setAdvancedOpen(advancedOpen.filter((_, i) => i !== index));
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === widgets.length - 1) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    const next = [...widgets];
    [next[index], next[target]] = [next[target], next[index]];
    setWidgets(next);
    const advNext = [...advancedOpen];
    [advNext[index], advNext[target]] = [advNext[target], advNext[index]];
    setAdvancedOpen(advNext);
  };

  const updateWidget = (index: number, patch: Partial<WidgetConfig>) => {
    const next = [...widgets];
    next[index] = { ...next[index], ...patch };
    setWidgets(next);
  };

  const buildApiUrl = (w: WidgetConfig): string => {
    const params = new URLSearchParams();
    params.set('type', w.type);
    if (w.type === 'card') {
      params.set('title', w.title);
      if (w.subtitle) params.set('subtitle', w.subtitle);
      if (w.description) params.set('description', w.description);
      params.set('width', w.width.toString());
      params.set('height', w.height.toString());
      params.set('radius', w.radius.toString());
      params.set('borderWidth', w.borderWidth.toString());
      params.set('borderColor', w.borderColor);
      params.set('align', w.align);
      if (w.icon && w.icon !== 'none') {
        params.set('icon', w.icon);
        params.set('iconAlign', w.iconAlign);
        params.set('iconSize', (w.iconSize || 20).toString());
      }
    } else {
      params.set('label', w.label);
      if (w.type === 'info') params.set('value', w.value);
    }
    params.set('bg', w.bg);
    params.set('fg', w.fg);
    return `${origin}/api/widget?${params.toString()}`;
  };

  const visibleWidgets = widgets.filter(w => {
    if (w.type === 'card') return w.title.trim() !== '';
    return w.label.trim() !== '';
  });

  const getSvgMarkdown = (w: WidgetConfig): string => {
    const apiUrl = buildApiUrl(w);
    const target = w.url || 'https://example.com';
    const alt = w.type === 'card' ? w.title || 'Widget' : w.label || 'Widget';
    return `[![${alt}](${apiUrl})](${target})`;
  };

  const getTableMarkdown = (): string => {
    if (visibleWidgets.length === 0) return '<!-- Add at least one widget -->';
    const columnsCount = Math.min(Math.max(cols, 1), visibleWidgets.length);
    let md = '| ' + Array(columnsCount).fill(' ').join(' | ') + ' |\n';
    md += '| ' + Array(columnsCount).fill('---').join(' | ') + ' |\n';
    const rows = Math.ceil(visibleWidgets.length / columnsCount);
    for (let r = 0; r < rows; r++) {
      let row = '| ';
      for (let c = 0; c < columnsCount; c++) {
        const idx = r * columnsCount + c;
        if (idx < visibleWidgets.length) {
          const w = visibleWidgets[idx];
          const apiUrl = buildApiUrl(w);
          const target = w.url || 'https://example.com';
          const alt = w.type === 'card' ? w.title || 'Widget' : w.label || 'Widget';
          row += `<a href="${target}"><img src="${apiUrl}" alt="${alt}" /></a>`;
        } else {
          row += ' ';
        }
        row += ' | ';
      }
      md += row + '\n';
    }
    return md.trim();
  };

  const currentMarkdownCode =
    layoutMode === 'svg'
      ? visibleWidgets.map(getSvgMarkdown).join('\n')
      : getTableMarkdown();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentMarkdownCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      <div className={styles.workspace}>
        <section className={styles.controlPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.headerTitle}>
              <Sparkles size={16} className={styles.glowIcon} />
              <h2>Widget Configurator</h2>
            </div>
            <div className={styles.headerActions}>
              <button onClick={loadSamples} className={styles.textBtn} title="Sample widgets">
                Samples
              </button>
              <button onClick={resetGenerator} className={styles.iconBtn} title="Reset">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className={styles.modeTabs}>
            <button
              className={`${styles.modeTab} ${layoutMode === 'svg' ? styles.active : ''}`}
              onClick={() => setLayoutMode('svg')}
            >
              <Grid size={15} />
              <div className={styles.tabLabels}>
                <span>Stacked</span>
                <span className={styles.tabSubText}>One widget per line</span>
              </div>
            </button>
            <button
              className={`${styles.modeTab} ${layoutMode === 'table' ? styles.active : ''}`}
              onClick={() => setLayoutMode('table')}
            >
              <Table size={15} />
              <div className={styles.tabLabels}>
                <span>Side-by-side</span>
                <span className={styles.tabSubText}>Markdown table layout</span>
              </div>
            </button>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Widgets <span className={styles.count}>({widgets.length})</span>
            </label>
            <div className={styles.urlRows}>
              {widgets.map((w, index) => (
                <div
                  key={index}
                  className={`${styles.urlRow} ${styles.urlRowColumn}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={styles.rowNumber}>{index + 1}</span>
                    <button
                      type="button"
                      className={styles.textBtn}
                      onClick={() => {
                        const next = [...advancedOpen];
                        next[index] = !next[index];
                        setAdvancedOpen(next);
                      }}
                      style={{ flex: 1 }}
                    >
                      {advancedOpen[index] ? 'Hide Advanced' : 'Advanced'}
                    </button>
                    <div className={styles.rowActions}>
                      <button onClick={() => moveWidget(index, 'up')} disabled={index === 0} className={styles.rowBtn} title="Move up">
                        <ArrowUp size={14} />
                      </button>
                      <button onClick={() => moveWidget(index, 'down')} disabled={index === widgets.length - 1} className={styles.rowBtn} title="Move down">
                        <ArrowDown size={14} />
                      </button>
                      <button onClick={() => removeWidget(index)} className={`${styles.rowBtn} ${styles.delete}`} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Title"
                    value={w.title}
                    onChange={(e) => updateWidget(index, { title: e.target.value })}
                    className={styles.urlInput}
                    style={{ width: '100%' }}
                  />
                  <input
                    type="text"
                    placeholder="Subtitle"
                    value={w.subtitle}
                    onChange={(e) => updateWidget(index, { subtitle: e.target.value })}
                    className={styles.urlInput}
                    style={{ width: '100%' }}
                  />
                  <textarea
                    placeholder="Description"
                    value={w.description}
                    onChange={(e) => updateWidget(index, { description: e.target.value })}
                    className={styles.urlInput}
                    style={{ width: '100%', height: '60px', resize: 'vertical', padding: '6px 4px', fontFamily: 'inherit' }}
                  />

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      <label style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Background</label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={hexToColorInput(w.bg)}
                          onChange={(e) => updateWidget(index, { bg: e.target.value })}
                          style={{ width: '32px', height: '28px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          value={w.bg}
                          onChange={(e) => updateWidget(index, { bg: e.target.value })}
                          className={styles.urlInput}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      <label style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Text</label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={hexToColorInput(w.fg)}
                          onChange={(e) => updateWidget(index, { fg: e.target.value })}
                          style={{ width: '32px', height: '28px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          value={w.fg}
                          onChange={(e) => updateWidget(index, { fg: e.target.value })}
                          className={styles.urlInput}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      <label style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Text Alignment</label>
                      <select
                        value={w.align}
                        onChange={(e) => updateWidget(index, { align: e.target.value as TextAlign })}
                        className={styles.selectInput}
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      <label style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Icon</label>
                      <select
                        value={w.icon}
                        onChange={(e) => updateWidget(index, { icon: e.target.value })}
                        className={styles.selectInput}
                      >
                        {ICON_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      <label style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Icon Position</label>
                      <select
                        value={w.iconAlign}
                        onChange={(e) => updateWidget(index, { iconAlign: e.target.value as IconAlign })}
                        className={styles.selectInput}
                        disabled={w.icon === 'none'}
                      >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                  <input
                    type="url"
                    placeholder="Click URL (https://...)"
                    value={w.url}
                    onChange={(e) => updateWidget(index, { url: e.target.value })}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (!val) return;
                      if (!/^https?:\/\//i.test(val)) {
                        updateWidget(index, { url: `https://${val}` });
                      } else if (/^http:/.test(val)) {
                        // prefer https
                        updateWidget(index, { url: val.replace(/^http:/i, 'https:') });
                      }
                    }}
                    className={styles.urlInput}
                    style={{ width: '100%' }}
                  />

                  {advancedOpen[index] && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <label style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Width</label>
                          <input
                            type="number"
                            value={w.width}
                            min={120}
                            max={600}
                            onChange={(e) => updateWidget(index, { width: parseInt(e.target.value, 10) || 200 })}
                            className={styles.urlInput}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <label style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Height</label>
                          <input
                            type="number"
                            value={w.height}
                            min={40}
                            max={400}
                            onChange={(e) => updateWidget(index, { height: parseInt(e.target.value, 10) || 50 })}
                            className={styles.urlInput}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <label style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Radius</label>
                          <input
                            type="number"
                            value={w.radius}
                            min={0}
                            max={60}
                            onChange={(e) => updateWidget(index, { radius: parseInt(e.target.value, 10) || 0 })}
                            className={styles.urlInput}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <label style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Border Width</label>
                          <input
                            type="number"
                            value={w.borderWidth}
                            min={0}
                            max={10}
                            onChange={(e) => updateWidget(index, { borderWidth: parseInt(e.target.value, 10) || 0 })}
                            className={styles.urlInput}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <label style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Border Color</label>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <input
                              type="color"
                              value={hexToColorInput(w.borderColor)}
                              onChange={(e) => updateWidget(index, { borderColor: e.target.value })}
                              style={{ width: '32px', height: '28px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                            />
                            <input
                              type="text"
                              value={w.borderColor}
                              onChange={(e) => updateWidget(index, { borderColor: e.target.value })}
                              className={styles.urlInput}
                              style={{ flex: 1 }}
                            />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '140px' }}>
                          <label style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Icon Size</label>
                          <input
                            type="number"
                            min={10}
                            max={80}
                            value={w.iconSize ?? 20}
                            onChange={(e) => updateWidget(index, { iconSize: parseInt(e.target.value, 10) || 20 })}
                            className={styles.urlInput}
                            style={{ width: '100%' }}
                            disabled={w.icon === 'none'}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addWidget} className={styles.addBtn}>
              <Plus size={14} /> Add Widget
            </button>
          </div>

          {layoutMode === 'table' && (
            <div className={styles.settingsGroup}>
              <h3 className={styles.groupTitle}>Table Settings</h3>
              <div className={styles.settingsGrid}>
                <div className={styles.setting}>
                  <label>Columns</label>
                  <select
                    value={cols}
                    onChange={(e) => setCols(parseInt(e.target.value, 10))}
                    className={styles.selectInput}
                  >
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n} Column{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.setting}>
                  <label>Gap: {spacing}px</label>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={spacing}
                    onChange={(e) => setSpacing(parseInt(e.target.value, 10))}
                    className={styles.slider}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

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
            {currentMarkdownCode && (
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
            {visibleWidgets.length === 0 ? (
              <div className={styles.emptyOutput}>
                <Info size={32} className={styles.outputEmptyIcon} />
                <p>Add a widget to generate preview</p>
              </div>
            ) : (
              <div className={styles.readmeContainer}>
                <div className={styles.readmeHeader}>
                  <div className={styles.circle} />
                  <div className={styles.circle} />
                  <div className={styles.circle} />
                  <span className={styles.readmeTitle}>README.md preview</span>
                </div>
                <div className={styles.readmeContent}>
                  {activeTab === 'preview' && layoutMode === 'svg' && (
                    <div className={styles.mockGithubRenderer}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing}px`, padding: '20px', width: '100%' }}>
                        {visibleWidgets.map((w, i) => (
                          <a key={i} href={w.url || '#'} target="_blank" rel="noreferrer" className={styles.badgeLink}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={buildApiUrl(w)} alt={`${w.type === 'card' ? w.title : w.label} widget`} className={styles.badgeImage} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === 'preview' && layoutMode === 'table' && (
                    <div className={styles.mockTableContainer}>
                      <table className={styles.mockTable}>
                        <tbody>
                          {Array.from({ length: Math.ceil(visibleWidgets.length / Math.min(cols, visibleWidgets.length)) }).map((_, rowIndex) => {
                            const columnsCount = Math.min(cols, visibleWidgets.length);
                            return (
                              <tr key={rowIndex}>
                                {Array.from({ length: columnsCount }).map((__, colIndex) => {
                                  const idx = rowIndex * columnsCount + colIndex;
                                  if (idx < visibleWidgets.length) {
                                    const w = visibleWidgets[idx];
                                    return (
                                      <td key={colIndex} style={{ padding: `${spacing}px` }}>
                                        <div
                                          className={styles.tableCellWrapper}
                                          onClick={() => setLocalLightboxIndex(idx)}
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={buildApiUrl(w)}
                                            alt={w.type === 'card' ? w.title : w.label}
                                            style={{ maxWidth: '100%', cursor: 'pointer' }}
                                          />
                                        </div>
                                      </td>
                                    );
                                  }
                                  return <td key={colIndex} style={{ padding: `${spacing}px` }} />;
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
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
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {localLightboxIndex !== null && (
        <Lightbox
          images={visibleWidgets.map(w => buildApiUrl(w))}
          initialIndex={localLightboxIndex}
          onClose={() => setLocalLightboxIndex(null)}
        />
      )}
    </div>
  );
}
