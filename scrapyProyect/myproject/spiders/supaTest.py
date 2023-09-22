from supabase import create_client
import json
supabase_url = "https://rkdpcpsryixjcglwqfaa.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHBjcHNyeWl4amNnbHdxZmFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NDEwOTg2MCwiZXhwIjoyMDA5Njg1ODYwfQ.oUzvMvpkrEL7FRsQF5x0dWS5gf8f0rqKBNx7O8f8EmY"
supabase = create_client(supabase_url, supabase_key)
table_name = "TEST"

data = {
    "test":"Germany" 
}

#para subir datos a la base armo lista de diccionarios
#cada entrada en la lista es una fila de la base (segun chatgtp)
dict = [
{
    'test' : "saractung-a",
    'test2' : "2022-09-22 13:19:17"
}, 
{
    'test' : "saracatungav2",
    'test2' : "2022-09-22 13:19:16",
},
{
    'test' : "SARACAFIUMBA",
    'test2' : "2022-09-22 13:19:18",
}
]
response = supabase.table("TEST").insert(dict).execute()



