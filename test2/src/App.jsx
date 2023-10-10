import {BrowserRouter, Routes, Route} from 'react-router-dom'

import "./styles.css"
import Home from './pages/Home'
import NoPage from './pages/NoPage'
import MySignup from './pages/MySignup'
import MySignin from './pages/MySignin'
import Maps from './pages/Maps'
import MyWaitingVerificationEmail from './pages/MyWaitingVerificationEmail'
import { SearchProvider } from './SearchContext'


export default function App(){
  return (
    <>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path="/pages/MySignup" element={<MySignup/>} />
          <Route path="/pages/MySignin" element={<MySignin/>} />
          <Route path="/pages/MyWaitingVerificationEmail" element={<MyWaitingVerificationEmail/>} />
          <Route path="/pages/Maps" element={<Maps/>} />
          {/*<Route path="*" element={<NoPage/>}/>*/}
        </Routes>
    </>
  )
}