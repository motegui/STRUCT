
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

#set headless
#chrome_options = Options()
#chrome_options.add_argument("--headless")
options = {
    'connection_timeout': 10  # Timeout in seconds
}
# Create a new instance of the Firefox driver
driver = webdriver.Chrome(seleniumwire_options=options)


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

    #contador de paginacion
    pag = 1
    

    
    #retorna iterable de Requests, o un generador con yield
    def start_requests(self):
        urls = ['https://www.santander.com.ar/banco/online/personas/beneficios/compras']
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    #maneja cada request realizada
    #response: "texto" con el contenido de la pagina
    def parse(self, response):
        curl_commands = []
        print("THE URL: "+ response.url)
        url_to_get = response.url

        # Navigate to a website
        driver.get(url_to_get)

        # Get the requests made by the browser
        '''selenium_requests = driver.requests
        for selenium_request in selenium_requests:
            if selenium_request.response and selenium_request.method=='GET':    #solo guardo las get request
                curl_commands.append(curlify.to_curl(selenium_request))'''
        #header de request para pagina 1
        
        #realiza requests de 1 a 11
        for curl_command in curl_commands: 
            request = Request.from_curl(curl_command=curl_command, callback=self.handle_content)
            yield request  


#configuracion de console log
configure_logging({"LOG_FORMAT": "%(levelname)s: %(message)s"})

#instancia para correr spiders dentro del script
runner = CrawlerRunner()
d = runner.crawl(testScraper)

#callback para detener el reactor creado para poder correr la spider
d.addBoth(lambda _: reactor.stop())
reactor.run()  # the script will block here until the crawling is finished

#inserta resultados en un archivo JSON
file_path = "dict.json"
with open(file_path, "w", encoding="utf-8") as json_file:
    json.dump(promos, json_file, ensure_ascii=False)
