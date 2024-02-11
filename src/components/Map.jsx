import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";

function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const { cities, currentCity } = useCities();
  console.log("current", currentCity);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  return (
    <div className={styles.mapContainer}>
      <MapContainer className={styles.map} center={mapPosition} zoom={7} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <CityMarker key={city.id} city={city} />
        ))}
        <SetView position={mapPosition} />
      </MapContainer>
    </div>
  );
}

export default Map;

function SetView({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function CityMarker({ city }) {
  return (
    <Marker position={[city.position.lat, city.position.lng]}>
      <Popup>{city.cityName}</Popup>
    </Marker>
  );
}
