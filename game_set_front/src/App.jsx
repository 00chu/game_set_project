import { Route, Routes } from "react-router-dom";
import BaseBallPage from "./page/game/BaseBallPage";
import Header from "./component/commons/Header";
import GameMainPage from "./page/GameMainPage";
import Footer from "./component/commons/Footer";
import "./App.css";
import ColorMatchPage from "./page/game/ColorMatchPage";
import LoginPage from "./page/login/LoginPage";
import SignupPage from "./page/login/SignupPage";
import FindAccountPage from "./page/login/FindAccountPage";
import MyPage from "./page/mypage/MyPage";
import GameHistoryPage from "./page/game/GameHistoryPage";
import ScrollToTop from "./component/ui/ScrollToTop";
import OAuth2Success from "./component/auth/oauth2/success";

function App() {
  return (
    <div className="wrap">
      <Header></Header>
      <div className="main">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<GameMainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/find-account" element={<FindAccountPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/history/:gameName" element={<GameHistoryPage />} />
          <Route path="/baseball" element={<BaseBallPage />} />
          <Route path="/colorMatch" element={<ColorMatchPage />} />
          <Route path="/oauth2/success" element={<OAuth2Success />} />
        </Routes>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
