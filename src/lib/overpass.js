import { facilityCategory } from './problems';

const OVERPASS_URL = import.meta.env.VITE_OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
const CACHE_MS = 10 * 60 * 1000;
const MIN_INTERVAL_MS = 8000;
const cache = new Map();
let lastRequestAt = 0;

function cacheKey(lat, lng, radiusMeters) {
  return `${lat.toFixed(3)},${lng.toFixed(3)},${radiusMeters}`;
}

function tagsToAddress(tags) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'] || tags['addr:neighbourhood'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
    tags['addr:state'],
    tags['addr:postcode'],
  ].filter(Boolean);
  if (parts.length) return parts.join(', ');
  return tags.address || tags['addr:full'] || '';
}

function normalizeElement(element) {
  const tags = element.tags || {};
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const name = tags.name || tags['name:en'] || tags.operator;
  if (!name) return null;
  const phone = tags.phone || tags['contact:phone'] || tags['contact:mobile'] || '';
  const website = tags.website || tags['contact:website'] || '';
  const hours = tags.opening_hours || '';
  const category = facilityCategory(tags);
  return {
    id: `${element.type}/${element.id}`,
    osmType: element.type,
    osmId: element.id,
    name,
    lat,
    lng,
    category,
    address: tagsToAddress(tags),
    phone,
    website,
    hours,
    operator: tags.operator || '',
    source: 'OpenStreetMap',
    verified: false,
  };
}

export async function searchNearbyFacilities({ lat, lng, radiusMeters = 12000, signal }) {
  const key = cacheKey(lat, lng, radiusMeters);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return { facilities: cached.facilities, fromCache: true, fetchedAt: cached.at };
  }

  const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }

  const query = `[out:json][timeout:25];
(
  nwr["amenity"="veterinary"](around:${radiusMeters},${lat},${lng});
  nwr["healthcare"="veterinarian"](around:${radiusMeters},${lat},${lng});
  nwr["amenity"="animal_shelter"](around:${radiusMeters},${lat},${lng});
  nwr["amenity"="animal_boarding"](around:${radiusMeters},${lat},${lng});
  nwr["social_facility"="animal_shelter"](around:${radiusMeters},${lat},${lng});
);
out center tags;`;

  lastRequestAt = Date.now();
  const body = new URLSearchParams({ data: query });
  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
    signal,
  });
  if (!response.ok) {
    throw new Error(`OpenStreetMap search failed (${response.status}). Try again in a minute.`);
  }
  const data = await response.json();
  const facilities = [];
  const seen = new Set();
  for (const element of data.elements || []) {
    const facility = normalizeElement(element);
    if (!facility || seen.has(facility.id)) continue;
    seen.add(facility.id);
    facilities.push(facility);
  }
  const fetchedAt = Date.now();
  cache.set(key, { facilities, at: fetchedAt });
  return { facilities, fromCache: false, fetchedAt };
}
