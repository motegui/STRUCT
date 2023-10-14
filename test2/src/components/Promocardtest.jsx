
import {
  Box,
  Divider,
  Text,
  VStack,
  HStack,
  Flex,
  Spacer,
  Button,
  Collapse,
} from '@chakra-ui/react';

import React, { useState , useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiStar } from '@mdi/js';
import { mdiStarOutline } from '@mdi/js';
import { mdiChevronDown, mdiChevronUp  } from '@mdi/js';
import { useSearch } from '../SearchContext';
import { supabase } from '../supabase';

function evaluateDiaSemanal({data}) {
  const dia_semanal = Array.isArray(data?.dia_semanal)
    ? data.dia_semanal.join(" ")
    : data?.dia_semanal || "";

  const loweredDiaSemanal = dia_semanal.toLowerCase();

  const specialCases = [
    { trigger: ["todos los días","lunes"], box: "L" },
    { trigger: ["todos los días","martes"], box: "Ma" },
    { trigger: ["todos los días","miercoles", "miércoles"], box: "Mi" },
    { trigger: ["todos los días","jueves"], box: "J" },
    { trigger: ["todos los días","viernes"], box: "V" },
    { trigger: ["todos los días","sabado", "sabados", "sábado", "sábados"], box: "S" },
    { trigger: ["todos los días","domingo", "domingos"], box: "D" },
  ];



const specialBoxes = specialCases.reduce((result, { trigger, box }) => {
  if (Array.isArray(trigger)) {
    trigger.forEach((t) => {
      if (loweredDiaSemanal.includes(t.toLowerCase())) {
        result.push(box);
      }
    });
  } else {
    if (loweredDiaSemanal.includes(trigger.toLowerCase())) {
      result.push(box);
    }
  }
  return result;
}, []);

if (specialBoxes.length === 0) {
  return 'not';
}

  return specialBoxes;
}

function doesSearchMatch({data}, searchValue) {
  const loweredSearchValue = searchValue.toLowerCase();

  const dia_semanal = Array.isArray(data?.dia_semanal)
    ? data.dia_semanal.join(" ")
    : data?.dia_semanal || "";

  const beneficio = Array.isArray(data?.beneficio)
    ? data.beneficio.join(" ")
    : data?.beneficio || "";

    const descripcion_descuento = Array.isArray(data?.descripcion_descuento)
    ? data.descripcion_descuento.join(" ")
    : data?.descripcion_descuento || "";

    const tarjeta = Array.isArray(data?.tarjeta)
    ? data.tarjeta.join(" ")
    : data?.tarjeta || "";

    const titulo = Array.isArray(data?.titulo)
    ? data.titulo.join(" ")
    : data?.titulo || "";

    const valido_hasta = Array.isArray(data?.valido_hasta)
    ? data.valido_hasta.join(" ")
    : data?.valido_hasta || "";

    const local = Array.isArray(data?.local)
    ? data.local.join(" ")
    : data?.local || "";

  if (
    beneficio.toLowerCase().includes(loweredSearchValue) ||
    descripcion_descuento.toLowerCase().includes(loweredSearchValue) ||
    tarjeta.toLowerCase().includes(loweredSearchValue) ||
    titulo.toLowerCase().includes(loweredSearchValue) ||
    valido_hasta.toLowerCase().includes(loweredSearchValue) ||
    local.toLowerCase().includes(loweredSearchValue) ||
    dia_semanal.toLowerCase().includes(loweredSearchValue)
  ) {
    return true; // Match found
  }

  return false; // No match found
}

function doesDayFilter({checkedDays},specialBoxes){
  var toRet=1;
  if(checkedDays.Lunes) toRet*=specialBoxes.includes("L");
  if(checkedDays.Martes) toRet*= specialBoxes.includes("Ma");
  if(checkedDays.Miércoles) toRet*= specialBoxes.includes("Mi");
  if(checkedDays.Jueves) toRet*= specialBoxes.includes("J");
  if(checkedDays.Viernes) toRet*= specialBoxes.includes("V");
  if(checkedDays.Sabado) toRet*= specialBoxes.includes("S");
  if(checkedDays.Domingo) toRet*= specialBoxes.includes("D");
  return toRet==1;
}

function favsCheck(favsOnly,isFavourite){
  return !favsOnly || (favsOnly && isFavourite);
}

function Promocardtest({data,searchValue,checkedDays,favsOnly,selectedBanks}) {

  const { beneficio, descripcion_descuento, tarjeta, titulo, valido_hasta,local,dia_semanal,img_local, id, banco} = data;

  const specialBoxes = evaluateDiaSemanal({data});

  const notABox = (specialBoxes==='not');

  const isSearchMatch = doesSearchMatch({data}, searchValue);

  const isDayFiltered = doesDayFilter({checkedDays},specialBoxes);

  const [isFavourite, setIsFavourite] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {userEmail, userName} = useSearch();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

// Checa si ya esta como fav de la persona
    const fetchUserData = async () => {
      if(userEmail){
      const { data: userData, error } = await supabase
        .from('USUARIO')
        .select('promos_fav')
        .eq('Email', userEmail);

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      const promosFav = userData[0]?.promos_fav || [];
      setIsFavourite(promosFav.includes(id.toString()));
    }
    };

  useEffect(() => {
    fetchUserData();
  }, [id, userEmail]);

  const toggleFavourite = async () => {
    setIsFavourite(!isFavourite);

    const { data: userData, error } = await supabase
          .from('USUARIO')
          .select('promos_fav')
          .eq('Email', userEmail);
    if (error) {
      console.error('Error fetching data:', error);
      return;
    }
  
    const currentPromosFav = userData[0]?.promos_fav || [];

    let updatedPromosFav;

    if (isFavourite) {
      // If the item is already in the array, remove it
      if (currentPromosFav.includes(id.toString())) {
        console.log(`Removing item with id: ${data.id}`);
        updatedPromosFav = currentPromosFav.filter(promoId => promoId !== id.toString());
      } else {
        console.log(`Item with id: ${id} is not in the array.`);
        // Otherwise, just use the current array (no change needed)
        updatedPromosFav = currentPromosFav;
      }
    } else {
      // Add the item to the array if it's not already there
      if (!currentPromosFav.includes(data.id.toString())) {
        console.log(`Adding item with id: ${id}`);
        updatedPromosFav = [...currentPromosFav, data.id.toString()];
      } else {
        console.log(`Item with id: ${id} is already in the array.`);
        // Otherwise, just use the current array (no change needed)
        updatedPromosFav = currentPromosFav;
      }
    }

    // Make the API call to update the 'promos_fav' array for the existing row
    const { data: updatedData, error2 } = await supabase
      .from('USUARIO')
      .update({
        promos_fav: updatedPromosFav,
      })
      .eq('Email', userEmail);

    if (error2) {
      console.error('Error updating promos_fav:', error2);
    }
  };

  function isBankMatch() {
    // Check if the banco includes at least one of the selected banks
    if (selectedBanks.length === 0) {
      return true; // No bank selected, show all
    }
    
    return selectedBanks.some(selectedBank => banco.includes(selectedBank));
  }

  const databaseDate = new Date(valido_hasta);
  const currentDate = new Date();
  const isDatePriorToCurrent = databaseDate < currentDate;
  const isFavs = favsCheck(favsOnly,isFavourite);


  if(!isSearchMatch || !isDayFiltered || (!isFavs) || (!isBankMatch())) return <></>;
  else
  return (
    <div className='cardContent2'>
      <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      shadow="md"
      bg={isDatePriorToCurrent ? "#E3E1E3":"#F7F0F3"}
      margin={10}
      flex="1"
      position="relative"
      style={{height: 'auto'}}
    >     

      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        {userEmail ? (
        <Button onClick={toggleFavourite} _hover={{ bg: 'pink.100' }} bg={isDatePriorToCurrent ? "#E3E1E3" : "#F7F0F3"} id="fav">
          <Icon path={isFavourite ? mdiStar : mdiStarOutline} size={1} />
        </Button> //quiero que si o si este loggeado para esto
        ):(<></>)}
      </div>
      <VStack>
        {img_local ? (
        <img
          src={img_local}
          alt="Promoción"
          className="myPromoImage"
        />
        ):(<></>)}
        
        <Text fontSize="2xl" fontWeight="bold">
        {beneficio}
      </Text>
      </VStack>
      
      <Divider my={2} borderBottom="1px solid #CCCCCC"/>
      <VStack>
      </VStack>

      <HStack justifyContent={"right"}>
      <Button
        onClick={toggleDropdown}
        _hover={{ bg: 'pink.100' }}
        bg={isDatePriorToCurrent ? "#E3E1E3" : "#F7F0F3"}
        id="desc-toggle"
      >
        <Icon path={isDropdownOpen ? mdiChevronUp : mdiChevronDown} size={1} />
      </Button>
        </HStack>

      <Collapse in={isDropdownOpen}>
        <Text fontSize="md">{descripcion_descuento}</Text>
        <br/>
        {tarjeta.length>0 && (
          <Text>
          <strong>Tarjetas adheridas: </strong> {tarjeta.join(', ')}
        </Text>
        )}
        <br/>
        {titulo && (
          <Text>
            <strong>{titulo}</strong>
          </Text>
        )}
        
      </Collapse>

      <VStack align="start" mt={4} spacing={1}>
        <Text fontSize="sm" fontWeight="bold">
          Local:
        </Text>
        <Text fontSize="sm">{local}</Text>
      </VStack>

      <Spacer/>

      <HStack mt={4} spacing={2}>
        <Text fontSize="sm">Valido hasta:</Text>
        <Text size="sm" color={isDatePriorToCurrent ? "red":""}>{valido_hasta}</Text>
      </HStack>

      {notABox ? (
        <HStack justifyContent={"right"}>
          <Text size="sm" >{dia_semanal}</Text>
        </HStack>
      ):(
        <Flex className="days-available" justifyContent={"right"}>
        <Box bg={specialBoxes.includes("L") ? "#CCCCCC" : "#F7F0F3"}
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">L</Box>
        <Box bg={specialBoxes.includes("Ma") ? "#CCCCCC" : "#F7F0F3"}
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">Ma</Box>
        <Box bg={specialBoxes.includes("Mi") ? "#CCCCCC" : "#F7F0F3"}
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">Mi</Box>
        <Box bg={specialBoxes.includes("J") ? "#CCCCCC" : "#F7F0F3"}
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">J</Box>
        <Box bg={specialBoxes.includes("V") ? "#CCCCCC" : "#F7F0F3"}
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">V</Box>
        <Box bg={specialBoxes.includes("S") ? "#CCCCCC" : "#F7F0F3"}
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">S</Box>
        <Box bg={specialBoxes.includes("D") ? "#CCCCCC" : "#F7F0F3"} 
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">D</Box>
      </Flex>
      )}
    </Box>
    </div>
    
  );
}

export default Promocardtest;