
import { createClient } from "https://esm.sh/@supabase/supabase-js"
const supabaseUrl = 'https://rkdpcpsryixjcglwqfaa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHBjcHNyeWl4amNnbHdxZmFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NDEwOTg2MCwiZXhwIjoyMDA5Njg1ODYwfQ.oUzvMvpkrEL7FRsQF5x0dWS5gf8f0rqKBNx7O8f8EmY';
const supabase = createClient(supabaseUrl, supabaseKey);

let { data: LOCAL, errorLOCAL } = await supabase
  .from('LOCAL')
  .select('*')

let outLOCAL = "";

LOCAL.forEach(row => {
    outLOCAL += `
        <tr>
            <td>${row.nombre}</td>
            <td>${row.tipo}</td>
            <td>${row.sede}</td>

        </tr>
    
    `
});

document.getElementById("locales-data-output").innerHTML = outLOCAL;


let { data: TARJETA, errorTARJETA } = await supabase
  .from('TARJETA')
  .select('*')

let outTARJETA = "";

TARJETA.forEach(row => {
    outTARJETA += `
        <tr>
            <td>${row.nombre_banco}</td>
            <td>${row.nombre_tarjeta}</td>
            <td>${row.pago_asociado}</td>

        </tr>
    
    `
});

document.getElementById("tarjetas-data-output").innerHTML = outTARJETA;
