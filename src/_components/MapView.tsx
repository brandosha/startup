import React, { useState, useRef, useEffect } from "react";
import { load, Map, MapEvent, MapKit } from "@apple/mapkit-loader";

const _mapkit = load({
  token: import.meta.env.VITE_MAPKIT_JS_TOKEN,
  libraries: ["full-map", "user-location"],
});

export interface Marker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  color?: string;
}

interface MapProps {
  markers?: Marker[];

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
  onPress?: (coordinate: { latitude: number; longitude: number }) => void;
  onMarkerPress?: (marker: Marker) => void;
}

export default function MapView(props: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  
  const eventsRef = useRef({
    onPress: props.onPress,
    onMarkerPress: props.onMarkerPress,
  })
  useEffect(() => {
    eventsRef.current.onPress = props.onPress;
    eventsRef.current.onMarkerPress = props.onMarkerPress;
  }, [props.onPress, props.onMarkerPress]);

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
    map.addEventListener("single-tap", (event: MapEvent) => {
      console.log("Map single-tap", event);
      const point = event.pointOnPage!;
      const coordinate = map.convertPointOnPageToCoordinate(point);
      eventsRef.current.onPress?.({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    });

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
        if (pin.color) {
          annotation.color = pin.color;
        }

        annotation.addEventListener("select", () => {
          eventsRef.current.onMarkerPress?.(pin);
        });
        mkMap.addAnnotation(annotation);
      });
    });
  }, [props.markers, mkMap]);

  return <div ref={mapRef} className={props.className} />;
}