import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { INDIA_VIEW } from '../lib/geo';

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function markerIcon(kind, selected) {
  const colors = {
    user: '#f4b942',
    veterinary: '#5ee0c8',
    shelter: '#9bb4ff',
    other: '#c9c4b8',
    report: '#ef6b4a',
  };
  const color = colors[kind] || colors.other;
  const size = selected ? 34 : 26;
  return L.divIcon({
    className: 'woof-pin',
    html: `<span class="woof-pin-dot ${selected ? 'is-selected' : ''}" style="--pin:${color};width:${size}px;height:${size}px"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function RescueMap({
  userLocation,
  facilities = [],
  selectedId,
  routeGeometry,
  onSelectFacility,
  reportPoint,
  onReportPointChange,
  className,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({
    user: null,
    facilities: null,
    route: null,
    report: null,
  });
  const callbacksRef = useRef({ onSelectFacility, onReportPointChange });
  callbacksRef.current = { onSelectFacility, onReportPointChange };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView([INDIA_VIEW.lat, INDIA_VIEW.lng], INDIA_VIEW.zoom);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      maxZoom: 19,
    }).addTo(map);
    layersRef.current.facilities = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (layersRef.current.user) {
      layersRef.current.user.remove();
      layersRef.current.user = null;
    }
    if (!userLocation) return;
    const marker = L.marker([userLocation.lat, userLocation.lng], {
      icon: markerIcon('user', false),
      title: 'Your location',
      zIndexOffset: 600,
    }).addTo(map);
    layersRef.current.user = marker;
  }, [userLocation]);

  useEffect(() => {
    const map = mapRef.current;
    const group = layersRef.current.facilities;
    if (!map || !group) return;
    group.clearLayers();
    facilities.forEach((facility) => {
      const marker = L.marker([facility.lat, facility.lng], {
        icon: markerIcon(facility.category, facility.id === selectedId),
        title: facility.name,
      });
      marker.on('click', () => callbacksRef.current.onSelectFacility?.(facility.id));
      marker.addTo(group);
    });
  }, [facilities, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (layersRef.current.route) {
      layersRef.current.route.remove();
      layersRef.current.route = null;
    }
    if (!routeGeometry) return;
    const layer = L.geoJSON(routeGeometry, {
      style: { color: '#f0a35e', weight: 4, opacity: 0.95 },
    }).addTo(map);
    layersRef.current.route = layer;
    try {
      map.fitBounds(layer.getBounds(), { padding: [40, 40] });
    } catch {
      /* empty geometry */
    }
  }, [routeGeometry]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (layersRef.current.report) {
      layersRef.current.report.remove();
      layersRef.current.report = null;
    }
    if (!reportPoint) return;
    const marker = L.marker([reportPoint.lat, reportPoint.lng], {
      icon: markerIcon('report', true),
      draggable: Boolean(onReportPointChange),
      zIndexOffset: 700,
      title: 'Reported location',
    }).addTo(map);
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng();
      callbacksRef.current.onReportPointChange?.({ lat, lng });
    });
    layersRef.current.report = marker;
  }, [reportPoint, onReportPointChange]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const selected = facilities.find((facility) => facility.id === selectedId);
    if (!selected) return;
    map.panTo([selected.lat, selected.lng], { animate: true });
  }, [selectedId, facilities]);

  useEffect(() => {
    const map = mapRef.current;
    const el = containerRef.current;
    if (!map || !el) return undefined;
    const onResize = () => map.invalidateSize();
    const observer = new ResizeObserver(onResize);
    observer.observe(el);
    window.addEventListener('resize', onResize);
    const frame = requestAnimationFrame(onResize);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <div ref={containerRef} className={className || 'rescue-map'} role="application" aria-label="Map of nearby animal services" />;
}
