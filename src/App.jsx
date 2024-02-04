import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Home from "./pages/Home";
import PageNoFound from "./pages/PageNoFound";
import AppLayout from "./pages/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="app" element={<AppLayout />} />
        <Route path="product" element={<AppLayout />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="*" element={<PageNoFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
