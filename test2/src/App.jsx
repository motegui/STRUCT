import { NavBar } from "./Navbar"
import { FooterCh } from "./FooterCh"
import "./styles.css"
import Mainnavbar from "./Mainnavbar"
import Categorycard from "./Categorycard"
import Promocard from "./Promocard"

export default function App(){
  return (
    <>
      <div className="body">
      <Mainnavbar/>
    <NavBar />
    <div className="main">
      <Categorycard/>
      <Promocard/>
    </div>
    <FooterCh />
    </div>
    </>
  )
}