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
import { useSearch } from '../SearchContext';
import { supabase } from '../supabase';
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserEmail , userEmail} = useSearch();
  const { setUserName , userName} = useSearch();
  const [errorMessage, setErrorMessage] = useState('');
  const navi = useNavigate();

  useEffect(() => {
    setUserEmail(email);
  }, [email, setUserEmail]);

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
        console.log('Signed in as', user);
        const name = await getName(email);
        setUserName(name);
        console.log('name', userName);
        console.log({ userEmail });
        setErrorMessage(''); //
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        navi('/');
        
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  async function getName(email){
    const { data, error } = await supabase
    .from('USUARIO')
    .select('nombre')
    .eq('Email', email)
    .single();

  if (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }

  
  if (data) {
    return data.nombre;
  } else {
    // Email not found
    return null;
  }
}

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg="#F7F0F3">
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
            <Stack pt={6}>
              <Text align={'center'}>
                No tiene cuenta? <Link href="../pages/MySignup" color={'pink.300'}>Registrarse</Link>
              </Text>
            </Stack>
              <Button
              type="submit"
                bg={'pink.400'}
                color={'white'}
                _hover={{
                  bg: 'pink.300',
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