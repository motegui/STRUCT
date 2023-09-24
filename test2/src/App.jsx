import {BrowserRouter, Routes, Route} from 'react-router-dom'

import "./styles.css"
import Home from './pages/Home'
import NoPage from './pages/NoPage'



export default function App(){
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path="*" element={<NoPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}