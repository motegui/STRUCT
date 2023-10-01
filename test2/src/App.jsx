import {BrowserRouter, Routes, Route} from 'react-router-dom'

import "./styles.css"
import Home from './pages/Home'
import NoPage from './pages/NoPage'
import MySignup from './pages/MySignup'
import MySignin from './pages/MySignin'


export default function App(){
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path="/pages/MySignup" element={<MySignup/>} />
          <Route path="/pages/MySignin" element={<MySignin/>} />
          <Route path="*" element={<NoPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}