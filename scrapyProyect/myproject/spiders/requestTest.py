
import curlify
from seleniumwire import webdriver
import scrapy
from twisted.internet import reactor
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
import json
import datetime
from scrapy import Request
from supabase import create_client
from selenium.webdriver.chrome.options import Options
import logging

#set headless
#chrome_options = Options()
#chrome_options.add_argument("--headless")
options = {
    'connection_timeout': 10  # Timeout in seconds
}
# Create a new instance of the Firefox driver
driver = webdriver.Chrome(seleniumwire_options=options)

#configuracion de consola
logger = logging.getLogger('selenium.webdriver.remote.remote_connection')
logger.setLevel(logging.WARNING)

#supabase_url = "https://rkdpcpsryixjcglwqfaa.supabase.co"
#supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHBjcHNyeWl4amNnbHdxZmFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NDEwOTg2MCwiZXhwIjoyMDA5Njg1ODYwfQ.oUzvMvpkrEL7FRsQF5x0dWS5gf8f0rqKBNx7O8f8EmY"
#supabase = create_client(supabase_url, supabase_key)

promos = [{}]
class testScraper(scrapy.Spider):

    name = 'promo'
    custom_settings = {
    'USER_AGENT' : 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    
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
                
                
                print("##### GET REQUEST CAUGHT #####")
                print(selenium_request)
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

        #algunas get requests son de CSS y no de XML con info util, esos los skippeamos
        try:
            promociones = response.xpath('//atom:entry', namespaces=namespaces)
        except scrapy.exceptions.NotSupported:
            return
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

            #elementos que se encuentran separados en el backend 
            #pero deben mostrarse concatenados
            beneficio1 = promocion.xpath('.//wplc:field[@id="infobeneficiolinea1"]/text()', namespaces=namespaces).get()
            if beneficio1 == None:
                beneficio1 = ""
            beneficio2 = promocion.xpath('.//wplc:field[@id="infobeneficiolinea2"]/text()', namespaces=namespaces).get()
            if beneficio2 == None:
                beneficio2=""
            #por ahora todo santander, luego se van a separar segun el banco
            entry = {
                'tarjeta' : promocion.xpath('./wplc:field[@id="medios"]/text()', namespaces=namespaces).getall(),
                'local' : promocion.xpath('./wplc:field[@id="empresa"]/text()', namespaces=namespaces).get(),
                'producto' : title,
                'dia_semanal' : promocion.xpath('./wplc:field[@id="diabox"]/text()', namespaces=namespaces).getall(),
                'beneficio_cuotas' : beneficio1 + ' ' + beneficio2,
                'valido_hasta' : "{}".format(end_date) or None,
                'valido_desde' : "{}".format(start_date) or None,
                'descripcion_descuento' : promocion.xpath('./wplc:field[@id="description"]/text()', namespaces=namespaces).get(),
            }
            #se guarda cada entry en la lista de entries
            promos.append(entry)

#configuracion de console log
#configure_logging({"LOG_FORMAT": "%(levelname)s: %(message)s"})

#instancia para correr spiders dentro del script
runner = CrawlerRunner()
d = runner.crawl(testScraper)

#callback para detener el reactor creado para poder correr la spider
d.addBoth(lambda _: reactor.stop())
reactor.run()  # the script will block here until the crawling is finished

print(promos)
#inserta resultados en un archivo JSON
file_path = "dict.json"
mydict = {{}}
count = 1
for prom in promos:
    mydict[count] = prom
    count+=1
print(mydict)
with open(file_path, "w", encoding="utf-8") as json_file:
    json.dump(promos, json_file, ensure_ascii=False)
