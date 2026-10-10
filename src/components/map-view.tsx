"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export type MapPoint = {
  lat: number;
  lng: number;
  label: string;
  kind: "hotel" | "landmark";
};

export function MapView({ points, emptyLabel }: { points: MapPoint[]; emptyLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    const node = ref.current;
    if (!node) return;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, { scrollWheelZoom: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);
      const markers = points.map((point) =>
        L.circleMarker([point.lat, point.lng], {
          radius: point.kind === "landmark" ? 9 : 7,
          color: point.kind === "landmark" ? "#1f6b45" : "#8a6d12",
          fillColor: point.kind === "landmark" ? "#1f6b45" : "#d4af37",
          fillOpacity: 0.95,
          weight: 2,
        }).bindPopup(point.label),
      );
      const group = L.featureGroup(markers).addTo(map);
      if (markers.length) map.fitBounds(group.getBounds().pad(0.25), { maxZoom: 14 });
      else map.setView([21.422487, 39.826206], 12);
      window.setTimeout(() => map?.invalidateSize(), 120);
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [points]);

  return (
    <div className="sr-map overflow-hidden rounded-3xl border border-line">
      <div ref={ref} className="h-[440px] w-full" />
      {!points.some((point) => point.kind === "hotel") ? <p className="border-t border-line bg-paper px-4 py-3 text-sm text-muted">{emptyLabel}</p> : null}
    </div>
  );
}
