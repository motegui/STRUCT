import React, { useState } from 'react';
import { Box, Link, Text, VStack ,Flex, Checkbox, Spacer, HStack, Button} from '@chakra-ui/react';
import { useSearch } from '../SearchContext';

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
    const { checkedCategories, updateCheckedCategories } = useSearch();

    const handleCheckboxChange = (categoryName) => {
    const updatedCategories = {
      ...checkedCategories,
      [categoryName]: !checkedCategories[categoryName],
    };

    // Update the context state with the new checkbox values
    updateCheckedCategories(updatedCategories);
  };

  const clearCategorySelection = () => {
    updateCheckedCategories({});
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
      height="190px"
    >
      <HStack alignItems="center" justifyContent="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
                Dias que aplica
              </Text>
        <Button
                size="sm"
                variant="ghost"
                onClick={clearCategorySelection}
                marginLeft="2"
                _hover={{ backgroundColor: 'pink.200' , color: 'black'}}
                color="gray.500"
                _active={{ color: 'black' }}
            > Limpiar
        </Button>
      </HStack>
     
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