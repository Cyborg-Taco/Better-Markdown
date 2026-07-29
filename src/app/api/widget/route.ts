import { NextRequest } from 'next/server';

function getErrorSvg(message: string, width: number = 220, height: number = 20): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="${message}">
    <linearGradient id="g" x2="0" y2="100%">
      <stop offset="0" stop-color="#fafafa" stop-opacity=".7"/>
      <stop offset=".1" stop-color="#fafafa" stop-opacity=".0"/>
    </linearGradient>
    <rect width="${width}" height="${height}" fill="#555"/>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
      <text x="${width / 2}" y="${height / 2 + 4}" transform="scale(.1)" fill="#fff">${message}</text>
    </g>
  </svg>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildInfoSvg(label: string, value: string, bg: string, fg: string): string {
  const labelText = escapeXml(label);
  const valueText = escapeXml(value);
  const charWidth = 6.5;
  const padding = 10;
  const height = 20;
  const labelWidth = label.length * charWidth + padding;
  const valueWidth = value.length * charWidth + padding;
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="${labelText}: ${valueText}">
  <title>${labelText}: ${valueText}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbbbbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="${height}" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="${height}" fill="${bg}"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="${fg}" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-anchor="middle" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${labelWidth / 2}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${labelText}</text>
    <text x="${labelWidth / 2}" y="140" transform="scale(.1)" fill="#fff">${labelText}</text>
    <text aria-hidden="true" x="${labelWidth + valueWidth / 2}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${valueText}</text>
    <text x="${labelWidth + valueWidth / 2}" y="140" transform="scale(.1)" fill="#fff">${valueText}</text>
  </g>
</svg>`;
}

function buildDownloadSvg(label: string, bg: string, fg: string): string {
  const text = escapeXml(label);
  const charWidth = 6.5;
  const padding = 10;
  const height = 20;
  const textWidth = label.length * charWidth + padding;
  const iconWidth = 16;
  const totalWidth = textWidth + iconWidth;
  const iconPath = 'M5 5 v6 h4 l-3 3 -3 -3 h4 v-6 z M3 13 h10 v2 H3 z';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="Download ${text}">
  <title>Download ${text}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".7"/>
    <stop offset=".1" stop-color="#ffffff" stop-opacity=".0"/>
    <stop offset=".9" stop-color="#000000" stop-opacity=".0"/>
    <stop offset="1" stop-color="#000000" stop-opacity=".3"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${totalWidth}" height="${height}" fill="${bg}"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="${fg}" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-anchor="middle" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${(textWidth + iconWidth) / 2}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${text}</text>
    <text x="${(textWidth + iconWidth) / 2}" y="140" transform="scale(.1)" fill="#fff">${text}</text>
  </g>
  <g transform="translate(${textWidth - 2}, 0) scale(0.8)" fill="${fg}">
    <path d="${iconPath}"/>
  </g>
</svg>`;
}

function buildCardSvg(p: URLSearchParams): string {
  const width = parseInt(p.get('width') ?? '200', 10);
  const height = parseInt(p.get('height') ?? '50', 10);
  const title = p.get('title') ?? 'Widget Title';
  const subtitle = p.get('subtitle') ?? '';
  const description = p.get('description') ?? '';
  const bg = p.get('bg') ?? '#3b82f6';
  const fg = p.get('fg') ?? '#ffffff';
  const borderColor = p.get('borderColor') ?? 'rgba(255,255,255,0.1)';
  const borderWidth = parseInt(p.get('borderWidth') ?? '1', 10);
  const radius = parseInt(p.get('radius') ?? '10', 10);
  const padding = 14;
  const align = (p.get('align') ?? 'center').toLowerCase() as 'left' | 'center' | 'right';
  const icon = p.get('icon') ?? 'none';
  const iconAlign = (p.get('iconAlign') ?? 'left').toLowerCase() as 'left' | 'right';

  const safeWidth = Math.max(60, width);
  const safeHeight = Math.max(40, height);
  const charWidth = 6.5;
  const maxChars = Math.max(10, Math.floor((safeWidth - padding * 2) / charWidth));

  // Auto height when description present
  const titleHeight = 18;
  const subtitleHeight = subtitle ? 16 : 0;
  const descriptionLineHeight = 14;
  const estimatedDescLines = description ? wrapText(description, maxChars).length : 0;
  const autoHeight = padding + titleHeight + (subtitle ? 4 + subtitleHeight : 0) + (description ? 6 + estimatedDescLines * descriptionLineHeight : 0) + padding;
  const finalHeight = description ? Math.max(safeHeight, autoHeight) : safeHeight;

  // Anchor/direction for text alignment
  const anchor = align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle';
  const iconSize = Math.max(10, Math.min(80, parseInt(p.get('iconSize') ?? '20', 10) || 20));
  const iconGap = 8;
  const hasIcon = icon && icon !== 'none';
  const topAlignedContent = subtitle.trim() !== '' || description.trim() !== '';
  const leftTextPadding = hasIcon && iconAlign === 'left' ? padding + iconSize + iconGap : padding;
  const rightTextPadding = hasIcon && iconAlign === 'right' ? safeWidth - padding - iconSize - iconGap : safeWidth - padding;
  const textX = align === 'left'
    ? leftTextPadding
    : align === 'right'
      ? rightTextPadding
      : (leftTextPadding + rightTextPadding) / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${safeWidth}" height="${finalHeight}" viewBox="0 0 ${safeWidth} ${finalHeight}" role="img" aria-label="${escapeXml(title)}">`;
  svg += `<title>${escapeXml(title)}</title>`;

  const bgX = borderWidth / 2;
  const bgY = borderWidth / 2;
  const bgW = safeWidth - borderWidth;
  const bgH = finalHeight - borderWidth;

  svg += `<rect x="${bgX}" y="${bgY}" width="${bgW}" height="${bgH}" rx="${radius}" ry="${radius}" fill="${bg}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;

  const iconPath = iconPathFor(icon);

  if (topAlignedContent) {
    const titleY = 8;
    const subtitleY = 26;
    const descriptionStartY = subtitle ? 44 : 34;

    if (hasIcon && iconPath) {
      const iconX = iconAlign === 'left' ? padding : safeWidth - padding - iconSize;
      const iconY = titleY + 1;
      svg += `<g transform="translate(${iconX} ${iconY}) scale(${iconSize / 24})" fill="${fg}">${iconPath}</g>`;
    }

    svg += `<text x="${textX}" y="${titleY}" text-anchor="${anchor}" dominant-baseline="hanging" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="16" font-weight="700" fill="${fg}">${escapeXml(title)}</text>`;

    if (subtitle) {
      svg += `<text x="${textX}" y="${subtitleY}" text-anchor="${anchor}" dominant-baseline="hanging" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="12" fill="${fg}" opacity="0.85">${escapeXml(subtitle)}</text>`;
    }

    if (description) {
      const lines = wrapText(description, maxChars);
      lines.forEach((line, idx) => {
        const lineY = descriptionStartY + idx * descriptionLineHeight;
        svg += `<text x="${textX}" y="${lineY}" text-anchor="${anchor}" dominant-baseline="hanging" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11" fill="${fg}" opacity="0.78">${escapeXml(line)}</text>`;
      });
    }
  } else {
    const centerY = finalHeight / 2;
    const iconX = iconAlign === 'left' ? padding : safeWidth - padding - iconSize;
    const centeredIconY = centerY - iconSize / 2;
    const titleAttributes = `text-anchor="${anchor}" dominant-baseline="middle"`;

    if (hasIcon && iconPath) {
      svg += `<g transform="translate(${iconX} ${centeredIconY}) scale(${iconSize / 24})" fill="${fg}">${iconPath}</g>`;
    }

    svg += `<text x="${textX}" y="${centerY}" ${titleAttributes} font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="16" font-weight="700" fill="${fg}">${escapeXml(title)}</text>`;
  }

  svg += `</svg>`;
  return svg;
}

function iconPathFor(name: string): string {
  switch (name) {
    case 'star':
      return '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
    case 'check':
      return '<path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>';
    case 'arrow':
      return '<path d="M4 12h12.17l-5.59-5.59L12 5l8 8-8 8-1.41-1.41L16.17 14H4v-2z"/>';
    case 'info':
      return '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>';
    case 'download':
      return '<path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/>';
    case 'link':
      return '<path d="M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8v2zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10z"/>';
    case 'heart':
      return '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>';
    case 'github':
      return '<path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2.01-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>';
    default:
      return '';
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const type = (params.get('type') ?? 'info').toLowerCase();
  const label = params.get('label') ?? 'Label';
  const value = params.get('value') ?? 'Value';
  const bg = params.get('bg') ?? '#3b82f6';
  const fg = params.get('fg') ?? '#ffffff';

  if (type === 'card') {
    const svg = buildCardSvg(params);
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, immutable',
      },
    });
  }

  if (label.length > 80 || value.length > 80) {
    return new Response(getErrorSvg('Input too long'), {
      headers: { 'Content-Type': 'image/svg+xml' },
    });
  }

  let svg: string;
  if (type === 'download') {
    svg = buildDownloadSvg(label, bg, fg);
  } else {
    svg = buildInfoSvg(label, value, bg, fg);
  }

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, immutable',
    },
  });
}
