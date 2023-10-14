import scrapy
from twisted.internet import reactor
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
import json
import datetime
from scrapy import Request
from supabase import create_client
import curlify
from selenium.webdriver.common.by import By
from seleniumwire import webdriver
from selenium.webdriver.chrome.options import Options
import logging
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


supabase_url = "https://rkdpcpsryixjcglwqfaa.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHBjcHNyeWl4amNnbHdxZmFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NDEwOTg2MCwiZXhwIjoyMDA5Njg1ODYwfQ.oUzvMvpkrEL7FRsQF5x0dWS5gf8f0rqKBNx7O8f8EmY"
supabase = create_client(supabase_url, supabase_key)

options = {
    'connection_timeout': 10  # Timeout in seconds
}
# Create a new instance of the Chrome driver
driver = webdriver.Chrome(seleniumwire_options=options)

#configuracion de consola
#logger = logging.getLogger('selenium.webdriver.remote.remote_connection')
#logger.setLevel(logging.WARNING)

promos = [{}]
class promoScraper(scrapy.Spider):

    name = 'promo'
    custom_settings = {
    'USER_AGENT' : 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'DOWNLOAD_DELAY' :  2.5
    }
    #meter esta opcion en settings para evitar baneos
    #'DOWNLOAD_DELAY' :  2.5,

    #retorna iterable de Requests, o un generador con yield
    def start_requests(self):
        urls = ['https://www.santander.com.ar/banco/online/personas/beneficios/compras']
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    #maneja cada request realizada
    #response: "texto" con el contenido de la pagina
    def parse(self, response):
        
        curl_commands = []
        url_to_get = response.url

        # Navigate to a website
        driver.get(url_to_get)

        # Get the requests made by the browser
        selenium_requests = driver.requests
        for selenium_request in selenium_requests:
            if selenium_request.response and selenium_request.method=='GET' and 'contenthandler' in selenium_request.url and not 'scopes' in selenium_request.url:    
                #solo se guardan las get request
                #unicamente se parsean las url que contienen "contenthandler" pero no "scopes"
                curl_commands.append(curlify.to_curl(selenium_request))
 

        #le pasa cada request al metodo handle
        for curl_command in curl_commands: 
            request = Request.from_curl(curl_command=curl_command, callback=self.handle_content)
            yield request

    def handle_content(self, response):
        namespaces = {
        'atom': 'http://www.w3.org/2005/Atom',
        'wplc': 'http://www.ibm.com/wplc/atom/1.0'  # Replace with the actual WPLC namespace URI
        }
        try:
            promociones = response.xpath('//atom:entry', namespaces=namespaces)
        except scrapy.exceptions.NotSupported:
            return
        
        tarjetas_todas = []
        imgbanco = '/banco/contenthandler/!ut/p/digest!XzWpHd4WWNGJyUWtkUvndg/dav/fs-type1/themes/SRP9Theme/images/layout/logo/santander-mobile.png'
        desc_con_todas = []

        for promocion in promociones:
            title = promocion.xpath('./atom:title/text()', namespaces=namespaces).get()
            if title == None:
                pass

            #la fecha esta en millis, la paso a utc
            start_timestamp = promocion.xpath('./wplc:field[@id="publishdate"]/text()', namespaces=namespaces).get()
            if(start_timestamp!=None):
                start_date = datetime.datetime.utcfromtimestamp(int(start_timestamp)/1000)
            else:
                start_date = "None"
            end_timestamp = promocion.xpath('./wplc:field[@id="expirationdate"]/text()', namespaces=namespaces).get()
            if(end_timestamp!=None):
                end_date = datetime.datetime.utcfromtimestamp(int(end_timestamp)/1000)
            else:
                end_date = "None"            

            #por ahora todo santander, luego se van a separar segun el banco
            #imagen del descuento actual
            imagen = promocion.xpath('./wplc:field[@id="imagenxsell"]/text()', namespaces=namespaces).get()
            #hardcodeado
            #hay que usar la url y strippearlo para que coincida con el formato necesario
            url_banco = "https://www.santander.com.ar"
            imglocal = url_banco + imagen

            #elementos que se encuentran separados en el backend 
            #pero deben mostrarse concatenados
            beneficio1 = promocion.xpath('.//wplc:field[@id="infobeneficiolinea1"]/text()', namespaces=namespaces).get()
            if beneficio1 == None:
                beneficio1 = ""
            beneficio2 = promocion.xpath('.//wplc:field[@id="infobeneficiolinea2"]/text()', namespaces=namespaces).get()
            if beneficio2 == None:
                beneficio2=""

            tarjetas = promocion.xpath('./wplc:field[@id="medios"]/text()', namespaces=namespaces).getall()
            if not tarjetas:
                tarjetas = ["TODAS"]

            local = promocion.xpath('./wplc:field[@id="empresa"]/text()', namespaces=namespaces).get()
            #por ahora todo santander, luego se van a separar segun el banco
            entry = {
                'banco' : 'Santander',
                'tarjeta' : tarjetas,
                'local' : local,
                'titulo' : title,
                'dia_semanal' : promocion.xpath('./wplc:field[@id="diabox"]/text()', namespaces=namespaces).getall(),
                'beneficio' : beneficio1 + ' ' + beneficio2,
                'valido_hasta' : "{}".format(end_date) or None,
                'valido_desde' : "{}".format(start_date) or None,
                'descripcion_descuento' : promocion.xpath('./wplc:field[@id="description"]/text()', namespaces=namespaces).get(),
                'img_local' : imglocal,
            }
            #se guarda cada entry en la lista de entries
            promos.append(entry)
            
            localEntry = {
                'id' : local,
                'sede' : None,
                'categoria' : promocion.xpath('./wplc:field[@id="rubro"]/text()', namespaces=namespaces).getall(),
            }

            try:
                #se mete cada entry en supabase
                data, count = supabase.table("DESCUENTO").insert(entry).execute()
                print("DATA: "+data)
                supabase.table("LOCAL").insert(localEntry).execute()
            except:
                print("#####LA VAINA EXCEPCIONAL#####")
            if data:
                records = data[1]
                for record in records:
                    # Check if record is a dictionary
                    if isinstance(record, dict):
                        # Print the 'id' attribute of each dictionary
                        id = record["id"]
                
                #print(f'ID: {record["id"]}')
                #print(f'ENTRY: {entry}')
            


            if tarjetas == ["TODAS"]:
                desc_con_todas.append("####EL VERDADERO ID PAPASITO####")
            else:
                set1=set(tarjetas)
                set2=set(tarjetas_todas)
                set_result=set1.union(set2)
                tarjetas_todas=list(set_result)
                print("######TODAS LAS TARJETAS############")
                print(tarjetas_todas)
            

            for tarjeta in tarjetas:
                data, count = supabase.table("TARJETA").select('descuentos').eq('nombre', tarjeta).execute()
                descuentos = data[1]
                print("######DESCUENTOS: ")
                print(descuentos)
                array = []
                for descuento in descuentos:
                    if isinstance(descuento, dict):
                        array.append(descuento["descuentos"])
                if id:
                    print(f"#############EL VERDADERO ID: {id}")
                    array.append(id)
                    print("####EL ARRAY MISTICO:")
                    print(array)
                    supabase.table('TARJETA').upsert({'nombre':tarjeta, 'descuentos':array}).execute()

        #supabase.table('BANCO').insert({'nombre':'Santander', 'imagen':(url_banco+imgbanco), 'tarjetas':tarjetas_todas}).execute()

        #ESTA LINEA ESTA AFUERA DEL FOR (o deberia)
        '''pagenbr=2
        next_page = driver.find_element(By.XPATH, f'//div[@class="pager"]/a[@data-page="{pagenbr}"]').get_attribute('href')
        
        pagenbr+=1
        print("next: " +next_page)
        print("first: " +first_page)'''

        '''#la ultima pagina loopea otra vez a la primera, chequeo que no sea la proxima la primera
        #osea que no este en la ultima pagina, en ese caso termino el parseo de la paginacion
        if(next_page!=first_page):
            print("####NEXT FOUND#####")
            #yield scrapy.Request(url=next_page, callback=self.parse)
        #si no existe debe terminar la cadena de ejecucion de metodos, simplemente retorno
        else:
            return'''
        
        #PAGINACION 
        '''try:
            elem = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//div[@class="pager"]/a[@data-nav="next"]'))
            )
            elem.click()
            current_url = driver.current_url    #testea si paso de la ultima pagina a la primera
            next_button_status = driver.find_element(By.XPATH, '//div[@class="pager"]/a[@data-nav="next"]').get_attribute('class')
            if(next_button_status=="inactive"):
                driver.close()
                return
            else:
                print("####EXITO###########")
                yield scrapy.Request(url=current_url, callback=self.parse)
        except:
            pass'''
            


    #def close(self, reason):


#configuracion de console log
#configure_logging({"LOG_FORMAT": "%(levelname)s: %(message)s"})

#instancia para correr spiders dentro del script
runner = CrawlerRunner()
d = runner.crawl(promoScraper)

#callback para detener el reactor creado para poder correr la spider
d.addBoth(lambda _: reactor.stop())
reactor.run()  # the script will block here until the crawling is finished

#inserta resultados en un archivo JSON
file_path = "dict.json"
with open(file_path, "w", encoding="utf-8") as json_file:
    json.dump(promos, json_file, ensure_ascii=False)



