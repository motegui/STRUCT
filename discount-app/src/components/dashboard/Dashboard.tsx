import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { Button, ButtonGroup } from '@mui/material';
import DescuentosTable from '../tables/DescuentosTable';
import LocalesTable from '../tables/LocalesTable';
import PagosTable from '../tables/PagosTable';
import $ from 'jquery'


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

const Dashboard = (props) => {

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  async function runScript() {
    
    $.ajax({
      type: 'POST',
      url: new URL("./promoScraper.py", import.meta.url).href,
  }).done( (data) => {alert(data)});
  }

  const allTables = [
    {table: <DescuentosTable />, name: 'Descuentos'},
    {table: <LocalesTable />, name: 'Locales'},
    {table: <PagosTable />, name: 'Pagos'}
  ];

  const [tables, changeTable] = React.useState(allTables[0]);

    return ( 
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div role="presentation" onClick={handleClick}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              href="/"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Main Dashboard
            </Link>
          </Breadcrumbs>
        </div>
      
        
        <ButtonGroup sx={{ marginBottom: '20px', marginTop: '20px' }} fullWidth variant="outlined" aria-label="outlined button group">
          {allTables.map((table, index) => (
            <Button key={index} onClick={() => {
              changeTable(allTables[index]);
            }}>{table.name}</Button>
          ))}
        </ButtonGroup>
        {tables.table};
        {props.content}
      </Box>
     );
}
 
export default Dashboard;