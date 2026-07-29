import { NextRequest, NextResponse } from 'next/server';
import { decodeImagesParam } from '@/utils/url';
import { fetchAndProcessImage, getLoadingSvgPlaceholder } from '@/utils/image';

// Cache control headers: 1 day public cache, allow serving stale while revalidating
const CACHE_HEADERS = {
  'Content-Type': 'image/svg+xml',
  'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
  'Access-Control-Allow-Origin': '*',
};

function getErrorSvg(message: string, width: number = 600, height: number = 150): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="#111111" rx="8"/>
      <rect width="98%" height="98%" x="1%" y="1%" fill="none" stroke="#ea580c" stroke-width="2" rx="8" stroke-dasharray="6 3"/>
      <path d="M ${width/2 - 12} ${height/2 - 25} L ${width/2 + 12} ${height/2 - 25} L ${width/2} ${height/2 - 45} Z" fill="none" stroke="#ea580c" stroke-width="3" stroke-linejoin="round"/>
      <line x1="${width/2}" y1="${height/2 - 37}" x2="${width/2}" y2="${height/2 - 31}" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${width/2}" cy="${height/2 - 27}" r="1.5" fill="#ea580c"/>
      <text x="50%" y="${height/2 + 15}" fill="#ededed" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle">${message.toUpperCase()}</text>
      <text x="50%" y="${height/2 + 35}" fill="#666666" font-family="system-ui, -apple-system, sans-serif" font-size="11" text-anchor="middle">Better Markdown Badge System</text>
    </svg>
  `.trim();
}

function buildFinalSvgMarkup(
  items: Array<{ x: number; y: number; w: number; h: number; dataUri: string }>,
  totalWidth: number,
  totalHeight: number,
  radius: number,
  borderColor: string,
  borderWidth: number
): string {
  const clipPaths = items.map((item, i) => `
      <clipPath id="clip-${i}">
        <rect x="${item.x.toFixed(1)}" y="${item.y.toFixed(1)}" width="${item.w.toFixed(1)}" height="${item.h.toFixed(1)}" rx="${radius}" ry="${radius}" />
      </clipPath>
    `).join('');

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  <defs>${clipPaths}</defs>
  <style>
    .gallery-img { object-fit: cover; }
  </style>
  <g class="final">`;

  items.forEach((item, i) => {
    const xStr = item.x.toFixed(1);
    const yStr = item.y.toFixed(1);
    const wStr = item.w.toFixed(1);
    const hStr = item.h.toFixed(1);

    svgContent += `  <g clip-path="url(#clip-${i})">\n`;
    svgContent += `    <image href="${item.dataUri}" x="${xStr}" y="${yStr}" width="${wStr}" height="${hStr}" preserveAspectRatio="xMidYMid slice" class="gallery-img" />\n`;

    if (borderWidth > 0) {
      svgContent += `    <rect x="${(item.x + borderWidth / 2).toFixed(1)}" y="${(item.y + borderWidth / 2).toFixed(1)}" width="${(item.w - borderWidth).toFixed(1)}" height="${(item.h - borderWidth).toFixed(1)}" rx="${Math.max(0, radius - borderWidth / 2)}" ry="${Math.max(0, radius - borderWidth / 2)}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" />\n`;
    }

    svgContent += `  </g>\n`;
  });

  svgContent += `</g></svg>`;
  return svgContent;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const rawImages = searchParams.get('images');
  const layout = searchParams.get('layout') || 'grid';
  const colsParam = searchParams.get('cols');
  const widthParam = searchParams.get('width');
  const gapParam = searchParams.get('gap');
  const radiusParam = searchParams.get('radius');
  const aspect = searchParams.get('aspect') || '1:1';
  const borderParam = searchParams.get('border'); // Format: color:width (e.g., rgba(255,255,255,0.1):1)

  const imageUrls = decodeImagesParam(rawImages);
  
  if (imageUrls.length === 0) {
    return new NextResponse(getErrorSvg('No images specified'), {
      headers: CACHE_HEADERS,
    });
  }

  const totalWidth = Math.min(Math.max(parseInt(widthParam || '800', 10), 200), 2000);
  const gap = Math.min(Math.max(parseInt(gapParam || '10', 10), 0), 100);
  const radius = Math.min(Math.max(parseInt(radiusParam || '8', 10), 0), 200);
  
  let borderColor = 'rgba(255,255,255,0.08)';
  let borderWidth = 1;
  if (borderParam) {
    const parts = borderParam.split(':');
    if (parts[0]) borderColor = parts[0];
    if (parts[1]) borderWidth = Math.min(Math.max(parseInt(parts[1], 10), 0), 10);
  }

  const numImages = imageUrls.length;

  let cols = 2;
  if (layout === 'col') {
    cols = 1;
  } else if (layout === 'row') {
    cols = numImages;
  } else {
    cols = Math.min(Math.max(parseInt(colsParam || '2', 10), 1), 10);
  }

  let targetFetchWidth = 400;
  if (layout === 'col') {
    targetFetchWidth = totalWidth;
  } else {
    targetFetchWidth = Math.ceil(totalWidth / cols);
  }

  try {
    const processedImages = await Promise.all(
      imageUrls.map((url) => fetchAndProcessImage(url, targetFetchWidth))
    );

    interface LayoutItem {
      x: number;
      y: number;
      w: number;
      h: number;
      dataUri: string;
    }

    const items: LayoutItem[] = [];
    let totalHeight = 0;

    const getAspectMultiplier = (ratioStr: string, defaultVal: number = 1): number => {
      if (ratioStr === '1:1') return 1;
      if (ratioStr === '16:9') return 9 / 16;
      if (ratioStr === '4:3') return 3 / 4;
      if (ratioStr === '3:2') return 2 / 3;
      if (ratioStr === '2:1') return 0.5;
      return defaultVal;
    };

    if (layout === 'row') {
      if (aspect === 'original') {
        const aspectRatios = processedImages.map((img) => img.width / img.height);
        const sumAspects = aspectRatios.reduce((sum, a) => sum + a, 0);
        const rowHeight = (totalWidth - (numImages - 1) * gap) / sumAspects;

        let currentX = 0;
        processedImages.forEach((img, i) => {
          const itemWidth = rowHeight * aspectRatios[i];
          items.push({
            x: currentX,
            y: 0,
            w: itemWidth,
            h: rowHeight,
            dataUri: img.dataUri,
          });
          currentX += itemWidth + gap;
        });
        totalHeight = rowHeight;
      } else {
        const itemWidth = (totalWidth - (numImages - 1) * gap) / numImages;
        const multiplier = getAspectMultiplier(aspect, 1);
        const itemHeight = itemWidth * multiplier;

        processedImages.forEach((img, i) => {
          items.push({
            x: i * (itemWidth + gap),
            y: 0,
            w: itemWidth,
            h: itemHeight,
            dataUri: img.dataUri,
          });
        });
        totalHeight = itemHeight;
      }
    } else if (layout === 'col') {
      let currentY = 0;
      processedImages.forEach((img) => {
        let itemHeight = totalWidth;
        if (aspect === 'original') {
          itemHeight = totalWidth * (img.height / img.width);
        } else {
          itemHeight = totalWidth * getAspectMultiplier(aspect, 1);
        }

        items.push({
          x: 0,
          y: currentY,
          w: totalWidth,
          h: itemHeight,
          dataUri: img.dataUri,
        });
        currentY += itemHeight + gap;
      });
      totalHeight = currentY - gap;
    } else {
      const rows = Math.ceil(numImages / cols);
      const itemWidth = (totalWidth - (cols - 1) * gap) / cols;
      let itemHeight = itemWidth;

      if (aspect === 'original') {
        const validImages = processedImages.filter((img) => !img.error);
        const avgAspect = validImages.length > 0
          ? validImages.reduce((sum, img) => sum + (img.width / img.height), 0) / validImages.length
          : 1;
        itemHeight = itemWidth / avgAspect;
      } else {
        itemHeight = itemWidth * getAspectMultiplier(aspect, 1);
      }

      processedImages.forEach((img, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        items.push({
          x: col * (itemWidth + gap),
          y: row * (itemHeight + gap),
          w: itemWidth,
          h: itemHeight,
          dataUri: img.dataUri,
        });
      });
      totalHeight = rows * itemHeight + (rows - 1) * gap;
    }

    const svgContent = buildFinalSvgMarkup(items, totalWidth, totalHeight, radius, borderColor, borderWidth);

    return new NextResponse(svgContent, {
      headers: CACHE_HEADERS,
    });
  } catch (error) {
    return new NextResponse(getErrorSvg('Unable to render gallery', totalWidth, Math.max(220, Math.min(totalWidth, 480))), {
      headers: CACHE_HEADERS,
    });
  }
}
