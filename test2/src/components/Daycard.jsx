import React, { useState } from 'react';
import { Box, Link, Text, VStack ,Flex, Checkbox, Spacer, HStack} from '@chakra-ui/react';
import { useSearch } from './SearchContext';

const categories = [
  { name: 'Lunes',},
  { name: 'Martes',},
  { name: 'Miércoles',},
  { name: 'Jueves',},
  { name: 'Viernes',},
  { name: 'Sabado',},
  { name: 'Domingo',},
];

function Daycard() {

    const [checkedCategories, setCheckedCategories] = useState({
      Lunes: true,
      Martes: true,
      Miércoles: true,
      Jueves: true,
      Viernes: true,
      Sabado: true,
      Domingo: true,
    });

    const handleCheckboxChange = (categoryName) => {
        setCheckedCategories((prevCheckedCategories) => ({
          ...prevCheckedCategories,
          [categoryName]: !prevCheckedCategories[categoryName],
        }));
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
        Dias que aplica
      </Text>
      {categories.map((category) => (
            <Flex key={category.name}>
                <Text fontSize="md" ml={2}>
                    {category.name}
                </Text>
                <Spacer />
                <Checkbox
                    isChecked={checkedCategories[category.name]}
                    onChange={() => handleCheckboxChange(category.name)}
                    size="md"
                    colorScheme="gray"
                    border="#CCCCCC"
                    mr={2}
                />
            </Flex>
        ))}      
    </Box>
  );
}

export default Daycard;