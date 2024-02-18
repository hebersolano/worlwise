import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import Button from "./Button";
import useUrlPosition from "../hooks/useUrlPosition";

function Map() {
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const { cities } = useCities();
  const [lat, lng] = useUrlPosition();

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  return (
    <div className={styles.mapContainer}>
      <MapContainer className={styles.map} center={mapPosition} zoom={7} scrollWheelZoom={true}>
        <ButtonLocation setMapPosition={setMapPosition} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <CityMarker key={city.id} city={city} />
        ))}

        <SetView position={mapPosition} />
        <HandleClick />
      </MapContainer>
    </div>
  );
}

export default Map;

function ButtonLocation() {
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);

  const map = useMapEvents({
    locationfound(e) {
      console.log(e);
      // setMapPosition([e.latlng.lat, e.latlng.lng]);
      setIsLoadingPosition(false);
      map.flyTo(e.latlng, map.getZoom());
    },
    locationerror(e) {
      console.log("Error geolocation", e);
    },
  });

  function handleOnClick() {
    setIsLoadingPosition(true);
    map.locate();
  }

  return (
    <Button type="position" onClick={handleOnClick}>
      {isLoadingPosition ? "Loading..." : "Get your position"}
    </Button>
  );
}

function SetView({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function HandleClick() {
  const navigate = useNavigate();
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      navigate(`form?lat=${lat}&lng=${lng}`);
    },
  });
}

function CityMarker({ city }) {
  return (
    <Marker position={[city.position.lat, city.position.lng]}>
      <Popup>
        <span>{city.emoji}</span> {city.cityName}
      </Popup>
    </Marker>
  );
}
