import scrapy
import json
from supabase import create_client


'''supabase_url = "https://rkdpcpsryixjcglwqfaa.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHBjcHNyeWl4amNnbHdxZmFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NDEwOTg2MCwiZXhwIjoyMDA5Njg1ODYwfQ.oUzvMvpkrEL7FRsQF5x0dWS5gf8f0rqKBNx7O8f8EmY"
supabase = create_client(supabase_url, supabase_key)
table_name = "DATA"
'''
data = {}
class CotoScraperSpider(scrapy.Spider):
    name = "cotoScraper"
    start_urls = ['https://www.cotodigital3.com.ar/sitios/cdigi/browse/ofertas-todas-las-ofertas/_/N-c7ha3p']
    def parse(self, response):
        elements = response.xpath('//ul[@id="products"]')
        products = elements.xpath('.//li')
        for product in products:
            key = product.xpath('.//div[@class="descrip_full"]/text()').get()
            if key != None:

                #la base de datos no admite un diccionario anidado (por ahora)
                #por eso se cambia data en cada loop y se sube el siccionario de 1 solo producto

                data[key] = {
                    "Nombre" : key,
                    "Precio" : product.xpath('.//span[@class="price_regular_precio"]/text()').get(),
                    "Oferta" : product.xpath('.//span[@class="price_discount"]/text()').get(),
                    "Descripcion_Oferta" : product.xpath('.//span[@class="text_price_discount"]/text()').get(),
                }
                #response = supabase.table(table_name).insert([data])
        next_page = response.xpath('//a[@title="Siguiente"]/@href').get()
        #if next_page != None:
        #    yield response.follow(next_page, callback=self.parse)

    def close(self, reason):
        print(data)

    


