export const CITY_CENTERS = [
  { id: 'bengaluru', name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { id: 'delhi', name: 'Delhi', lat: 28.6139, lng: 77.209 },
  { id: 'mumbai', name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { id: 'pune', name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { id: 'chennai', name: 'Chennai', lat: 13.0827, lng: 80.2707 },
];

export const INDIA_VIEW = { lat: 22.9734, lng: 78.6569, zoom: 5 };

export function haversineKm(a, b) {
  if (!a || !b || !Number.isFinite(a.lat) || !Number.isFinite(a.lng) || !Number.isFinite(b.lat) || !Number.isFinite(b.lng)) {
    return null;
  }
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function formatDistance(km) {
  if (km == null || Number.isNaN(km)) return 'Distance unknown';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return 'Time unknown';
  const total = Math.max(0, Math.round(seconds / 60));
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes ? `${hours} h ${minutes} min` : `${hours} h`;
}

export function nearestCityId(coords) {
  if (!coords) return 'unknown';
  let best = { id: 'unknown', km: Infinity };
  for (const city of CITY_CENTERS) {
    const km = haversineKm(coords, city);
    if (km != null && km < best.km) best = { id: city.id, km };
  }
  return best.km <= 80 ? best.id : 'unknown';
}

export function mapsDirectionsUrl(origin, destination) {
  const dest = `${destination.lat},${destination.lng}`;
  if (origin) {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${dest}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
}

export function mapsPlaceUrl(destination) {
  return `https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lng}`;
}
