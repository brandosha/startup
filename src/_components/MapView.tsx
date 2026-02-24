import React, { ReactHTMLElement } from "react";
import { load, Map } from "@apple/mapkit-loader";

const _mapkit = load({
  token: import.meta.env.VITE_MAPKIT_JS_TOKEN,
  libraries: ["full-map", "user-location"],
});

interface MapProps {
  pins?: {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
  }[];

  className?: string;
}

export default function MapView(props: MapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<Map | null>(null);

  React.useEffect(() => {
    if (!mapRef.current) return;

    _mapkit.then((mapkit) => {
      map.current = new mapkit.Map(mapRef.current!, {
        center: new mapkit.Coordinate(40.7128, -74.0060), // New York City
      });
    });
  }, []);

  return <div ref={mapRef} className={props.className} />;
}