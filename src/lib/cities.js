export const CITY_CENTERS = [
  { id: 'bengaluru', name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { id: 'delhi', name: 'Delhi', lat: 28.6139, lng: 77.209 },
  { id: 'mumbai', name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { id: 'pune', name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { id: 'chennai', name: 'Chennai', lat: 13.0827, lng: 80.2707 },
];

const ALLOWED_CITIES = new Set(CITY_CENTERS.map((city) => city.id));

export function nearestCityId(coords) {
  if (!coords) return 'unknown';
  let best = { id: 'unknown', km: Infinity };
  for (const city of CITY_CENTERS) {
    const km = Math.hypot(city.lat - coords.lat, city.lng - coords.lng) * 111;
    if (km < best.km) best = { id: city.id, km };
  }
  return best.km <= 80 && ALLOWED_CITIES.has(best.id) ? best.id : 'unknown';
}

export function cityById(id) {
  return CITY_CENTERS.find((city) => city.id === id) || CITY_CENTERS[0];
}
