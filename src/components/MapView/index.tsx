import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useItinerary } from "../../hooks/useItinerary";
import { DaySelector } from "../DaySelector";
import type { Activity } from "../../types";

// Fix Leaflet default marker icon paths broken by Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TYPE_COLORS: Record<Activity["type"], string> = {
  travel: "#94A3B8",
  sight: "#3B82F6",
  food: "#F97316",
  beach: "#06B6D4",
  activity: "#8B5CF6",
  free: "#22C55E",
};

function createCircleIcon(color: string, number: number): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 28px; height: 28px; border-radius: 50%;
      background: ${color}; border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 11px; font-weight: 700;
      font-family: Inter, system-ui, sans-serif;
    ">${number}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function MapCenterUpdater({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    map.invalidateSize();
    if (positions.length === 1) {
      map.setView(positions[0], 13, { animate: true });
    } else {
      map.fitBounds(positions, { padding: [40, 40], animate: true, maxZoom: 14 });
    }
  }, [map, positions]);
  return null;
}

interface MapViewProps {
  initialDayId?: string;
}

export function MapView({ initialDayId }: MapViewProps) {
  const { state } = useItinerary();
  const [selectedDayId, setSelectedDayId] = useState(
    initialDayId ?? state.days[0]?.id ?? "day-1"
  );

  const selectedDay = state.days.find((d) => d.id === selectedDayId);
  const activitiesWithGps = (selectedDay?.activities ?? []).filter(
    (a) => a.location.lat !== 0 && a.location.lng !== 0
  );
  const hasActivitiesWithoutGps =
    (selectedDay?.activities.length ?? 0) > activitiesWithGps.length;

  const positions: [number, number][] = activitiesWithGps.map((a) => [
    a.location.lat,
    a.location.lng,
  ]);

  const totalDrive = (selectedDay?.activities ?? []).reduce(
    (sum, a) => sum + (a.driveFromPrevious?.minutes ?? 0),
    0
  );

  const accommodationPos: [number, number] = [
    state.meta.accommodation.coordinates.lat,
    state.meta.accommodation.coordinates.lng,
  ];

  return (
    <main className="pb-20 lg:pb-8 flex flex-col">
      <DaySelector
        days={state.days}
        selectedDayId={selectedDayId}
        onDaySelect={setSelectedDayId}
      />

      {hasActivitiesWithoutGps && (
        <div
          className="mx-4 mb-2 p-2 rounded text-xs flex gap-1.5"
          style={{ backgroundColor: "#FFF7ED", color: "#92400E" }}
        >
          ⚠️ Některá místa nemají GPS souřadnice a nejsou zobrazena na mapě.
        </div>
      )}

      {activitiesWithGps.length === 0 && (
        <div
          className="mx-4 mb-2 p-2 rounded text-xs"
          style={{ backgroundColor: "#F1F5F9", color: "var(--color-text-secondary)" }}
        >
          Pro tento den nejsou dostupné GPS souřadnice.
        </div>
      )}

      <div className="mx-0 relative" style={{ height: "60vh", minHeight: "300px" }}>
        <MapContainer
          center={accommodationPos}
          zoom={10}
          minZoom={9}
          maxZoom={17}
          style={{ width: "100%", height: "100%" }}
        >
          <MapResizer />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {positions.length > 0 && (
            <MapCenterUpdater positions={positions} />
          )}

          {/* Route polyline */}
          {positions.length > 1 && (
            <Polyline
              positions={positions}
              pathOptions={{ color: "#94A3B8", weight: 2, dashArray: "8, 12" }}
            />
          )}

          {/* Activity markers */}
          {activitiesWithGps.map((activity, index) => {
            const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${activity.location.lat},${activity.location.lng}`;
            return (
              <Marker
                key={activity.id}
                position={[activity.location.lat, activity.location.lng]}
                icon={createCircleIcon(TYPE_COLORS[activity.type], index + 1)}
              >
                <Popup>
                  <div className="min-w-[160px]">
                    <p className="font-semibold text-sm">{activity.title}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{activity.time}</p>
                    {activity.description && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {activity.description.slice(0, 80)}
                        {activity.description.length > 80 ? "…" : ""}
                      </p>
                    )}
                    <a
                      href={gmapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block text-xs font-medium"
                      style={{ color: "#1B6B93" }}
                    >
                      Navigovat →
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {totalDrive > 0 && (
        <div
          className="mx-4 mt-3 p-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: "var(--color-surface)", color: "var(--color-text-secondary)", boxShadow: "var(--shadow-card)" }}
        >
          🚗 Celkem přejezdů: {totalDrive} min
        </div>
      )}
    </main>
  );
}
