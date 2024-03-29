import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "../components/Logo";
import { useAuth } from "../contexts/AuthContext";
import User from "./User";

function PageNav() {
  const { isAuthenticated } = useAuth();
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          {isAuthenticated ? (
            <User type="block" />
          ) : (
            <NavLink to="/login" className={styles.ctaLink}>
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
