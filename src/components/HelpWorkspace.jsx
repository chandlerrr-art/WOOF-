import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  Crosshair,
  MapPin,
  Navigation,
  Phone,
  Search,
  X,
} from 'lucide-react';
import RescueMap from './RescueMap';
import { CITY_CENTERS, formatDistance, formatDuration, mapsDirectionsUrl } from '../lib/geo';
import { searchPlaces } from '../lib/geocode';
import { searchNearbyFacilities } from '../lib/overpass';
import { PROBLEMS, facilityTypeLabel, getProblem, rankFacilities } from '../lib/problems';
import { fetchRoute } from '../lib/routing';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'veterinary', label: 'Veterinary' },
  { id: 'shelter', label: 'Shelters' },
];

export default function HelpWorkspace({
  userLocation,
  locationStatus,
  locationError,
  onLocate,
  problemId,
  onProblemChange,
  onOpenReport,
  onOpenSafety,
}) {
  const [query, setQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchCenter, setSearchCenter] = useState(null);
  const [rawFacilities, setRawFacilities] = useState([]);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('');
  const [sheetOpen, setSheetOpen] = useState(true);
  const [route, setRoute] = useState(null);
  const [routeError, setRouteError] = useState('');
  const [routing, setRouting] = useState(false);
  const [travelMode, setTravelMode] = useState('driving');
  const abortRef = useRef({ places: null, route: null });

  const origin = userLocation || searchCenter;
  const problem = getProblem(problemId);

  const facilities = useMemo(() => {
    const ranked = rankFacilities(rawFacilities, origin, problemId);
    return filter === 'all' ? ranked : ranked.filter((item) => item.category === filter);
  }, [rawFacilities, origin, problemId, filter]);

  const selected = facilities.find((item) => item.id === selectedId) || null;

  useEffect(() => {
    if (!origin) return undefined;
    const controller = new AbortController();
    abortRef.current.places?.abort();
    abortRef.current.places = controller;
    setLoadingPlaces(true);
    setSearchError('');
    const radius = problem.urgent ? 20000 : 12000;
    searchNearbyFacilities({ lat: origin.lat, lng: origin.lng, radiusMeters: radius, signal: controller.signal })
      .then(({ facilities: next, fetchedAt: at }) => {
        setRawFacilities(next);
        setFetchedAt(at);
        setSelectedId((current) => (next.some((item) => item.id === current) ? current : ''));
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setSearchError(error.message || 'Could not load nearby services.');
        setRawFacilities([]);
      })
      .finally(() => setLoadingPlaces(false));
    return () => controller.abort();
  }, [origin?.lat, origin?.lng, problem.urgent]);

  useEffect(() => {
    setRoute(null);
    setRouteError('');
  }, [selectedId, travelMode, userLocation?.lat, userLocation?.lng]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    try {
      setSearchError('');
      const results = await searchPlaces(query);
      setSuggestions(results);
      if (!results.length) setSearchError('No matching places in India. Try a city or neighbourhood name.');
    } catch (error) {
      setSuggestions([]);
      setSearchError(error.message);
    }
  };

  const choosePlace = (place) => {
    setSearchCenter({ lat: place.lat, lng: place.lng });
    setQuery(place.label.split(',').slice(0, 2).join(','));
    setSuggestions([]);
  };

  const requestRoute = async () => {
    if (!selected) return;
    if (!userLocation) {
      setRouteError('Allow location access, or open the destination in Google Maps.');
      return;
    }
    abortRef.current.route?.abort();
    const controller = new AbortController();
    abortRef.current.route = controller;
    setRouting(true);
    setRouteError('');
    try {
      const nextRoute = await fetchRoute({
        origin: userLocation,
        destination: selected,
        profile: travelMode,
        signal: controller.signal,
      });
      setRoute(nextRoute);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setRoute(null);
        setRouteError(error.message);
      }
    } finally {
      setRouting(false);
    }
  };

  const freshness = fetchedAt
    ? `OSM snapshot loaded ${new Date(fetchedAt).toLocaleTimeString()}`
    : 'Directory data comes from OpenStreetMap and is unverified.';

  return (
    <section className="workspace">
      <RescueMap
        userLocation={userLocation}
        facilities={facilities}
        selectedId={selectedId}
        routeGeometry={route?.geometry}
        onSelectFacility={(id) => {
          setSelectedId(id);
          setSheetOpen(true);
        }}
      />

      <div className="map-hud">
        <form className="search-bar" onSubmit={handleSearch}>
          <Search size={16} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a place in India"
            aria-label="Search a place"
          />
          <button type="submit" className="btn-ghost">Search</button>
        </form>
        {suggestions.length > 0 && (
          <ul className="suggest-list">
            {suggestions.map((place) => (
              <li key={place.id}>
                <button type="button" onClick={() => choosePlace(place)}>
                  {place.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="problem-row" role="listbox" aria-label="What kind of help">
          {PROBLEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip ${problemId === item.id ? 'active' : ''} ${item.urgent ? 'urgent' : ''}`}
              onClick={() => onProblemChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="hint">{problem.hint}</p>
      </div>

      <div className="map-controls">
        <button type="button" className="icon-btn" onClick={onLocate} title="Use my location">
          <Crosshair size={18} />
          <span>My location</span>
        </button>
        {CITY_CENTERS.map((city) => (
          <button
            key={city.id}
            type="button"
            className="chip"
            onClick={() => setSearchCenter({ lat: city.lat, lng: city.lng })}
          >
            {city.name}
          </button>
        ))}
      </div>

      <aside className={`sheet ${sheetOpen ? 'open' : 'collapsed'}`}>
        <button type="button" className="sheet-handle" onClick={() => setSheetOpen((open) => !open)} aria-expanded={sheetOpen}>
          <ChevronDown size={16} />
          Nearby services
        </button>

        <div className="sheet-body">
          {locationStatus === 'denied' && (
            <div className="banner warn" role="status">
              Location is blocked. Search a city or allow access to rank results by distance.
            </div>
          )}
          {locationStatus === 'unavailable' && (
            <div className="banner warn" role="status">
              {locationError || 'Current location is unavailable.'}
            </div>
          )}
          {locationStatus === 'prompt' && !origin && (
            <div className="banner" role="status">
              Use my location or pick a city to find veterinary clinics and shelters on OpenStreetMap.
            </div>
          )}
          {searchError && <div className="banner error" role="alert">{searchError}</div>}
          {!navigator.onLine && (
            <div className="banner error" role="status">You appear to be offline. Map tiles and search need a network connection.</div>
          )}

          <div className="sheet-toolbar">
            <div className="filters">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip ${filter === item.id ? 'active' : ''}`}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button type="button" className="btn-primary" onClick={onOpenReport}>Report an injured animal</button>
          </div>
          <p className="meta">{freshness} Hours and intake are unknown unless listed on OSM.</p>

          {loadingPlaces && <div className="banner">Searching OpenStreetMap around this area…</div>}

          {!loadingPlaces && origin && facilities.length === 0 && (
            <div className="empty">
              <AlertCircle size={22} />
              <p>No matching OSM listings in this search radius. Try another city or widen the problem filter to All.</p>
            </div>
          )}

          <ul className="result-list">
            {facilities.map((facility) => (
              <li key={facility.id}>
                <button
                  type="button"
                  className={`result-card ${facility.id === selectedId ? 'selected' : ''}`}
                  onClick={() => setSelectedId(facility.id)}
                >
                  <div>
                    <strong>{facility.name}</strong>
                    <span className="result-meta">
                      {facilityTypeLabel(facility.category)}
                      {facility.distanceKm != null ? ` · ${formatDistance(facility.distanceKm)}` : ''}
                    </span>
                    {facility.address && <span className="result-address">{facility.address}</span>}
                  </div>
                  <MapPin size={16} />
                </button>
              </li>
            ))}
          </ul>

          {selected && (
            <div className="detail-card">
              <div className="detail-head">
                <h2>{selected.name}</h2>
                <button type="button" className="icon-btn" onClick={() => setSelectedId('')} aria-label="Clear selection">
                  <X size={16} />
                </button>
              </div>
              <p className="result-meta">{facilityTypeLabel(selected.category)} · Unverified OSM listing</p>
              {selected.address && <p>{selected.address}</p>}
              {selected.phone && <p>{selected.phone}</p>}
              {selected.hours
                ? <p>Opening hours (OSM): {selected.hours}</p>
                : <p>Opening hours unknown.</p>}
              <p className="meta">WOOF does not confirm that this facility will accept an emergency case.</p>

              <div className="action-row">
                {selected.phone && (
                  <a className="btn-primary" href={`tel:${selected.phone.replace(/[^0-9+]/g, '')}`}>
                    <Phone size={16} /> Call facility
                  </a>
                )}
                <button type="button" className="btn-secondary" onClick={requestRoute} disabled={routing}>
                  <Navigation size={16} />
                  {routing ? 'Calculating…' : 'Get directions'}
                </button>
                <a
                  className="btn-secondary"
                  href={mapsDirectionsUrl(userLocation, selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </a>
              </div>

              <div className="mode-row">
                <span>Travel mode</span>
                <button type="button" className={travelMode === 'driving' ? 'chip active' : 'chip'} onClick={() => setTravelMode('driving')}>Driving</button>
                <button type="button" className={travelMode === 'walking' ? 'chip active' : 'chip'} onClick={() => setTravelMode('walking')}>Walking</button>
              </div>

              {routeError && <div className="banner error" role="alert">{routeError}</div>}
              {route && (
                <div className="route-card">
                  <p>
                    <strong>{formatDistance(route.distanceMeters / 1000)}</strong>
                    {' · '}
                    {formatDuration(route.durationSeconds)}
                    {' · '}
                    {route.profile}
                  </p>
                  <p className="meta">
                    Static route from OSRM public demo. This is not live turn-by-turn navigation, traffic, or automatic rerouting.
                  </p>
                  <ol className="steps">
                    {route.steps.slice(0, 24).map((step, index) => (
                      <li key={`${step.instruction}-${index}`}>{step.instruction}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          <button type="button" className="linkish" onClick={onOpenSafety}>Safety notes while waiting</button>
        </div>
      </aside>
    </section>
  );
}
