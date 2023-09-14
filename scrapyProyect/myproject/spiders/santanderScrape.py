import scrapy
from requests_html import HTMLSession
from scrapy_splash import SplashRequest
from selenium.webdriver import Chrome
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import re


# Create a ChromeOptions object and set the executable path
#chrome_options = webdriver.ChromeOptions()
#chrome_options.binary_location = 'C:\Program Files\Google\Chrome\Application\chrome.exe'


# Create a ChromeService object and pass the ChromeOptions
#chrome_service = ChromeService(executable_path=chrome_driver_path)

#chrome_driver_path = 'E:\ITBA4.0\Grado\Ingenieria de Software I\proyect\chromedriver'
#driver = webdriver.Chrome(path=chrome_driver_path)

# Initialize Chrome WebDriver with the manager
#driver = webdriver.Chrome(ChromeDriverManager(chrome_type="chrome", executable_path=chrome_binary_location).install())

# Initialize a Chrome WebDriver instance with the service and options
#driver = webdriver.Chrome(executable_path=chrome_driver_path)


#url = 'https://www.santander.com.ar/banco/online/personas/beneficios/beneficios-amex'
#s = HTMLSession()
#r = s.get(url)
#coto: https://www.cotodigital3.com.ar/sitios/cdigi/browse/ofertas-todas-las-ofertas/_/N-c7ha3p



class DiscountSpider(scrapy.Spider):
    name = 'discount'
    #start_urls = ['https://www.santander.com.ar/banco/online/espectaculos/lollapalooza-2024']  --> usado cuando no hay start_requests

    #config para no ser detectado como bot y bloqueado por el firewall
    custom_settings = {
        'USER_AGENT' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
    }

    #variable donde se guardan los resultados del scrape
    promociones = {}

    #extrae link de la promocion en particular y almacena en links[]
    def start_requests(self):
        options = Options()
        options.page_load_strategy = 'normal'
        options.binary_location = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
        options.chrome_driver_path = 'E:\ITBA4.0\Grado\Ingenieria de Software I\proyect\chromedriver'
        driver = webdriver.Chrome(options=options)
        driver.implicitly_wait(10)  #wait 10s
        driver.get('https://www.santander.com.ar/banco/online/personas/beneficios/beneficios-amex')

        #xpath al href donde se encuentra el link de la promo
        xpath='//*[@id="layoutContainers"]/div/div[2]/div/div[4]/section/div/div[2]/section[2]/div/div/div[1]/ul/*/a[@class="beneficioItem"]'
        link_elements = driver.find_elements(By.XPATH, xpath)
        
        for link_elem in link_elements:
            if link_elem is not None:
                href = link_elem.get_attribute("href")
                yield scrapy.Request(href)

        driver.quit()


    def parse(self, response):
        # Use XPath to extract the text of all elements
        content_html = str(response.body)
        '''
        # Define the start and end patterns
        start_pattern = "beneficiosWCM"
        end_pattern = "var"

        # Define the regular expression pattern to match the desired portion
        pattern = re.compile(re.escape(start_pattern) + "(.*?)" + re.escape(end_pattern), re.DOTALL)

        # Use re.findall to find all matching portions
        matches = re.findall(pattern, content_html)

        # Print the extracted portions
        for match in matches:
            print("Extracted Data:", match.strip())
        '''
        print(content_html)
        #beneficioWCM_start = content_html.xpath()
        #content_json = response.xpath('.//script[@type="text/javascript"]/text()').getall()
        #print(content_json)
        elements = response.xpath('//div[@id="stacksContainer"]')
        # Print the extracted elements
        for elem in elements: 
            if(elem != None):
                key = elem.xpath('.//div[@class="beneficioTitulo"]/h1/text()').get()
                self.promociones[key] = {   
                    "Discount" : elem.xpath('.//div[@class="beneficioBox"]/div[@class="titulo"]/h2/text()').getall(),
                    "ValidFromTo" : elem.xpath('.//div[@class="vigencia"]/p/text()').get(),
                    "AppliesTo" : elem.xpath('.//div[@class="aplica"]/ul/li/text()').getall()
                }
            else:
                print("None")
    
        

            
        
    
        


#del sitemap se podria parsear en busca de "oferta" o "promocion"
#de esa forma nos aseguramos de revisar todas las posibles pestañas disponibles de la pagina

#cosas para agregar:
#atributos como tope: alunas promos tienen tope de precio para los descuentos
#ejemplop: algunos descuentos tienen ejemplos en la seccion de legales