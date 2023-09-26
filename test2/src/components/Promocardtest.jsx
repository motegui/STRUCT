
import {
  Box,
  Divider,
  Text,
  VStack,
  HStack,
  Flex,
} from '@chakra-ui/react';

function Promocardtest({data}) {

  const { beneficio_cuotas, descripcion_descuento, tarjeta, producto, valido_hasta,local } = data;

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

      <Flex className="days-available" justifyContent={"right"}>
        <Box bg="#F7F0F3" 
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">L</Box>
        <Box bg="#F7F0F3" 
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">Ma</Box>
        <Box bg="#CCCCCC" 
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">Mi</Box>
        <Box bg="#CCCCCC" 
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">J</Box>
        <Box bg="#F7F0F3" 
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">V</Box>
        <Box bg="#F7F0F3" 
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">S</Box>
        <Box bg="#F7F0F3" 
        border="1px solid #CCCCCC" 
        borderRadius="2px" 
        width="25px" 
        height="25px" 
        margin="2px"
        display="flex"
        justifyContent="center"
        alignItems="center">D</Box>
      </Flex>
    </Box>
  );
}

export default Promocardtest;