import {
  VStack,
  HStack,
  Flex,
  Spacer,
} from '@chakra-ui/react';

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