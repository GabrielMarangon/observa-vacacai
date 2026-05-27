import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter = [-30.3361, -54.3218];

export default function ReportsMap({ reports = [], height = 420 }) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) {
      return;
    }

    const map = L.map(mapElementRef.current).setView(defaultCenter, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapInstanceRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = layerRef.current;

    if (!map || !layer) {
      return;
    }

    layer.clearLayers();

    const points = reports
      .filter(
        (report) =>
          Number.isFinite(Number(report.latitude)) &&
          Number.isFinite(Number(report.longitude))
      )
      .map((report) => {
        const marker = L.circleMarker([Number(report.latitude), Number(report.longitude)], {
          radius: 8,
          color: "#0d5d56",
          weight: 2,
          fillColor: "#2c7f93",
          fillOpacity: 0.75,
        });

        marker.bindPopup(
          `<strong>${report.type}</strong><br/>${report.description}<br/>Status: ${report.status}`
        );

        marker.addTo(layer);
        return [Number(report.latitude), Number(report.longitude)];
      });

    if (points.length > 0) {
      map.fitBounds(points, { padding: [32, 32] });
    } else {
      map.setView(defaultCenter, 13);
    }
  }, [reports]);

  return <div ref={mapElementRef} style={{ height: `${height}px`, borderRadius: "24px" }} />;
}
