const NOMINATIM_URL = (import.meta.env.VITE_NOMINATIM_URL || 'https://nominatim.openstreetmap.org').replace(/\/$/, '');
let lastAt = 0;

async function throttle() {
  const wait = lastAt + 1100 - Date.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastAt = Date.now();
}

export async function searchPlaces(query, signal) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  await throttle();
  const params = new URLSearchParams({
    q: trimmed,
    format: 'jsonv2',
    addressdetails: '1',
    limit: '6',
    countrycodes: 'in',
  });
  const response = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) throw new Error('Place search is temporarily unavailable.');
  const results = await response.json();
  return results.map((item) => ({
    id: String(item.place_id),
    label: item.display_name,
    lat: Number(item.lat),
    lng: Number(item.lon),
  }));
}

export async function reverseGeocode({ lat, lng }, signal) {
  await throttle();
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'jsonv2',
    zoom: '16',
  });
  const response = await fetch(`${NOMINATIM_URL}/reverse?${params}`, {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) return '';
  const data = await response.json();
  return data.display_name || '';
}
