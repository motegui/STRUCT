//tira un warning en consola al agregarlo en App.jsx, pero no logre identificar que es lo que lo dispara.
//Debe ser algo de compatibilidad entre ChakraUI y las versiones del REACT(?)s

import React, {useState, useEffect} from 'react';
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
  Link,
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom";
const supabase = createClient('https://rkdpcpsryixjcglwqfaa.supabase.co', process.env.REACT_APP_SUPABASE_TOKEN || '');

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); //Para que funque el enter
    handleSignIn();
  };

  const handleSignIn = async () => {
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage('Email o contraseña invalidos');
        console.error(error.message);
      } else {
        const Admin = await isAdmin(email);
        if (Admin == true) { 
          setErrorMessage(''); //
          localStorage.setItem("discountIsLoggedIn", true);
          window.location.reload();
        } else {
          setErrorMessage('No tiene permisos para ingresar');
        }
        
        
        
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  async function isAdmin(email){
    const { data, error } = await supabase
    .from('USUARIO')
    .select('isAdmin')
    .eq('Email', email) 

  if (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }

  
  return data[0].isAdmin
}

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg="#E3EFFF">
      <form onSubmit={handleSubmit}>
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
              <Input type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Contraseña</FormLabel>
              <Input type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            {errorMessage && (
            <Text color="red.500" textAlign="center">
              {errorMessage}
            </Text>
          )}
            <Stack spacing={10}>
              <Button
              type="submit"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.300',
                }}
                onClick={handleSignIn}
                >
                Ingresar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      </form>
    </Flex>
  );
}