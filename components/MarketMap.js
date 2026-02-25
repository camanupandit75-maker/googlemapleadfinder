"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

export function MarketMap({ center, localityResults, getRadius, getColor, businessType }) {
  const { lat, lng, zoom } = center || { lat: 28.6139, lng: 77.209, zoom: 11 };
  const markers = (localityResults || []).filter((r) => r.lat != null && r.lng != null);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      style={{ height: "100%", width: "100%", background: "#0f172a" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
      {markers.map((r) => (
        <CircleMarker
          key={r.locality}
          center={[r.lat, r.lng]}
          radius={getRadius ? getRadius(r.count) : 10}
          pathOptions={{
            fillColor: getColor ? getColor(r.count) : "#22c55e",
            color: "rgba(255,255,255,0.6)",
            weight: 1.5,
            opacity: 1,
            fillOpacity: 0.8,
          }}
        >
          <Popup>
            <div className="text-slate-900 text-sm min-w-[180px]">
              <p className="font-semibold">{r.locality}</p>
              <p>{r.count} businesses found</p>
              {r.avgRating != null && <p>Avg rating: {r.avgRating}</p>}
              <p className="mt-2 text-xs font-medium text-slate-600">Top 3:</p>
              <ul className="list-disc list-inside text-xs">
                {(r.topBusinesses || []).slice(0, 3).map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
