const OSRM_URL = (import.meta.env.VITE_OSRM_URL || 'https://router.project-osrm.org').replace(/\/$/, '');

export async function fetchRoute({ origin, destination, profile = 'driving', signal }) {
  if (!origin || !destination) {
    throw new Error('Current location and a destination are required to calculate a route.');
  }
  const url = `${OSRM_URL}/route/v1/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=true&annotations=false`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Routing service returned ${response.status}. Use an external maps app if this continues.`);
  }
  const data = await response.json();
  if (data.code !== 'Ok' || !data.routes?.[0]) {
    throw new Error(data.message || 'No driving route was found between these points.');
  }
  const route = data.routes[0];
  const steps = [];
  for (const leg of route.legs || []) {
    for (const step of leg.steps || []) {
      steps.push({
        instruction: step.maneuver?.instruction || humanizeManeuver(step),
        distance: step.distance,
        duration: step.duration,
        name: step.name || '',
      });
    }
  }
  return {
    geometry: route.geometry,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    profile,
    steps,
    provider: 'OSRM',
  };
}

function humanizeManeuver(step) {
  const type = step.maneuver?.type || 'continue';
  const modifier = step.maneuver?.modifier ? ` ${step.maneuver.modifier.replace(/_/g, ' ')}` : '';
  const road = step.name ? ` onto ${step.name}` : '';
  return `${type.replace(/_/g, ' ')}${modifier}${road}`.trim();
}
