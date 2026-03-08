import { Route, Routes } from "react-router-dom"
import BaseBallPage from "./page/BaseBallPage"
import Header from "./component/commons/Header"

function App() {
  return (
   <div>
    <Header></Header>
    <Routes>
      <Route path="/" element={<BaseBallPage/>}/>
      <Route path="/baseBall" element={<BaseBallPage/>}/>
    </Routes>
   </div>
  )
}

export default App
