import React from 'react'
import {Box} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://rkdpcpsryixjcglwqfaa.supabase.co', process.env.REACT_APP_SUPABASE_TOKEN || '')


let { data: rows, error } = await supabase
  .from('DESCUENTO')
  .select('*')

export default function DescuentosTable() {
    const cols: GridColDef[] = [
        {
          field: 'tarjeta',
          headerName: 'Tarjetas',
          width: 150,
        },
        {
          field: 'local',
          headerName: 'Local',
          width: 150,
        },
        {
          field: 'dia_semanal',
          headerName: 'Dias',
          width: 150,
        },
        {
          field: 'descripcion_descuento',
          headerName: 'Descuento',
          width: 150,
        },
        {
          field: 'valido_hasta',
          headerName: 'Validez hasta',
          width: 150,
        },
        {
          field: 'valido_desde',
          headerName: 'Validez desde',
          width: 150,
        },
      ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid getRowHeight={() => 'auto'}
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
