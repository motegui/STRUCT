//hay un warning por tema de que selectedBanks es array en vez de un singlevalue

import React, { useState , useEffect} from 'react';
import { Box, Text, Select, Button, HStack, Center, Spacer} from '@chakra-ui/react';
import { useSearch } from '../SearchContext';
import { supabase } from '../supabase';

function BankCard() {
    const [bankNames, setBankNames] = useState([]);
    const { selectedBanks, setSelectedBanks } = useSearch();

    const fetchBanksNames = async () => {
        const { data, error } = await supabase.from('BANCO').select('nombre');
        if (error) {
          console.error('Error fetching bank names:', error);
          setBankNames([]);
        }
        setBankNames(data.map((row) => row.nombre));
      };

    useEffect(() => {
        fetchBanksNames();
    }, []);

    const handleBankSelection = (event) => {
        setSelectedBanks([event.target.value]);
      };

    const clearSelection = (event) => {
      setSelectedBanks([""]);
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
            Bancos
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
        value={selectedBanks}
        onChange={handleBankSelection}
        focusBorderColor="pink.300"
      >
        <option value="" disabled>
          Seleccione un banco
        </option>
        {bankNames.map((bank) => (
          <option key={bank} value={bank}>
            {bank}
          </option>
        ))}
      </Select>
    </Box>
  );
}

export default BankCard;