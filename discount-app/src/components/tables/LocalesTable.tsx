import React from 'react'
import {Box} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://rkdpcpsryixjcglwqfaa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHBjcHNyeWl4amNnbHdxZmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQxMDk4NjAsImV4cCI6MjAwOTY4NTg2MH0.k1K1cSMSTg1L1zRhO9lllu72IGfl1UtRy88FJhahpxY')


let { data: rows, error } = await supabase
  .from('LOCAL')
  .select('*')

export default function LocalesTable() {
    const cols: GridColDef[] = [
        {
          field: 'id',
          headerName: 'Nombre',
          width: 150 ,
        },
        {
          field: 'sede',
          headerName: 'Sede',
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
