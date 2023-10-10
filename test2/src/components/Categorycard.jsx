import React from 'react';
import { Box, Link, Text, VStack ,Flex, Checkbox, Spacer} from '@chakra-ui/react';
import { useSearch } from '../SearchContext';


function Categorycard() {
  const { showOnlyFavourites, updateShowOnlyFavourites } = useSearch();

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
        <Flex>
          <Text>favsOnly</Text>
          <Spacer/>
          <Checkbox 
                    size="md"
                    colorScheme="gray"
                    border="#CCCCCC"
                    mr={2}
                    isChecked={showOnlyFavourites}
                    onChange={() => updateShowOnlyFavourites(!showOnlyFavourites)}
                    />
        </Flex>
    </Box>
  );
}

export default Categorycard;