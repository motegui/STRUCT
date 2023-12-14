import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    Input,
  } from '@chakra-ui/react'
  import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
  } from '@chakra-ui/icons'
  import { Link } from 'react-router-dom';
  
  import { useSearch } from '../SearchContext';
  import {supabase} from '../supabase';
  import { useNavigate } from "react-router-dom";
  
  export default function NavBar() {
    const { isOpen, onToggle } = useDisclosure();
    const { searchValue, setSearchValue , userName, setUserName, setUserEmail, userEmail} = useSearch();
    const navi = useNavigate();
  
    const handleInputChange = (event) => {
      setSearchValue(event.target.value); 
    };
  
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
        setUserName(''); 
        setUserEmail(''); 
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        navi("/");
        
      } catch (error) {
        console.error('Error logging out:', error);
        
      }
    };
  
    return (
      <Box alignItems={'center'} justifyContent={'center'}>
        <Flex
          bg="#F7F0F3"
          color={useColorModeValue('gray.600', 'white')}
          minH={'30px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}>
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}>
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <HomeLink />
  
          <Box flex={1} display="flex" alignItems="center">
          
          </Box>
  
          <Stack
            flex={{ base: 1, md: 0 } }
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            ml={10}>
  
            {userName ? (
              <>
              <Text whiteSpace="nowrap">Saludos, {userName}!</Text>
              <Button as={Link}
              to="/"
              fontSize={'sm'} fontWeight={400} variant={'link'} href={'#'} onClick={handleLogout}>
              Cerrar Sesión
            </Button>
              </>
            ) : (
              <>
              <Button as={Link}
              to="../pages/MySignin"
              fontSize={'sm'} fontWeight={400} variant={'link'} href={'#'} 
              >
              Iniciar Sesión
            </Button>
            <Button
              as={Link}
              to="../pages/MySignup"
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'pink.400'}
              href={'#'}
              _hover={{
                bg: 'pink.300',
              }}>
              Registrarse
            </Button>
              </>
            )
            }
          </Stack>
        </Flex>
      </Box>
    )
  }
  
  const HomeLink = () => {
    return (
      <Box p={2}>
        <Button
          as={Link}
          to="/"
          fontSize={'sm'}
          fontWeight={400}
          _hover={{
            bg: 'pink.300',
          }}
        >
          Home
        </Button>
      </Box>
    );
  };
  