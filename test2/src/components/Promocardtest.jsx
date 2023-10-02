
import {
  Box,
  Divider,
  Text,
  VStack,
  HStack,
  Flex,
} from '@chakra-ui/react';

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

  const beneficio_cuotas = Array.isArray(data?.beneficio_cuotas)
    ? data.beneficio_cuotas.join(" ")
    : data?.beneficio_cuotas || "";

    const descripcion_descuento = Array.isArray(data?.descripcion_descuento)
    ? data.descripcion_descuento.join(" ")
    : data?.descripcion_descuento || "";

    const tarjeta = Array.isArray(data?.tarjeta)
    ? data.tarjeta.join(" ")
    : data?.tarjeta || "";

    const producto = Array.isArray(data?.producto)
    ? data.producto.join(" ")
    : data?.producto || "";

    const valido_hasta = Array.isArray(data?.valido_hasta)
    ? data.valido_hasta.join(" ")
    : data?.valido_hasta || "";

    const local = Array.isArray(data?.local)
    ? data.local.join(" ")
    : data?.local || "";

  if (
    beneficio_cuotas.toLowerCase().includes(loweredSearchValue) ||
    descripcion_descuento.toLowerCase().includes(loweredSearchValue) ||
    tarjeta.toLowerCase().includes(loweredSearchValue) ||
    producto.toLowerCase().includes(loweredSearchValue) ||
    valido_hasta.toLowerCase().includes(loweredSearchValue) ||
    local.toLowerCase().includes(loweredSearchValue) ||
    dia_semanal.toLowerCase().includes(loweredSearchValue)
  ) {
    return true; // Match found
  }

  return false; // No match found
}

function doesDayMatch({data}){
  
}

function Promocardtest({data,searchValue}) {

  const { beneficio_cuotas, descripcion_descuento, tarjeta, producto, valido_hasta,local,dia_semanal } = data;

  const specialBoxes = evaluateDiaSemanal({data});

  const notABox = (specialBoxes==='not');

  const isSearchMatch = doesSearchMatch({data}, searchValue);

  if(!isSearchMatch) return <></>;
  else
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      shadow="md"
      bg="#F7F0F3"
      margin={10}
      flex="1"
    >
      <Text fontSize="2xl" fontWeight="bold">
        {beneficio_cuotas}
      </Text>

      <Divider my={2} borderBottom="1px solid #CCCCCC"/>

      <Text fontSize="md">
        {descripcion_descuento}
      </Text>

      <VStack align="start" mt={4} spacing={1}>
        <Text fontSize="sm" fontWeight="bold">
          Tarjeta:
        </Text>
        <Text fontSize="sm">{tarjeta}</Text>
        <Text fontSize="sm" fontWeight="bold">
          Local:
        </Text>
        <Text fontSize="sm">{local}</Text>
        <Text fontSize="sm" fontWeight="bold">
          Producto:
        </Text>
        <Text fontSize="sm">{producto}</Text>
      </VStack>

      <HStack mt={4} spacing={2}>
        <Text fontSize="sm">Valido hasta:</Text>
        <Text size="sm">{valido_hasta}</Text>
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
  );
}

export default Promocardtest;