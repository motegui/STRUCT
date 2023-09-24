import Mainnavbar from "../components/Mainnavbar"
import Categorycard from "../components/Categorycard"
import Promocard from "../components/Promocard"
import NavBar from "../components/Navbar"
import FooterCh from "../components/FooterCh"

export default function Home(){
    return (
    <>
      <div className="body">
        <Mainnavbar />
        <NavBar />
        <div className="main">
        <div className='my-row'>
            <div className='category-col'>
            <Categorycard/>
            </div>
                <div className='content-col'>
                    <Promocard/>
                    <Promocard/>
                </div>
            </div>
        </div>
        <FooterCh />
        </div>
    </>
    )
}