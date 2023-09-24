import {
    Box,
    Flex,
    Avatar,
    Text,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
  } from '@chakra-ui/react'

import MyIcon from '@mui/icons-material/Discount';
  
const NavLink = (props) => {
    const { children } = props;
  
    return (
      <Box
        as="a"
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}>
        {children}
      </Box>
    );
  };
  
  export default function Mainnavbar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <Box bg="#F4BBD3" px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'center'}>
          <MyIcon />
            <Box ml={2} fontWeight="bold" className="my-title-text">Struct</Box>
          </Flex>
        </Box>
      </>
    );
  }