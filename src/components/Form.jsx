// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import useUrlPosition from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const initFormState = {
  geocodingError: null,
  isLoadingFetch: false,
  cityName: "",
  country: "",
  emoji: "",
  notes: "",
};

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "loading":
      return { ...state, isLoadingFetch: true };
    case "ready":
      return {
        ...state,
        isLoadingFetch: false,
        geocodingError: null,
        cityName: payload.city || payload.locality || "",
        country: payload.countryName || "",
        emoji: convertToEmoji(payload.countryCode),
      };
    case "setCityName":
      return { ...state, cityName: payload };
    case "setNotes":
      return { ...state, notes: payload };
    case "error":
      return { ...state, geocodingError: payload };
    default:
      break;
  }
}

function Form() {
  const [formState, dispatch] = useReducer(reducer, initFormState);
  const { isLoadingFetch, geocodingError, cityName, country, emoji, notes } = formState;
  const [date, setDate] = useState(new Date());
  const [lat, lng] = useUrlPosition();

  const { createCity } = useCities();
  const navigate = useNavigate();

  useEffect(
    function () {
      async function getGeocodingData() {
        if (!lat && !lng) return;
        try {
          dispatch({ type: "loading" });
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
          );
          if (!res.ok) throw new Error("Error getting city data, please try again.");

          const data = await res.json();
          console.log(data);
          if (!data.countryCode) throw new Error("This is not a city, please click somewhere else.");

          dispatch({ type: "ready", payload: data });
        } catch (error) {
          dispatch({ type: "error", payload: error.message });
          console.error(error);
        }
      }
      getGeocodingData();
    },
    [lat, lng]
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (!cityName && !date) return;

    const newCity = { cityName, country, emoji, date, notes, position: { lat, lng } };
    createCity(newCity);
    navigate("/app/cities");
  }

  if (isLoadingFetch) return <Spinner />;
  if (!lat && !lng) return <Message message="Start by clicking somewhere on the map" />;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => dispatch({ type: "setCityName", payload: e.target.value })}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input id="date" onChange={(e) => setDate(e.target.value)} value={date} /> */}
        <DatePicker id="date" selected={date} onChange={(date) => setDate(date)} dateFormat="dd/MM/yyyy" />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea id="notes" onChange={(e) => dispatch({ type: "setNotes", payload: e.target.value })} value={notes} />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
