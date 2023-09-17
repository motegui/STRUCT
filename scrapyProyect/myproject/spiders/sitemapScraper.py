import scrapy
from twisted.internet import reactor
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
import json

local = {}
descuento = {}
tarjeta = {}

class discountBaneSpider(scrapy.spiders.SitemapSpider):
    name = 'sitemaper'
    custom_settings = {
    'USER_AGENT' : 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    
    }
    #meter esta opcion en settings para evitar baneos
    #'DOWNLOAD_DELAY' :  2.5,

    sitemap_urls = ['https://www.santander.com.ar/Sitemap/sitemap.xml',
                    'https://www.bna.com.ar/sitemap.xml']


    #'https://santander.com.ar/api/sitemap/productos',
    #'https://www.santander.com.ar/api/sitemap/shopping']
    #parece que entra a los links del sitemap automaticamente

    #atributo que define los url a scrapear
    #RULE: solo aquellos url que contienen el string mencionado
    sitemap_follow = ['oferta', 'descuento', 'promo', 'beneficio']

    #atributo que define que metodo utilizar para parsear cada elemento
    #POSIBLES USOS:
    #FILTRAR POR TIPO DE ELEMENTO---->ofertas para comedores, productos, etc, 
    #variando en cada uno el parseo realizado
    #lista de tuplas
    sitemap_rules = [
        ('descuentos', 'parse_descuento'),
        ('ofertas', 'parse_descuento'),
        ('promo', 'parse_descuento'),
        ('beneficios', 'parse_descuento'),
    ]

    def parse(self, response):
        yield{
            'title' : response.xpath('//title/text()').get()
        }
        
    
    def parse_descuento(self, response):
        #ATRIUTOS QUE RECIBE LA DATABASE
        #id(int)
        #tarjeta(int)
        #local(int)
        #producto
        #dia_semanal!!!!!
        #descripcion_descuento
        #beneficio_cuotas
        #valido_hasta
        #valido_desde
        
        descuento[response.xpath('//title/text()').get()] = {
            'id' : response.xpath('//meta[@name="format-detection"]/@content').get(),
            'Tarjeta' : [response.xpath('//tarjeta/text()').getall()],
            'Local' : response.xpath('//id/text()').get(),
            'Producto' : response.url,
            'Descripcion' : response.xpath('//meta[@name="description"]/@content').get()
        }

    #este bloque de codigo sirve para manejar la paginacion del sitio
    #next_page = response.xpath('//a[@title="Siguiente"]/@href').get()
    #if next_page != None:
    #    yield response.follow(next_page, callback=self.parse)


    #def close(self, reason):

class specificSpider(scrapy.Spider):
    name="specific"
    start_urls = []


#configuracion de console log
configure_logging({"LOG_FORMAT": "%(levelname)s: %(message)s"})

#instancia para correr spiders dentro del script
runner = CrawlerRunner()
d = runner.crawl(discountBaneSpider)

#callback para detener el reactor creado para poder correr la spider
d.addBoth(lambda _: reactor.stop())
reactor.run()  # the script will block here until the crawling is finished


#inserta resultados en un archivo JSON
file_path = "dict.json"
with open(file_path, "w") as json_file:
    json.dump(descuento, json_file)
