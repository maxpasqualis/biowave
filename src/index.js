import "./index.css";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Play from "./pages/Play";
import About from "./pages/About";
import NoPage from "./pages/NoPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="play" element={<Play />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);
