import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";

function Home() {
  return (
    <div>
      <PageNav />
      <h1>Home</h1>
      <Link to="app">Go to the App</Link>
    </div>
  );
}

export default Home;
