import { Jimp } from 'jimp';

// A clean, developer-focused SVG placeholder when an image fails to load
const FALLBACK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="100%" height="100%" fill="#1a1a1a" rx="8"/>
  <rect width="98%" height="98%" x="1%" y="1%" fill="none" stroke="#333333" stroke-width="2" rx="8" stroke-dasharray="8 4"/>
  <path d="M150 170 H250 M170 140 H230 M170 140 L160 170 M230 140 L240 170 M160 170 V240 H240 V170 Z" fill="none" stroke="#444444" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="200" cy="205" r="16" fill="none" stroke="#444444" stroke-width="4"/>
  <text x="50%" y="72%" fill="#666666" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle" letter-spacing="0.5">IMAGE LOAD FAILED</text>
  <text x="50%" y="78%" fill="#444444" font-family="system-ui, -apple-system, sans-serif" font-size="11" text-anchor="middle">Click to inspect URL</text>
</svg>
`.trim();

const FALLBACK_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(FALLBACK_SVG)}`;

interface ImageFetchResult {
  dataUri: string;
  width: number;
  height: number;
  error?: boolean;
}

export function getLoadingSvgPlaceholder(width: number, height: number): string {
  const safeWidth = Math.max(220, Math.min(width, 2000));
  const safeHeight = Math.max(160, Math.min(height, 1200));
  const centerX = safeWidth / 2;
  const centerY = safeHeight / 2;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${safeWidth} ${safeHeight}" width="${safeWidth}" height="${safeHeight}">
  <rect x="0" y="0" width="${safeWidth}" height="${safeHeight}" rx="18" fill="#06070b" />
  <circle cx="${centerX}" cy="${centerY}" r="24" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="4" />
  <circle cx="${centerX}" cy="${centerY}" r="24" fill="none" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" stroke-dasharray="150" stroke-dashoffset="45" opacity="0.95">
    <animateTransform attributeName="transform" type="rotate" from="0 ${centerX} ${centerY}" to="360 ${centerX} ${centerY}" dur="0.9s" repeatCount="indefinite" />
  </circle>
</svg>`;
}

/**
 * Fetches an image, resizes it to a target width if it exceeds it,
 * and returns it as a base64 Data URI.
 */
export async function fetchAndProcessImage(
  url: string,
  targetWidth?: number
): Promise<ImageFetchResult> {
  try {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      throw new Error('Invalid URL');
    }

    // Set a timeout for the fetch request using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Read the image using Jimp
    const image = await Jimp.read(buffer);

    const originalWidth = image.width;

    // Resize image if a target width is specified and it's larger than that
    if (targetWidth && originalWidth > targetWidth) {
      image.resize({ w: targetWidth });
    }

    // Get the base64 URI
    const mimeType = (image.mime || 'image/png') as
      | 'image/png'
      | 'image/bmp'
      | 'image/tiff'
      | 'image/x-ms-bmp'
      | 'image/gif'
      | 'image/jpeg';
    const dataUri = await image.getBase64(mimeType);

    return {
      dataUri,
      width: image.width,
      height: image.height,
    };
  } catch (error) {
    console.error(`Failed to process image from URL (${url}):`, error);
    
    // Return placeholder metadata
    return {
      dataUri: FALLBACK_DATA_URI,
      width: 400,
      height: 400,
      error: true,
    };
  }
}
