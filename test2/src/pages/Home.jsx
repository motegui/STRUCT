import Mainnavbar from "../components/Mainnavbar"
import Categorycard from "../components/Categorycard"
import Promocard from "../components/Promocard"
import NavBar from "../components/Navbar"
import FooterCh from "../components/FooterCh"
import Cardlist from "../components/Cardlist"
import MySearchMessage from "../components/MySearchMessage"
import { useSearch } from '../SearchContext';
import Daycard from "../components/Daycard"
import BankCard from "../components/BankCard"


export default function Home(){
    
    const { searchValue, userEmail , userName} = useSearch();

    return (
    <>
      <div className="body">
        <Mainnavbar />
        <NavBar />
        <div className="main">
        <div className='my-row'>
            <div className='category-col'>
            <Categorycard/>
            <Daycard />
            <BankCard />
            </div>
                <div className='content-col'>
                    <MySearchMessage text={searchValue}/>
                    <Cardlist/>
                </div>
            </div>
        </div>
        <FooterCh />
        </div>
    </>
    )
}