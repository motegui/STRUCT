import React, { useState , useEffect} from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { supabase } from '../supabase';
import { useSearch } from '../SearchContext';
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUserEmail , userEmail} = useSearch();
  const navi = useNavigate();

  useEffect(() => {
    setUserEmail(email);
  }, [email, setUserEmail]);

  const handleSignUp = async () => {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error(error.message);
      } else {
        console.log('Registered as', user);
        setUserEmail(email);

        const { data, error } = await supabase
        .from('USUARIO')
        .insert([
          {
            Email: email,
            nombre: firstName,
            apellido: lastName,
          },
        ]);

        if (error) {
          console.error('Error storing user information:', error.message);
        } else {
          console.log('User information stored successfully:', data);
          navi("../pages/MyWaitingVerificationEmail");
        }
      }
  };


  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg="#F7F0F3">
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Registrese
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            disfrute de una experienza más personalizada  
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Apellido</FormLabel>
                  <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'pink.400'}
                color={'white'}
                _hover={{
                    bg: 'pink.300',
                }}
                onClick={handleSignUp}
                >
                Registrarse
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Ya tiene cuenta? <Link href="../pages/MySignin" color={'pink.300'}>Iniciar Sesión</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}