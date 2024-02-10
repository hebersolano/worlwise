import styles from "./CountryList.module.css";

import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useContext } from "react";
import { CitiesContext } from "../contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useContext(CitiesContext);
  if (isLoading) return <Spinner />;
  if (cities.length == 0) return <Message message={"No data"} />;

  const countries = countriesFilter(cities);
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountryList;

function countriesFilter(citiesData) {
  const cache = [];
  const filter = citiesData
    ?.map((cityData) => {
      if (cache.includes(cityData.country)) {
        return;
      } else {
        cache.push(cityData.country);

        return { country: cityData.country, emoji: cityData.emoji, id: cityData.id };
      }
    })
    .filter((value) => value);

  console.log(filter);
  return filter;
}
