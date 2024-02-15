import { createContext, useEffect, useContext, useReducer } from "react";

const CitiesContext = createContext();

const initState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: payload, isLoading: false };
    case "city/loaded":
      return { ...state, currentCity: payload, isLoading: false };
    case "city/created":
      return { ...state, currentCity: payload, isLoading: false };
    case "city/deleted":
      return { ...state, currentCity: {}, isLoading: false };
    case "refresh":
      return { ...state, isLoading: false };
    case "error":
      return { ...state, isLoading: false };
    default:
      throw new Error("Unknown reducer action");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading }, dispatch] = useReducer(reducer, initState);

  useEffect(function () {
    fetchCities();
  }, []);

  async function fetchCities() {
    try {
      dispatch({ type: "loading" });
      const res = await fetch("http://localhost:8080/cities");
      const data = await res.json();
      dispatch({ type: "cities/loaded", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      console.error(e);
    }
  }

  async function getCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://localhost:8080/cities/${id}`);
      if (!res.ok) return console.error(res);

      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      console.error(e);
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://localhost:8080/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) return console.error(res);

      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
      await fetchCities();
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      console.error(e);
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://localhost:8080/cities/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) return console.error(res);

      dispatch({ type: "city/deleted" });
      await fetchCities();
    } catch (e) {
      dispatch({ type: "error", payload: e.message });
      console.error(e);
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity, createCity, deleteCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (!context) throw new Error("Try to use context without the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities, CitiesContext };
