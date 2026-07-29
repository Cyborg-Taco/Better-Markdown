/**
 * Utility to encode and decode image URLs to a URL-safe format.
 */

// Encode string to base64url
export function encodeBase64(str: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64url');
  } else {
    // Browser-safe base64url encoding
    const base64 = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}

// Decode base64url to string
export function decodeBase64(str: string): string {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    if (typeof window === 'undefined') {
      return Buffer.from(base64, 'base64').toString('utf-8');
    } else {
      // Browser-safe base64url decoding
      return decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
    }
  } catch (e) {
    console.error('Failed to decode base64:', e);
    return str; // Fallback to raw string
  }
}

/**
 * Decodes the 'images' query parameter.
 * It can be a comma-separated list of base64url encoded URLs,
 * or a comma-separated list of raw URLs.
 */
export function decodeImagesParam(param: string | null): string[] {
  if (!param) return [];
  const parts = param.split(',');
  return parts.map(part => {
    const trimmed = part.trim();
    if (!trimmed) return '';
    // If it starts with http:// or https://, it's a raw URL
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    // Attempt decoding
    const decoded = decodeBase64(trimmed);
    if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
      return decoded;
    }
    return trimmed; // fallback
  }).filter(Boolean);
}

/**
 * Encodes an array of URLs into a comma-separated list of base64url strings.
 */
export function encodeImagesParam(urls: string[]): string {
  return urls
    .map(url => url.trim())
    .filter(Boolean)
    .map(url => encodeBase64(url))
    .join(',');
}
