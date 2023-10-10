import { Center, Heading } from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import {
  Button,
  FormControl,
  Flex,
  Input,
  Stack,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react'

import { useSearch } from '../SearchContext';


export default function VerifyEmailForm() {
    const { userEmail} = useSearch();

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg="#F7F0F3">
      <Stack
        spacing={4}
        w={'full'}
        maxW={'sm'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={10}>
        <Center>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Cuenta creada!
          </Heading>
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}>
          Recuerde verificar su correo electrónico para acceder
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}>
          Enviado a {userEmail}
        </Center>
        <Stack spacing={6}>
          <Button
          as={Link}
          to="/"
            bg={'pink.400'}
            color={'white'}
            _hover={{
              bg: 'pink.300',
            }}>
            Regresar
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}