import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  formatAddress,
  formatCoordinates,
  formatOccurrenceType,
  formatReportStatus,
  hasCoordinates,
} from "../lib/formatters";

const defaultCenter = [-30.3361, -54.3218];

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function ReportsMap({ reports = [], height = 420 }) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerRef = useRef(null);

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
      .filter((report) => hasCoordinates(report))
      .map((report) => {
        const marker = L.circleMarker([Number(report.latitude), Number(report.longitude)], {
          radius: 8,
          color: "#0d5d56",
          weight: 2,
          fillColor: "#2c7f93",
          fillOpacity: 0.75,
        });

        const imageBlock = report.imageDataUrl
          ? `<img src="${report.imageDataUrl}" alt="Foto da denúncia" style="display:block;width:180px;max-width:100%;margin-top:8px;border-radius:12px;" />`
          : "";

        marker.bindPopup(
          `<strong>${escapeHtml(formatOccurrenceType(report.type))}</strong><br/>` +
            `${escapeHtml(formatReportStatus(report.status))}<br/>` +
            `${escapeHtml(report.description)}<br/>` +
            `<strong>Local:</strong> ${escapeHtml(formatAddress(report))}<br/>` +
            `<strong>Coordenadas:</strong> ${escapeHtml(formatCoordinates(report))}` +
            imageBlock
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
