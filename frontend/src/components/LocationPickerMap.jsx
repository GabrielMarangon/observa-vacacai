import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter = [-30.3361, -54.3218];

function parseCoordinatePair(latitude, longitude) {
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
    return null;
  }

  if (parsedLatitude === 0 && parsedLongitude === 0) {
    return null;
  }

  return [parsedLatitude, parsedLongitude];
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  height = 320,
}) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) {
      return;
    }

    const map = L.map(mapElementRef.current).setView(defaultCenter, 13);

    const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    });

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
      }
    );

    streetLayer.addTo(map);
    L.control
      .layers(
        {
          Ruas: streetLayer,
          Satélite: satelliteLayer,
        },
        null,
        { position: "topright" }
      )
      .addTo(map);

    map.on("click", (event) => {
      onChange({
        latitude: event.latlng.lat.toFixed(6),
        longitude: event.latlng.lng.toFixed(6),
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [onChange]);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map) {
      return;
    }

    const coordinates = parseCoordinatePair(latitude, longitude);

    if (!coordinates) {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      map.setView(defaultCenter, 13);
      return;
    }

    if (!markerRef.current) {
      markerRef.current = L.circleMarker(coordinates, {
        radius: 9,
        color: "#9b2f2f",
        weight: 2,
        fillColor: "#c44b4b",
        fillOpacity: 0.75,
      }).addTo(map);
    } else {
      markerRef.current.setLatLng(coordinates);
    }

    map.setView(coordinates, 15);
  }, [latitude, longitude]);

  return (
    <div
      ref={mapElementRef}
      style={{ height: `${height}px`, borderRadius: "22px" }}
    />
  );
}
