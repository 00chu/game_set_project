import { Route, Routes } from "react-router-dom";
import BaseBallPage from "./page/BaseBallPage";
import Header from "./component/commons/Header";
import GameMainPage from "./page/GameMainPage";
import Footer from "./component/commons/Footer";
import "./App.css";
import ColorMatchPage from "./page/ColorMatchPage";

function App() {
  return (
    <div className="wrap">
      <Header></Header>
      <div className="main">
        <Routes>
          <Route path="/" element={<GameMainPage />} />
          <Route path="/baseBall" element={<BaseBallPage />} />
          <Route path="/colorMatch" element={<ColorMatchPage />} />
        </Routes>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
