import React from 'react';
import { Box, Link, Text, VStack ,Flex} from '@chakra-ui/react';

import Icon from '@mdi/react';
import { mdiSilverwareForkKnife } from '@mdi/js';
import { mdiCartVariant } from '@mdi/js';
import { mdiFuel } from '@mdi/js';
import { mdiTshirtCrew } from '@mdi/js';
import { mdiCellphoneLink } from '@mdi/js';
import { mdiHospitalBox } from '@mdi/js';
import { mdiTelevisionClassic } from '@mdi/js';

const categories = [
  { name: 'Restaurantes', link: '/category1' ,icon: <Icon path={mdiSilverwareForkKnife} size={1} />},
  { name: 'Supermercados', link: '/category2' ,icon: <Icon path={mdiCartVariant} size={1} />},
  { name: 'Gasolineras', link: '/category3' ,icon: <Icon path={mdiFuel} size={1} />},
  { name: 'Indumentaria', link: '/category4' ,icon: <Icon path={mdiTshirtCrew} size={1} />},
  { name: 'Tecnología', link: '/category5' ,icon: <Icon path={mdiCellphoneLink} size={1} />},
  { name: 'Farmacias', link: '/category6' ,icon: <Icon path={mdiHospitalBox} size={1} />},
  { name: 'Entretenimiento', link: '/category7' ,icon: <Icon path={mdiTelevisionClassic} size={1} />},
  // Add more categories as needed
];

function Categorycard() {
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
      {/*}<Text fontSize="lg" fontWeight="bold" mb={4}>
        Categories
  </Text>{*/}
      <VStack align="start" spacing={2}>
        {categories.map((category) => (
          <Flex key={category.name} alignItems="center">
            <Box mr={2}>{category.icon}</Box>
            <Link href={category.link} fontSize="md">
              {category.name}
            </Link>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

export default Categorycard;