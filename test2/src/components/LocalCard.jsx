import React, { useState , useEffect} from 'react';
import { Box, Text, Select, Button, HStack, Center, Spacer} from '@chakra-ui/react';
import { useSearch } from '../SearchContext';
import { supabase } from '../supabase';

function LocalCard() {
    const [localNames, setLocalNames] = useState([]);
    const { selectedLocal, setSelectedLocal } = useSearch();

    const fetchLocalNames = async () => {
        const { data, error } = await supabase.from('LOCAL').select('id');
        if (error) {
          console.error('Error fetching local names:', error);
          setLocalNames([]);
        }
        setLocalNames(data.map((row) => row.id));
        setLocalNames(localNames.slice().sort());
      };

    useEffect(() => {
        fetchLocalNames();
    }, []);

    const handleLocalSelection = (event) => {
        setSelectedLocal([event.target.value]);
      };

    const clearSelection = (event) => {
      setSelectedLocal([""]);
    };

      return (
        <Box
      width="250px"
      bg="#F7F0F3"
      p={4}
      boxShadow="md"
      borderRadius="md"
      margin="10"
      maxWidth="200px"
      height="100px"
    >
        <HStack alignItems="center" justifyContent="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="bold" >
            Locales
            </Text>
            <Button
                size="sm"
                variant="ghost"
                onClick={clearSelection}
                marginLeft="2"
                _hover={{ backgroundColor: 'pink.200' , color: 'black'}}
                color="gray.500"
                _active={{ color: 'black' }}
            > Limpiar
        </Button>
        </HStack>
      
      <Select
        size="md"
        value={selectedLocal}
        onChange={handleLocalSelection}
        focusBorderColor="pink.300"
      >
        <option value="" disabled>
          Seleccione un local
        </option>
        {localNames.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </Select>
    </Box>
  );
}

export default LocalCard;