import scrapy
from scrapy.utils.log import configure_logging
from twisted.internet import reactor
from scrapy.crawler import CrawlerRunner
import logging
import time
from scrapy.spidermiddlewares.httperror import HttpError
from twisted.internet.error import DNSLookupError
from twisted.internet.error import TimeoutError, TCPTimedOutError

start_time = time.time()
correct_ans = ["The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking."]    #diccionario con las frases scrapeadas aaaaaaaaaaaaaaaaaaa
retrieved_ans = []


class APISpider(scrapy.Spider):
    name = "api"

    def start_requests(self):
        urls = [
            "https://quotes.toscrape.com/page/1/",
            "https://quotes.toscrape.com/peichNamberTu",
            "http://www.httpbin.org/",  # HTTP 200 expected
            "http://www.httpbin.org/status/404",  # Not found error
            "http://www.httpbin.org/status/500",  # server issue
            "http://www.httpbin.org:12345/",  # non-responding host, timeout expected
            "https://example.invalid/",  # DNS error expected            
        ]
        
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse, errback=self.errback_handler)

    def parse(self, response):
        error_code_testing(response)
        textEntries = response.xpath('//span[@itemprop="text"]/text()').get()
        retrieved_ans.append(textEntries[1:-1] if textEntries != None else "")     #quito el primer y ultimo caracter porque son de estilo

    def errback_handler(self, failure):
        # log all failures
        print(repr(failure))
        # in case you want to do something special for some errors,
        # you may need the failure's type:
        response = failure.value.response
        if failure.check(HttpError):
            print(f'Error: {HttpError}')
            print(f'Value: {repr(failure.value)}')
            print(f'Status: {response.status}')
            print(f"HttpError on {response.url}")

        elif failure.check(DNSLookupError):

            print(f'Error: {DNSLookupError}')
            print(f'Value: {repr(failure.value)}')
            print(f'Status: {response.status}')
            print(f"DNSError on {response.url}")

        elif failure.check(TimeoutError, TCPTimedOutError):
            request = failure.request
            #self.logger.error("TimeoutError on %s", request.url)
            print("TimeoutError on {request.url}")
            print(f'Error: {DNSLookupError}')
            print(f'Value: {repr(failure.value)}')
            print(f'Status: {response.status}')
            print(f"DNSError on {response.url}")



#testear precision de la informacion obtenida
def precision_testing():    
    if(correct_ans==retrieved_ans):
        print("Corret!!!!")
    else:
        print("Wrong Answer")

#testear tiempo de respuesta
def response_time_testig():
    max_time = 10           #tiempo en segundos
    if(elapsed_time<=max_time):
        print("OK timing")
    else:
        print("Code running slow")
    print(elapsed_time)

#testear codigo de error 
def error_code_testing(response):
    err_code = response.status
    if(err_code >=400):
        print("OSTIA CHAVAL")
    print(f'Codigo de error: {err_code}')


'''# Connect to the Telnet console
HOST = 'localhost'
PORT = 6023  # Default Telnet port for Scrapy

tn = telnetlib.Telnet(HOST, PORT)

# Send a command to the Telnet console
command = b"spider_names\n"  # Example: List available spiders
tn.write(command)

# Read and parse the console output
output = tn.read_until(b'Scrapy telnet console', timeout=5).decode('utf-8')

# Process the output (e.g., extract spider names)
spider_names = [line.strip() for line in output.split('\n') if line.strip()]

# Print the spider names
print("Available spiders:")
for name in spider_names:
    print(name)

# Close the Telnet connection
tn.close()'''


#configuracion de console log
configure_logging({"LOG_FORMAT": "%(levelname)s: %(message)s"})

#instancia para correr spiders dentro del script
runner = CrawlerRunner()
d = runner.crawl(APISpider)

#callback para detener el reactor creado para poder correr la spider
d.addBoth(lambda _: reactor.stop())
reactor.run()  # the script will block here until the crawling is finished

end_time = time.time()
elapsed_time = end_time - start_time
response_time_testig()
precision_testing()