//tira un warning en consola al agregarlo en App.jsx, pero no logre identificar que es lo que lo dispara.
//Debe ser algo de compatibilidad entre ChakraUI y las versiones del REACT(?)s

import React from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Signin() {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg="#F7F0F3">
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Inicie Sesión</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Contraseña</FormLabel>
              <Input type="password" />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Recordarme</Checkbox>
                <Text color={'pink.400'}>Olvidó su contraseña?</Text>
              </Stack>
              <Button
                bg={'pink.400'}
                color={'white'}
                _hover={{
                  bg: 'pink.300',
                }}>
                Ingresar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}