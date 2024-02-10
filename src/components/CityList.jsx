import { useContext } from "react";

import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { CitiesContext } from "../contexts/CitiesContext";

function CityList() {
  const { cities, isLoading } = useContext(CitiesContext);

  if (isLoading) return <Spinner />;
  if (cities.length == 0) return <Message message={"No data"} />;
  console.log(cities);

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
