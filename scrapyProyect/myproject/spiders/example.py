import scrapy
import json


'''supabase_url = "https://rkdpcpsryixjcglwqfaa.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHBjcHNyeWl4amNnbHdxZmFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NDEwOTg2MCwiZXhwIjoyMDA5Njg1ODYwfQ.oUzvMvpkrEL7FRsQF5x0dWS5gf8f0rqKBNx7O8f8EmY"
supabase = create_client(supabase_url, supabase_key)
table_name = "DATA"
'''
data = {}
class CotoScraperSpider(scrapy.Spider):
    name = "ejemplardo"
    start_urls = ['https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=1']
    def parse(self, response):
        
        next_page = response.xpath('//div[@class="pager"]/a[data-nav="next"]').get()
        print(next_page)

        if next_page != None:
            yield response.follow(next_page, callback=self.parse)
