import { Box, Heading, Text } from '@chakra-ui/react'
import { WarningTwoIcon } from '@chakra-ui/icons'

export default function MyError() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <WarningTwoIcon boxSize={'50px'} color={'orange.300'} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Error 404: Not found
      </Heading>
      <Text color={'gray.500'}>
        No se pudo acceder a la página solicitada.
      </Text>
    </Box>
  )
}