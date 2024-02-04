import { Link } from "react-router-dom";
import styles from "./AppNav.module.css";

function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link to="/pricing">ppp</Link>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;
