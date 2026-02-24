import React, { useState, useRef } from "react";
import { load, Map, MapKit } from "@apple/mapkit-loader";

const _mapkit = load({
  token: import.meta.env.VITE_MAPKIT_JS_TOKEN,
  libraries: ["full-map", "user-location"],
});

interface MapProps {
  markers?: {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
  }[];

  region?: {
    center: {
      latitude: number;
      longitude: number;
    };
    span: {
      latitudeDelta: number;
      longitudeDelta: number;
    };
  }

  className?: string;
}

export default function MapView(props: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  const [mapkit, setMapkit] = useState<MapKit | null>(null);
  React.useEffect(() => {
    _mapkit.then((mk) => {
      setMapkit(mk);
    });
  }, []);

  const [mkMap, setMkMap] = useState<Map | null>(null);

  React.useEffect(() => {
    if (!mapRef.current) return;
    if (!mapkit) return;

    const startRegion = new mapkit.CoordinateRegion(
    new mapkit.Coordinate(40.12, -111.64922954905643), // BYU
    new mapkit.CoordinateSpan(0.5, 0.5)
    );
    if (props.region) {
      startRegion.center = new mapkit.Coordinate(
        props.region.center.latitude,
        props.region.center.longitude
      );
      startRegion.span = new mapkit.CoordinateSpan(
        props.region.span.latitudeDelta,
        props.region.span.longitudeDelta
      );
    }

    const map = new mapkit.Map(mapRef.current!, {
      region: startRegion,
      showsUserLocationControl: true,
    })
    setMkMap(map);
  }, [mapkit]);

  React.useEffect(() => {
    if (!mkMap) return;

    _mapkit.then((mapkit) => {
      mkMap.removeAnnotations(mkMap.annotations);

      props.markers?.forEach((pin) => {
        const annotation = new mapkit.MarkerAnnotation(
          new mapkit.Coordinate(pin.latitude, pin.longitude)
        );
        annotation.title = pin.title;
        mkMap.addAnnotation(annotation);
      });
    });
  }, [props.markers, mkMap]);

  return <div ref={mapRef} className={props.className} />;
}