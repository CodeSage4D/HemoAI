"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icons in React Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export default function DynamicMap() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-border relative z-0">
      <MapContainer center={[24.46, 77.0]} zoom={6} className="w-full h-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        {/* Hospital A - Gwalior */}
        <Marker position={[26.2183, 78.1828]} icon={icon}>
          <Popup>
            <div className="font-bold text-base mb-1">JAH Hospital Gwalior</div>
            <div className="text-emerald-500 font-medium text-sm">Inventory Level: Optimum</div>
            <div className="mt-2 text-xs text-muted-foreground border-t border-border pt-1">O+ Supply Target: 98%</div>
          </Popup>
        </Marker>

        {/* Shortage Event Radius - Near Indore */}
        <CircleMarker center={[22.8, 75.9]} pathOptions={{ color: 'red', fillColor: '#ef4444', fillOpacity: 0.2 }} radius={40}>
          <Popup>
            <div className="font-bold text-destructive text-base mb-1">Critical Shortage Zone</div>
            <div className="font-medium text-sm text-foreground">Multi-vehicle trauma incident near AB Road.</div>
            <div className="mt-2 text-xs text-muted-foreground border-t border-border pt-1">Requesting Immediate O- Redistribution.</div>
          </Popup>
        </CircleMarker>

        {/* Regional Blood Bank - Indore */}
        <Marker position={[22.7196, 75.8577]} icon={icon}>
           <Popup>
            <div className="font-bold text-primary text-base mb-1">MY Hospital Regional Hub</div>
            <div className="font-medium text-sm">Available Fleet Dispatch: 4</div>
            <div className="mt-2 text-xs border-t border-border pt-1 flex items-center justify-between">
              <span>Units available:</span> <strong className="text-primary">45,020</strong>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
