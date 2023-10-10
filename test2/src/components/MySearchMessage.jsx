import { Box } from '@chakra-ui/react';

function MySearchMessage({ text }) {
  return (
    <Box
      bg="pink.100"
      p={2}
      borderRadius="md"
      textAlign="left"
      margin={3}
    >
      Mostrando resultados de busqueda para: {text} 
    </Box>
  );
}

export default MySearchMessage;