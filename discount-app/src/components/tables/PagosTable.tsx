import React from 'react'
import {Box} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://rkdpcpsryixjcglwqfaa.supabase.co', process.env.REACT_APP_SUPABASE_TOKEN || '');


let { data: rows, error } = await supabase
  .from('PAGO')
  .select('*')

export default function PagosTable() {
    const cols: GridColDef[] = [
        {
          field: 'id',
          headerName: 'ID',
          width: 150,
        },
        {
          field: 'nombre',
          headerName: 'Nombre',
          width: 150,
        },
        {
          field: 'tipo',
          headerName: 'Tipo',
          width: 150,
        },
      ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows ?? []}
        columns={cols}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
