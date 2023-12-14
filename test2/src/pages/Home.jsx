import Categorycard from "../components/Categorycard"
import FooterCh from "../components/FooterCh"
import Cardlist from "../components/Cardlist"
import MySearchMessage from "../components/MySearchMessage"
import { useSearch } from '../SearchContext';
import Daycard from "../components/Daycard"
import BankCard from "../components/BankCard"
import LocalCard from "../components/LocalCard"
import MyHeader from "../components/MyHeader"


export default function Home(){
    
    const { searchValue, userEmail , userName} = useSearch();

    const HeaderStyles = {
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 1,
        width: '100%',
      };
      
      const FiltersStyles = {
        position: 'sticky',
        top: "90px",
        bottom:"30px",
        left: 0,
        zIndex: 2,
        height: "400px",
      };

      const ContentStyles = {
        flexGrow: 1,
      };

    return (
    <>
      <div className="body">
        <div style={HeaderStyles}>
            <MyHeader/>
        </div>
        <div className="main">
        <div className='my-row'>
            <div className='category-col' style={FiltersStyles}>
            {userEmail ? <Categorycard/> : <></>}
            <Daycard />
            <BankCard />
            <LocalCard />
            </div>
                <div className='content-col' style={ContentStyles}>
                    <Cardlist/>
                </div>
            </div>
        </div>
        <FooterCh />
        </div>
    </>
    )
}