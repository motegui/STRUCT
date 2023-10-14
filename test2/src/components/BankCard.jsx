import React, { useState , useEffect} from 'react';
import { Box, Link, Text, VStack ,Flex, Checkbox, Spacer, HStack} from '@chakra-ui/react';
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
            console.log('data',data);
        setBankNames(data.map((row) => row.nombre));
        console.log("banknombre",bankNames);
    }


    useEffect(() => {
        fetchBanksNames();
    }, []);

    const handleBankSelection = (event) => {
        const bank = event.target.value;
    
        if (selectedBanks.includes(bank)) {
          // Remove the bank if it's already selected
          setSelectedBanks(selectedBanks.filter((selected) => selected !== bank));
        } else {
          // Add the bank to the selectedBanks array
          setSelectedBanks([...selectedBanks, bank]);
        }
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
    >
     <Text fontSize="lg" fontWeight="bold" mb={4}>
        Bancos
      </Text>
      {bankNames.map((bank) => (
            <Flex key={bank}>
                <Text fontSize="md" ml={2}>
                    {bank}
                </Text>
                <Spacer />
                <Checkbox
                    isChecked={selectedBanks.includes(bank)}
                    onChange={(event) => handleBankSelection(event)}
                    size="md"
                    colorScheme="gray"
                    border="#CCCCCC"
                    value={bank}
                    mr={2}
                />
            </Flex>
        ))}      
    </Box>
      );
    }

export default BankCard;