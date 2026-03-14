import { Route, Routes } from "react-router-dom"
import BaseBallPage from "./page/BaseBallPage"
import Header from "./component/commons/Header"
import GameMainPage from "./page/GameMainPage"

function App() {
  return (
    <div>
      <Header></Header>
      <Routes>
        <Route path="/" element={<GameMainPage />} />
        <Route path="/baseBall" element={<BaseBallPage />} />
      </Routes>
    </div>
  )
}

export default App
