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
import { useEffect } from "react";

function App() {
  console.log("APP RENDER");

  return <div>TEST</div>;
}

export default App;
