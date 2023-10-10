import scrapy
from twisted.internet import reactor
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
import json
import datetime
from scrapy import Request
from supabase import create_client


supabase_url = "https://rkdpcpsryixjcglwqfaa.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHBjcHNyeWl4amNnbHdxZmFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NDEwOTg2MCwiZXhwIjoyMDA5Njg1ODYwfQ.oUzvMvpkrEL7FRsQF5x0dWS5gf8f0rqKBNx7O8f8EmY"
supabase = create_client(supabase_url, supabase_key)

promos = [{}]
class promoScraper(scrapy.Spider):

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

        #header de request para pagina 1
        curl_command = {1:'''
           curl 'https://www.santander.com.ar/banco/contenthandler/\u0021ut/p/digest\u00215E8zSM4_UBlsevOAzgzNgw/searchfeed/search?sortKey=sortdestdefault&constraint=%7b%22type%22%3a%22category%22%2c%22id%22%3a%22rubro%22%2c%22values%22%3a%5b%22Compras%22%5d%7d&sortOrder=asc&index=search_service_portal%3a%3a/aplicaciones/tsr/collections/catalogo&query=*&start=0&results=12' \
            -H 'authority: www.santander.com.ar' \
            -H 'accept: */*' \
            -H 'accept-language: es-ES,es;q=0.9,en;q=0.8' \
            -H 'content-type: application/atom+xml; charset=UTF-8' \
            -H 'cookie: _gcl_au=1.1.1431664508.1691331476; _tt_enable_cookie=1; _ttp=Maq0rh1LD3C5M7ug9nlhMdwVqJD; _hjSessionUser_1993487=eyJpZCI6ImQ0Y2RiMGQ1LThjOWEtNTIwNS1hZWE0LTU4ZjUxNjkxNmNlYyIsImNyZWF0ZWQiOjE2OTEzMzE0NzY2NjMsImV4aXN0aW5nIjp0cnVlfQ==; bmuid=1691331480648-C6D4B3BB-B193-42C5-AD7E-AD4DA375C858; ga_sr_uid=92250777; ga_sr_seg=Universidad; ga_sr_cli=Cliente%20Santander; ga_sr_utyp=Usuario%20Logueado; ga_sr_styp=Usuario%20Logueado; _gid=GA1.3.1412623209.1694701025; _gaexp=GAX1.3.TSDKYmrqRXS_fw3cufLJrg.19628.0\u0021HTJ3P2lcQDmDF-CWGn3AVw.19651.1\u00215TxtJ_tgSSmNH44NxcHu4A.19708.1; _clck=2zva5g|2|ff2|0|1313; rxVisitor=1694894075322R6E4E1055ALG62JAKM12HRMFLOUUBH0D; dtCookie=v_4_srv_6_sn_2A41BE1436166DC846BE29275568CF59_perc_100000_ol_0_mul_1_app-3Acce8d23ebab01684_1; BSRD=\u0021f2iCcljGzaKSIBcKWz0yZ36n9QTefmXaesk3sO+6p/ZqwIlk8RnEJ5sKDrZ/SmzpuYXk/XiZmSAuoWs=; cebs=1; _ce.clock_event=1; _ce.clock_data=2217%2C181.230.193.17%2C1%2C3357fadb0316939352bbdd4d5360a97f; _hjIncludedInSessionSample_1993487=0; dtSa=-; _hjSession_1993487=eyJpZCI6IjFlZDc5YTBmLWY5YzMtNGZjMS1iNWMyLThhODE5MjU1N2U3OSIsImNyZWF0ZWQiOjE2OTQ5MDQ1Njk4MDQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; cebsp_=10; _clsk=16jq8q6|1694904571604|2|0|y.clarity.ms/collect; TS01f3ebfd=01552000273b42183597194b677d6997660f889e74491ce74f98f1602fc6315ed6ff567015b6ca7f5997d7815d08083fcae918df14; _ga_ZE7SEP1EF1=GS1.1.1694904568.23.0.1694905273.0.0.0; _ce.s=v~b7779e39e6ae8d9a7d4cd472a12ed877f674aa28~lcw~1694905273212~vpv~11~as~false~v11.fhb~1694701165868~v11.lhb~1694701165868~gtrk.la~lmmmu4ld~v11.cs~410675~v11nv~-1~v11.sla~1694905273317~v11.s~4bf26430-54e3-11ee-9d11-e589c556b30b~v11.send~1694905272519~lcw~1694905273317; dtLatC=139; TS01609085=015520002748e2836f4d4e84a0f5c9015e24c529dc7caf6751496aa97e958e178ed07322b7cb3466059c82d1b906f44981c2089c9d; RT="z=1&dm=www.santander.com.ar&si=bb93e321-29b3-428b-a419-69efb4fd65a1&ss=lmmmf1i6&sl=0&tt=0&rl=1"; b0bc2557a16ad5301891702c7711c375=18c9ec0ad00d566b4c5a1c7020c869ac; _ga_HCPL89BEYP=GS1.1.1694904568.33.1.1694905274.59.0.0; _ga=GA1.1.1326062448.1691331477; _uetsid=6399dda0530911eeb91ce3f1017fe399; _uetvid=0a2f3150346411eeac70a904f5b67e73; _dc_gtm_UA-18783836-7=1; rxvt=1694907074623|1694902838648; dtPC=505273369_620h11vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
            -H 'referer: https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=1' \
            -H 'sec-ch-ua: "Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"' \
            -H 'sec-ch-ua-mobile: ?0' \
            -H 'sec-ch-ua-platform: "Windows"' \
            -H 'sec-fetch-dest: empty' \
            -H 'sec-fetch-mode: cors' \
            -H 'sec-fetch-site: same-origin' \
            -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' \
            -H 'x-dtpc: $505273369_620h11vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
            -H 'x-requested-with: XMLHttpRequest' \
            --compressed
        ''',
        2:'''curl 'https://www.santander.com.ar/banco/contenthandler/\u0021ut/p/digest\u0021LI-WmUf1RfCsiOh_iV2u3Q/searchfeed/search?sortKey=sortdestdefault&constraint=%7b%22type%22%3a%22category%22%2c%22id%22%3a%22rubro%22%2c%22values%22%3a%5b%22Compras%22%5d%7d&sortOrder=asc&index=search_service_portal%3a%3a/aplicaciones/tsr/collections/catalogo&query=*&start=12&results=12' \
  -H 'authority: www.santander.com.ar' \
  -H 'accept: */*' \
  -H 'accept-language: es-ES,es;q=0.9,en;q=0.8' \
  -H 'content-type: application/atom+xml; charset=UTF-8' \
  -H 'cookie: _gcl_au=1.1.1431664508.1691331476; _tt_enable_cookie=1; _ttp=Maq0rh1LD3C5M7ug9nlhMdwVqJD; _hjSessionUser_1993487=eyJpZCI6ImQ0Y2RiMGQ1LThjOWEtNTIwNS1hZWE0LTU4ZjUxNjkxNmNlYyIsImNyZWF0ZWQiOjE2OTEzMzE0NzY2NjMsImV4aXN0aW5nIjp0cnVlfQ==; bmuid=1691331480648-C6D4B3BB-B193-42C5-AD7E-AD4DA375C858; ga_sr_uid=92250777; ga_sr_seg=Universidad; ga_sr_cli=Cliente%20Santander; ga_sr_utyp=Usuario%20Logueado; ga_sr_styp=Usuario%20Logueado; _gid=GA1.3.1412623209.1694701025; _gaexp=GAX1.3.TSDKYmrqRXS_fw3cufLJrg.19628.0\u0021HTJ3P2lcQDmDF-CWGn3AVw.19651.1\u00215TxtJ_tgSSmNH44NxcHu4A.19708.1; _clck=2zva5g|2|ff2|0|1313; rxVisitor=1694894075322R6E4E1055ALG62JAKM12HRMFLOUUBH0D; dtCookie=v_4_srv_6_sn_2A41BE1436166DC846BE29275568CF59_perc_100000_ol_0_mul_1_app-3Acce8d23ebab01684_1; BSRD=\u0021f2iCcljGzaKSIBcKWz0yZ36n9QTefmXaesk3sO+6p/ZqwIlk8RnEJ5sKDrZ/SmzpuYXk/XiZmSAuoWs=; cebs=1; _ce.clock_event=1; _ce.clock_data=2217%2C181.230.193.17%2C1%2C3357fadb0316939352bbdd4d5360a97f; _hjSession_1993487=eyJpZCI6IjFlZDc5YTBmLWY5YzMtNGZjMS1iNWMyLThhODE5MjU1N2U3OSIsImNyZWF0ZWQiOjE2OTQ5MDQ1Njk4MDQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _hjIncludedInSessionSample_1993487=0; TS01609085=015520002728f1922f7c1d64e866339b0b765ed7c1046c6a3c8e5375e7d22f71e81733f4612295fad3a62010ffa493bf1d34c1ecee; TS01f3ebfd=01552000276eceed9931fc7ba03b62c0c1dc02d11fe53b969e213bf7b8e5120b7cc9da36e58315dc233ffb0a3110d9fc4a810b3c63; _dc_gtm_UA-18783836-7=1; cebsp_=22; _clsk=16jq8q6|1694907848951|34|0|y.clarity.ms/collect; _ga_ZE7SEP1EF1=GS1.1.1694904568.23.1.1694907851.0.0.0; _ce.s=v~b7779e39e6ae8d9a7d4cd472a12ed877f674aa28~lcw~1694907851046~vpv~11~as~false~v11.fhb~1694701165868~v11.lhb~1694701165868~gtrk.la~lmmodfr7~v11.cs~410675~v11nv~-11~v11.sla~1694907851134~v11.s~128763c0-54e9-11ee-b9d0-a54af4ed5719~v11.send~1694907850621~lcw~1694907851134; dtLatC=2; dtSa=-; b0bc2557a16ad5301891702c7711c375=ad417ac092530eff71e4c04d78d5730b; RT="z=1&dm=www.santander.com.ar&si=bb93e321-29b3-428b-a419-69efb4fd65a1&ss=lmmnw8w1&sl=a&tt=v4&obo=9&rl=1"; _ga_HCPL89BEYP=GS1.1.1694904568.33.1.1694907852.57.0.0; _ga=GA1.1.1326062448.1691331477; _uetsid=6399dda0530911eeb91ce3f1017fe399; _uetvid=0a2f3150346411eeac70a904f5b67e73; rxvt=1694909652100|1694902838648; dtPC=507851172_765h11vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'referer: https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=2' \
  -H 'sec-ch-ua: "Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' \
  -H 'x-dtpc: $507851172_765h11vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed''',
        3:'''curl 'https://www.santander.com.ar/banco/contenthandler/\u0021ut/p/digest\u0021N06eL8sO8G7A77SDIy2TnQ/searchfeed/search?sortKey=sortdestdefault&constraint=%7b%22type%22%3a%22category%22%2c%22id%22%3a%22rubro%22%2c%22values%22%3a%5b%22Compras%22%5d%7d&sortOrder=asc&index=search_service_portal%3a%3a/aplicaciones/tsr/collections/catalogo&query=*&start=24&results=12' \
  -H 'authority: www.santander.com.ar' \
  -H 'accept: */*' \
  -H 'accept-language: es-ES,es;q=0.9,en;q=0.8' \
  -H 'content-type: application/atom+xml; charset=UTF-8' \
  -H 'cookie: _gcl_au=1.1.1431664508.1691331476; _tt_enable_cookie=1; _ttp=Maq0rh1LD3C5M7ug9nlhMdwVqJD; _hjSessionUser_1993487=eyJpZCI6ImQ0Y2RiMGQ1LThjOWEtNTIwNS1hZWE0LTU4ZjUxNjkxNmNlYyIsImNyZWF0ZWQiOjE2OTEzMzE0NzY2NjMsImV4aXN0aW5nIjp0cnVlfQ==; bmuid=1691331480648-C6D4B3BB-B193-42C5-AD7E-AD4DA375C858; ga_sr_uid=92250777; ga_sr_seg=Universidad; ga_sr_cli=Cliente%20Santander; ga_sr_utyp=Usuario%20Logueado; ga_sr_styp=Usuario%20Logueado; _gid=GA1.3.1412623209.1694701025; _gaexp=GAX1.3.TSDKYmrqRXS_fw3cufLJrg.19628.0\u0021HTJ3P2lcQDmDF-CWGn3AVw.19651.1\u00215TxtJ_tgSSmNH44NxcHu4A.19708.1; _clck=2zva5g|2|ff2|0|1313; rxVisitor=1694894075322R6E4E1055ALG62JAKM12HRMFLOUUBH0D; dtCookie=v_4_srv_6_sn_2A41BE1436166DC846BE29275568CF59_perc_100000_ol_0_mul_1_app-3Acce8d23ebab01684_1; BSRD=\u0021f2iCcljGzaKSIBcKWz0yZ36n9QTefmXaesk3sO+6p/ZqwIlk8RnEJ5sKDrZ/SmzpuYXk/XiZmSAuoWs=; cebs=1; _ce.clock_event=1; _ce.clock_data=2217%2C181.230.193.17%2C1%2C3357fadb0316939352bbdd4d5360a97f; _hjSession_1993487=eyJpZCI6IjFlZDc5YTBmLWY5YzMtNGZjMS1iNWMyLThhODE5MjU1N2U3OSIsImNyZWF0ZWQiOjE2OTQ5MDQ1Njk4MDQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _hjIncludedInSessionSample_1993487=0; TS01609085=015520002728f1922f7c1d64e866339b0b765ed7c1046c6a3c8e5375e7d22f71e81733f4612295fad3a62010ffa493bf1d34c1ecee; TS01f3ebfd=01552000276eceed9931fc7ba03b62c0c1dc02d11fe53b969e213bf7b8e5120b7cc9da36e58315dc233ffb0a3110d9fc4a810b3c63; dtSa=-; cebsp_=21; _clsk=16jq8q6|1694907793542|32|0|y.clarity.ms/collect; _ga_ZE7SEP1EF1=GS1.1.1694904568.23.1.1694907797.0.0.0; _ce.s=v~b7779e39e6ae8d9a7d4cd472a12ed877f674aa28~lcw~1694907797137~vpv~11~as~false~v11.fhb~1694701165868~v11.lhb~1694701165868~gtrk.la~lmmoc8ai~v11.cs~410675~v11nv~-10~v11.sla~1694907797168~v11.s~128763c0-54e9-11ee-b9d0-a54af4ed5719~v11.send~1694907796387~lcw~1694907797168; dtLatC=2; RT="z=1&dm=www.santander.com.ar&si=bb93e321-29b3-428b-a419-69efb4fd65a1&ss=lmmnw8w1&sl=9&tt=v4&obo=8&rl=1"; b0bc2557a16ad5301891702c7711c375=175592775e396a9ea385c16930f79c64; _ga_HCPL89BEYP=GS1.1.1694904568.33.1.1694907797.2.0.0; _ga=GA1.1.1326062448.1691331477; _uetsid=6399dda0530911eeb91ce3f1017fe399; _uetvid=0a2f3150346411eeac70a904f5b67e73; rxvt=1694909598171|1694902838648; dtPC=507797209_101h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0; _dc_gtm_UA-18783836-7=1' \
  -H 'referer: https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=3' \
  -H 'sec-ch-ua: "Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' \
  -H 'x-dtpc: $507797209_101h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed''',
        4:'''curl 'https://www.santander.com.ar/banco/contenthandler/\u0021ut/p/digest\u00215j6EjbpwIGLXUkzzhcQP9A/searchfeed/search?sortKey=sortdestdefault&constraint=%7b%22type%22%3a%22category%22%2c%22id%22%3a%22rubro%22%2c%22values%22%3a%5b%22Compras%22%5d%7d&sortOrder=asc&index=search_service_portal%3a%3a/aplicaciones/tsr/collections/catalogo&query=*&start=36&results=12' \
  -H 'authority: www.santander.com.ar' \
  -H 'accept: */*' \
  -H 'accept-language: es-ES,es;q=0.9,en;q=0.8' \
  -H 'content-type: application/atom+xml; charset=UTF-8' \
  -H 'cookie: _gcl_au=1.1.1431664508.1691331476; _tt_enable_cookie=1; _ttp=Maq0rh1LD3C5M7ug9nlhMdwVqJD; _hjSessionUser_1993487=eyJpZCI6ImQ0Y2RiMGQ1LThjOWEtNTIwNS1hZWE0LTU4ZjUxNjkxNmNlYyIsImNyZWF0ZWQiOjE2OTEzMzE0NzY2NjMsImV4aXN0aW5nIjp0cnVlfQ==; bmuid=1691331480648-C6D4B3BB-B193-42C5-AD7E-AD4DA375C858; ga_sr_uid=92250777; ga_sr_seg=Universidad; ga_sr_cli=Cliente%20Santander; ga_sr_utyp=Usuario%20Logueado; ga_sr_styp=Usuario%20Logueado; _gid=GA1.3.1412623209.1694701025; _gaexp=GAX1.3.TSDKYmrqRXS_fw3cufLJrg.19628.0\u0021HTJ3P2lcQDmDF-CWGn3AVw.19651.1\u00215TxtJ_tgSSmNH44NxcHu4A.19708.1; _clck=2zva5g|2|ff2|0|1313; rxVisitor=1694894075322R6E4E1055ALG62JAKM12HRMFLOUUBH0D; dtCookie=v_4_srv_6_sn_2A41BE1436166DC846BE29275568CF59_perc_100000_ol_0_mul_1_app-3Acce8d23ebab01684_1; BSRD=\u0021f2iCcljGzaKSIBcKWz0yZ36n9QTefmXaesk3sO+6p/ZqwIlk8RnEJ5sKDrZ/SmzpuYXk/XiZmSAuoWs=; cebs=1; _ce.clock_event=1; _ce.clock_data=2217%2C181.230.193.17%2C1%2C3357fadb0316939352bbdd4d5360a97f; _hjSession_1993487=eyJpZCI6IjFlZDc5YTBmLWY5YzMtNGZjMS1iNWMyLThhODE5MjU1N2U3OSIsImNyZWF0ZWQiOjE2OTQ5MDQ1Njk4MDQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _hjIncludedInSessionSample_1993487=0; TS01609085=015520002728f1922f7c1d64e866339b0b765ed7c1046c6a3c8e5375e7d22f71e81733f4612295fad3a62010ffa493bf1d34c1ecee; TS01f3ebfd=01552000276eceed9931fc7ba03b62c0c1dc02d11fe53b969e213bf7b8e5120b7cc9da36e58315dc233ffb0a3110d9fc4a810b3c63; _dc_gtm_UA-18783836-7=1; cebsp_=20; _clsk=16jq8q6|1694907770612|30|0|y.clarity.ms/collect; _ga_ZE7SEP1EF1=GS1.1.1694904568.23.1.1694907773.0.0.0; _ce.s=v~b7779e39e6ae8d9a7d4cd472a12ed877f674aa28~lcw~1694907773073~vpv~11~as~false~v11.fhb~1694701165868~v11.lhb~1694701165868~gtrk.la~lmmobp7g~v11.cs~410675~v11nv~-9~v11.sla~1694907773093~v11.s~128763c0-54e9-11ee-b9d0-a54af4ed5719~v11.send~1694907772553~lcw~1694907773094; dtLatC=2; dtSa=-; RT="z=1&dm=www.santander.com.ar&si=bb93e321-29b3-428b-a419-69efb4fd65a1&ss=lmmnw8w1&sl=8&tt=v4&obo=7&rl=1"; b0bc2557a16ad5301891702c7711c375=ad417ac092530eff71e4c04d78d5730b; _ga_HCPL89BEYP=GS1.1.1694904568.33.1.1694907773.26.0.0; _ga=GA1.3.1326062448.1691331477; _uetsid=6399dda0530911eeb91ce3f1017fe399; _uetvid=0a2f3150346411eeac70a904f5b67e73; rxvt=1694909574364|1694902838648; dtPC=507773131_318h11vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'referer: https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=4' \
  -H 'sec-ch-ua: "Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' \
  -H 'x-dtpc: $507773131_318h11vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed''',
        5:'''curl 'https://www.santander.com.ar/banco/contenthandler/\u0021ut/p/digest\u0021SLoUvpfpe39rV_Ex5aMlmw/searchfeed/search?sortKey=sortdestdefault&constraint=%7b%22type%22%3a%22category%22%2c%22id%22%3a%22rubro%22%2c%22values%22%3a%5b%22Compras%22%5d%7d&sortOrder=asc&index=search_service_portal%3a%3a/aplicaciones/tsr/collections/catalogo&query=*&start=48&results=12' \
  -H 'authority: www.santander.com.ar' \
  -H 'accept: */*' \
  -H 'accept-language: es-ES,es;q=0.9,en;q=0.8' \
  -H 'content-type: application/atom+xml; charset=UTF-8' \
  -H 'cookie: _gcl_au=1.1.1431664508.1691331476; _tt_enable_cookie=1; _ttp=Maq0rh1LD3C5M7ug9nlhMdwVqJD; _hjSessionUser_1993487=eyJpZCI6ImQ0Y2RiMGQ1LThjOWEtNTIwNS1hZWE0LTU4ZjUxNjkxNmNlYyIsImNyZWF0ZWQiOjE2OTEzMzE0NzY2NjMsImV4aXN0aW5nIjp0cnVlfQ==; bmuid=1691331480648-C6D4B3BB-B193-42C5-AD7E-AD4DA375C858; ga_sr_uid=92250777; ga_sr_seg=Universidad; ga_sr_cli=Cliente%20Santander; ga_sr_utyp=Usuario%20Logueado; ga_sr_styp=Usuario%20Logueado; _gid=GA1.3.1412623209.1694701025; _gaexp=GAX1.3.TSDKYmrqRXS_fw3cufLJrg.19628.0\u0021HTJ3P2lcQDmDF-CWGn3AVw.19651.1\u00215TxtJ_tgSSmNH44NxcHu4A.19708.1; _clck=2zva5g|2|ff2|0|1313; rxVisitor=1694894075322R6E4E1055ALG62JAKM12HRMFLOUUBH0D; dtCookie=v_4_srv_6_sn_2A41BE1436166DC846BE29275568CF59_perc_100000_ol_0_mul_1_app-3Acce8d23ebab01684_1; BSRD=\u0021f2iCcljGzaKSIBcKWz0yZ36n9QTefmXaesk3sO+6p/ZqwIlk8RnEJ5sKDrZ/SmzpuYXk/XiZmSAuoWs=; cebs=1; _ce.clock_event=1; _ce.clock_data=2217%2C181.230.193.17%2C1%2C3357fadb0316939352bbdd4d5360a97f; _hjSession_1993487=eyJpZCI6IjFlZDc5YTBmLWY5YzMtNGZjMS1iNWMyLThhODE5MjU1N2U3OSIsImNyZWF0ZWQiOjE2OTQ5MDQ1Njk4MDQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _hjIncludedInSessionSample_1993487=0; TS01609085=015520002728f1922f7c1d64e866339b0b765ed7c1046c6a3c8e5375e7d22f71e81733f4612295fad3a62010ffa493bf1d34c1ecee; TS01f3ebfd=01552000276eceed9931fc7ba03b62c0c1dc02d11fe53b969e213bf7b8e5120b7cc9da36e58315dc233ffb0a3110d9fc4a810b3c63; _dc_gtm_UA-18783836-7=1; b0bc2557a16ad5301891702c7711c375=e9c358b07024e77caa3356afdc58dd8a; dtSa=-; _clsk=16jq8q6|1694907743500|28|0|y.clarity.ms/collect; dtLatC=1; _ga_ZE7SEP1EF1=GS1.1.1694904568.23.1.1694907745.0.0.0; _ce.s=v~b7779e39e6ae8d9a7d4cd472a12ed877f674aa28~lcw~1694907745662~vpv~11~as~false~v11.fhb~1694701165868~v11.lhb~1694701165868~gtrk.la~lmmob5ia~v11.cs~410675~v11nv~-8~v11.sla~1694907745683~v11.s~128763c0-54e9-11ee-b9d0-a54af4ed5719~v11.send~1694907745184~lcw~1694907745684; RT="z=1&dm=www.santander.com.ar&si=bb93e321-29b3-428b-a419-69efb4fd65a1&ss=lmmnw8w1&sl=7&tt=v4&obo=6&rl=1"; _ga_HCPL89BEYP=GS1.1.1694904568.33.1.1694907746.53.0.0; _ga=GA1.3.1326062448.1691331477; _uetsid=6399dda0530911eeb91ce3f1017fe399; _uetvid=0a2f3150346411eeac70a904f5b67e73; cebsp_=20; rxvt=1694909547018|1694902838648; dtPC=507745725_406h11vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'referer: https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=5' \
  -H 'sec-ch-ua: "Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' \
  -H 'x-dtpc: $507745725_406h11vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed''',
        6:'''curl 'https://www.santander.com.ar/banco/contenthandler/\u0021ut/p/digest\u0021hiqBRnBzCG1POuKwt-bObA/searchfeed/search?sortKey=sortdestdefault&constraint=%7b%22type%22%3a%22category%22%2c%22id%22%3a%22rubro%22%2c%22values%22%3a%5b%22Compras%22%5d%7d&sortOrder=asc&index=search_service_portal%3a%3a/aplicaciones/tsr/collections/catalogo&query=*&start=60&results=12' \
  -H 'authority: www.santander.com.ar' \
  -H 'accept: */*' \
  -H 'accept-language: es-ES,es;q=0.9,en;q=0.8' \
  -H 'content-type: application/atom+xml; charset=UTF-8' \
  -H 'cookie: _gcl_au=1.1.1431664508.1691331476; _tt_enable_cookie=1; _ttp=Maq0rh1LD3C5M7ug9nlhMdwVqJD; _hjSessionUser_1993487=eyJpZCI6ImQ0Y2RiMGQ1LThjOWEtNTIwNS1hZWE0LTU4ZjUxNjkxNmNlYyIsImNyZWF0ZWQiOjE2OTEzMzE0NzY2NjMsImV4aXN0aW5nIjp0cnVlfQ==; bmuid=1691331480648-C6D4B3BB-B193-42C5-AD7E-AD4DA375C858; ga_sr_uid=92250777; ga_sr_seg=Universidad; ga_sr_cli=Cliente%20Santander; ga_sr_utyp=Usuario%20Logueado; ga_sr_styp=Usuario%20Logueado; _gid=GA1.3.1412623209.1694701025; _gaexp=GAX1.3.TSDKYmrqRXS_fw3cufLJrg.19628.0\u0021HTJ3P2lcQDmDF-CWGn3AVw.19651.1\u00215TxtJ_tgSSmNH44NxcHu4A.19708.1; _clck=2zva5g|2|ff2|0|1313; rxVisitor=1694894075322R6E4E1055ALG62JAKM12HRMFLOUUBH0D; dtCookie=v_4_srv_6_sn_2A41BE1436166DC846BE29275568CF59_perc_100000_ol_0_mul_1_app-3Acce8d23ebab01684_1; BSRD=\u0021f2iCcljGzaKSIBcKWz0yZ36n9QTefmXaesk3sO+6p/ZqwIlk8RnEJ5sKDrZ/SmzpuYXk/XiZmSAuoWs=; cebs=1; _ce.clock_event=1; _ce.clock_data=2217%2C181.230.193.17%2C1%2C3357fadb0316939352bbdd4d5360a97f; _hjSession_1993487=eyJpZCI6IjFlZDc5YTBmLWY5YzMtNGZjMS1iNWMyLThhODE5MjU1N2U3OSIsImNyZWF0ZWQiOjE2OTQ5MDQ1Njk4MDQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _hjIncludedInSessionSample_1993487=0; TS01609085=015520002728f1922f7c1d64e866339b0b765ed7c1046c6a3c8e5375e7d22f71e81733f4612295fad3a62010ffa493bf1d34c1ecee; TS01f3ebfd=01552000276eceed9931fc7ba03b62c0c1dc02d11fe53b969e213bf7b8e5120b7cc9da36e58315dc233ffb0a3110d9fc4a810b3c63; cebsp_=17; _clsk=16jq8q6|1694907713796|25|0|y.clarity.ms/collect; dtLatC=1; _ga_ZE7SEP1EF1=GS1.1.1694904568.23.1.1694907715.0.0.0; _ce.s=v~b7779e39e6ae8d9a7d4cd472a12ed877f674aa28~lcw~1694907715302~vpv~11~as~false~v11.fhb~1694701165868~v11.lhb~1694701165868~gtrk.la~lmmoahcw~v11.cs~410675~v11nv~-6~v11.sla~1694907715526~v11.s~128763c0-54e9-11ee-b9d0-a54af4ed5719~v11.send~1694907714948~lcw~1694907715527; dtSa=-; b0bc2557a16ad5301891702c7711c375=4a198bab4901e4d6df579402f40ae8cc; RT="z=1&dm=www.santander.com.ar&si=bb93e321-29b3-428b-a419-69efb4fd65a1&ss=lmmnw8w1&sl=5&tt=v4&obo=4&rl=1"; _ga_HCPL89BEYP=GS1.1.1694904568.33.1.1694907716.1.0.0; _ga=GA1.3.1326062448.1691331477; _uetsid=6399dda0530911eeb91ce3f1017fe399; _uetvid=0a2f3150346411eeac70a904f5b67e73; rxvt=1694909516438|1694902838648; dtPC=507715564_101h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'referer: https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=6' \
  -H 'sec-ch-ua: "Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' \
  -H 'x-dtpc: $507715564_101h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed''',
        7:'''curl 'https://www.santander.com.ar/banco/contenthandler/\u0021ut/p/digest\u0021zbQKcBC1fXkzfCfFa3LRFQ/searchfeed/search?sortKey=sortdestdefault&constraint=%7b%22type%22%3a%22category%22%2c%22id%22%3a%22rubro%22%2c%22values%22%3a%5b%22Compras%22%5d%7d&sortOrder=asc&index=search_service_portal%3a%3a/aplicaciones/tsr/collections/catalogo&query=*&start=72&results=12' \
  -H 'authority: www.santander.com.ar' \
  -H 'accept: */*' \
  -H 'accept-language: es-ES,es;q=0.9,en;q=0.8' \
  -H 'content-type: application/atom+xml; charset=UTF-8' \
  -H 'cookie: _gcl_au=1.1.1431664508.1691331476; _tt_enable_cookie=1; _ttp=Maq0rh1LD3C5M7ug9nlhMdwVqJD; _hjSessionUser_1993487=eyJpZCI6ImQ0Y2RiMGQ1LThjOWEtNTIwNS1hZWE0LTU4ZjUxNjkxNmNlYyIsImNyZWF0ZWQiOjE2OTEzMzE0NzY2NjMsImV4aXN0aW5nIjp0cnVlfQ==; bmuid=1691331480648-C6D4B3BB-B193-42C5-AD7E-AD4DA375C858; ga_sr_uid=92250777; ga_sr_seg=Universidad; ga_sr_cli=Cliente%20Santander; ga_sr_utyp=Usuario%20Logueado; ga_sr_styp=Usuario%20Logueado; _gid=GA1.3.1412623209.1694701025; _gaexp=GAX1.3.TSDKYmrqRXS_fw3cufLJrg.19628.0\u0021HTJ3P2lcQDmDF-CWGn3AVw.19651.1\u00215TxtJ_tgSSmNH44NxcHu4A.19708.1; _clck=2zva5g|2|ff2|0|1313; rxVisitor=1694894075322R6E4E1055ALG62JAKM12HRMFLOUUBH0D; dtCookie=v_4_srv_6_sn_2A41BE1436166DC846BE29275568CF59_perc_100000_ol_0_mul_1_app-3Acce8d23ebab01684_1; BSRD=\u0021f2iCcljGzaKSIBcKWz0yZ36n9QTefmXaesk3sO+6p/ZqwIlk8RnEJ5sKDrZ/SmzpuYXk/XiZmSAuoWs=; cebs=1; _ce.clock_event=1; _ce.clock_data=2217%2C181.230.193.17%2C1%2C3357fadb0316939352bbdd4d5360a97f; _hjSession_1993487=eyJpZCI6IjFlZDc5YTBmLWY5YzMtNGZjMS1iNWMyLThhODE5MjU1N2U3OSIsImNyZWF0ZWQiOjE2OTQ5MDQ1Njk4MDQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _hjIncludedInSessionSample_1993487=0; dtSa=-; _dc_gtm_UA-18783836-7=1; cebsp_=16; TS01609085=015520002728f1922f7c1d64e866339b0b765ed7c1046c6a3c8e5375e7d22f71e81733f4612295fad3a62010ffa493bf1d34c1ecee; _clsk=16jq8q6|1694907686639|23|0|y.clarity.ms/collect; TS01f3ebfd=01552000276eceed9931fc7ba03b62c0c1dc02d11fe53b969e213bf7b8e5120b7cc9da36e58315dc233ffb0a3110d9fc4a810b3c63; _ga_ZE7SEP1EF1=GS1.1.1694904568.23.1.1694907690.0.0.0; _ce.s=v~b7779e39e6ae8d9a7d4cd472a12ed877f674aa28~lcw~1694907690038~vpv~11~as~false~v11.fhb~1694701165868~v11.lhb~1694701165868~gtrk.la~lmmo9zfa~v11.cs~410675~v11nv~-5~v11.sla~1694907690114~v11.s~128763c0-54e9-11ee-b9d0-a54af4ed5719~v11.send~1694907689380~lcw~1694907690114; dtLatC=2; b0bc2557a16ad5301891702c7711c375=175592775e396a9ea385c16930f79c64; RT="z=1&dm=www.santander.com.ar&si=bb93e321-29b3-428b-a419-69efb4fd65a1&ss=lmmnw8w1&sl=4&tt=v4&obo=3&rl=1"; _ga_HCPL89BEYP=GS1.1.1694904568.33.1.1694907690.27.0.0; _ga=GA1.1.1326062448.1691331477; _uetsid=6399dda0530911eeb91ce3f1017fe399; _uetvid=0a2f3150346411eeac70a904f5b67e73; rxvt=1694909491177|1694902838648; dtPC=507690176_543h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'referer: https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=7' \
  -H 'sec-ch-ua: "Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' \
  -H 'x-dtpc: $507690176_543h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed''',
        8:'''curl 'https://www.santander.com.ar/banco/contenthandler/\u0021ut/p/digest\u0021wQEfBgQG3f95cT2n46FovQ/searchfeed/search?sortKey=sortdestdefault&constraint=%7b%22type%22%3a%22category%22%2c%22id%22%3a%22rubro%22%2c%22values%22%3a%5b%22Compras%22%5d%7d&sortOrder=asc&index=search_service_portal%3a%3a/aplicaciones/tsr/collections/catalogo&query=*&start=84&results=12' \
  -H 'authority: www.santander.com.ar' \
  -H 'accept: */*' \
  -H 'accept-language: es-ES,es;q=0.9,en;q=0.8' \
  -H 'content-type: application/atom+xml; charset=UTF-8' \
  -H 'cookie: _gcl_au=1.1.1431664508.1691331476; _tt_enable_cookie=1; _ttp=Maq0rh1LD3C5M7ug9nlhMdwVqJD; _hjSessionUser_1993487=eyJpZCI6ImQ0Y2RiMGQ1LThjOWEtNTIwNS1hZWE0LTU4ZjUxNjkxNmNlYyIsImNyZWF0ZWQiOjE2OTEzMzE0NzY2NjMsImV4aXN0aW5nIjp0cnVlfQ==; bmuid=1691331480648-C6D4B3BB-B193-42C5-AD7E-AD4DA375C858; ga_sr_uid=92250777; ga_sr_seg=Universidad; ga_sr_cli=Cliente%20Santander; ga_sr_utyp=Usuario%20Logueado; ga_sr_styp=Usuario%20Logueado; _gid=GA1.3.1412623209.1694701025; _gaexp=GAX1.3.TSDKYmrqRXS_fw3cufLJrg.19628.0\u0021HTJ3P2lcQDmDF-CWGn3AVw.19651.1\u00215TxtJ_tgSSmNH44NxcHu4A.19708.1; _clck=2zva5g|2|ff2|0|1313; rxVisitor=1694894075322R6E4E1055ALG62JAKM12HRMFLOUUBH0D; dtCookie=v_4_srv_6_sn_2A41BE1436166DC846BE29275568CF59_perc_100000_ol_0_mul_1_app-3Acce8d23ebab01684_1; BSRD=\u0021f2iCcljGzaKSIBcKWz0yZ36n9QTefmXaesk3sO+6p/ZqwIlk8RnEJ5sKDrZ/SmzpuYXk/XiZmSAuoWs=; cebs=1; _ce.clock_event=1; _ce.clock_data=2217%2C181.230.193.17%2C1%2C3357fadb0316939352bbdd4d5360a97f; _hjSession_1993487=eyJpZCI6IjFlZDc5YTBmLWY5YzMtNGZjMS1iNWMyLThhODE5MjU1N2U3OSIsImNyZWF0ZWQiOjE2OTQ5MDQ1Njk4MDQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; TS01609085=0155200027bccd80d107c215d94c4501af96062a02fd966adb265e6a1437920e3a7a2a88b177309081aa7e18982c7c5a97f7fa2128; TS01f3ebfd=015520002735fbfddaed31e4aeec6ca45bacf3e925b4de113d9e930a3419e1eccf381279fa22f779409771c7f3a5d4e427f24cb46e; _hjIncludedInSessionSample_1993487=0; dtSa=-; cebsp_=15; _dc_gtm_UA-18783836-7=1; _clsk=16jq8q6|1694907656868|21|0|y.clarity.ms/collect; _ga_ZE7SEP1EF1=GS1.1.1694904568.23.1.1694907665.0.0.0; _ce.s=v~b7779e39e6ae8d9a7d4cd472a12ed877f674aa28~lcw~1694907665274~vpv~11~as~false~v11.fhb~1694701165868~v11.lhb~1694701165868~gtrk.la~lmmo99et~v11.cs~410675~v11nv~-4~v11.sla~1694907665305~v11.s~128763c0-54e9-11ee-b9d0-a54af4ed5719~v11.send~1694907664875~lcw~1694907665306; dtLatC=2; b0bc2557a16ad5301891702c7711c375=18c9ec0ad00d566b4c5a1c7020c869ac; RT="z=1&dm=www.santander.com.ar&si=bb93e321-29b3-428b-a419-69efb4fd65a1&ss=lmmnw8w1&sl=3&tt=v4&obo=2&rl=1"; _ga_HCPL89BEYP=GS1.1.1694904568.33.1.1694907666.51.0.0; _ga=GA1.3.1326062448.1691331477; _uetsid=6399dda0530911eeb91ce3f1017fe399; _uetvid=0a2f3150346411eeac70a904f5b67e73; rxvt=1694909466340|1694902838648; dtPC=507665345_398h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'referer: https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=8' \
  -H 'sec-ch-ua: "Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' \
  -H 'x-dtpc: $507665345_398h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed''',
        9:'''curl 'https://www.santander.com.ar/banco/contenthandler/\u0021ut/p/digest\u0021EWivBoF6h7rh7efVEgqTgQ/searchfeed/search?sortKey=sortdestdefault&constraint=%7b%22type%22%3a%22category%22%2c%22id%22%3a%22rubro%22%2c%22values%22%3a%5b%22Compras%22%5d%7d&sortOrder=asc&index=search_service_portal%3a%3a/aplicaciones/tsr/collections/catalogo&query=*&start=96&results=12' \
  -H 'authority: www.santander.com.ar' \
  -H 'accept: */*' \
  -H 'accept-language: es-ES,es;q=0.9,en;q=0.8' \
  -H 'content-type: application/atom+xml; charset=UTF-8' \
  -H 'cookie: _gcl_au=1.1.1431664508.1691331476; _tt_enable_cookie=1; _ttp=Maq0rh1LD3C5M7ug9nlhMdwVqJD; _hjSessionUser_1993487=eyJpZCI6ImQ0Y2RiMGQ1LThjOWEtNTIwNS1hZWE0LTU4ZjUxNjkxNmNlYyIsImNyZWF0ZWQiOjE2OTEzMzE0NzY2NjMsImV4aXN0aW5nIjp0cnVlfQ==; bmuid=1691331480648-C6D4B3BB-B193-42C5-AD7E-AD4DA375C858; ga_sr_uid=92250777; ga_sr_seg=Universidad; ga_sr_cli=Cliente%20Santander; ga_sr_utyp=Usuario%20Logueado; ga_sr_styp=Usuario%20Logueado; _gid=GA1.3.1412623209.1694701025; _gaexp=GAX1.3.TSDKYmrqRXS_fw3cufLJrg.19628.0\u0021HTJ3P2lcQDmDF-CWGn3AVw.19651.1\u00215TxtJ_tgSSmNH44NxcHu4A.19708.1; _clck=2zva5g|2|ff2|0|1313; rxVisitor=1694894075322R6E4E1055ALG62JAKM12HRMFLOUUBH0D; dtCookie=v_4_srv_6_sn_2A41BE1436166DC846BE29275568CF59_perc_100000_ol_0_mul_1_app-3Acce8d23ebab01684_1; BSRD=\u0021f2iCcljGzaKSIBcKWz0yZ36n9QTefmXaesk3sO+6p/ZqwIlk8RnEJ5sKDrZ/SmzpuYXk/XiZmSAuoWs=; cebs=1; _ce.clock_event=1; _ce.clock_data=2217%2C181.230.193.17%2C1%2C3357fadb0316939352bbdd4d5360a97f; _hjSession_1993487=eyJpZCI6IjFlZDc5YTBmLWY5YzMtNGZjMS1iNWMyLThhODE5MjU1N2U3OSIsImNyZWF0ZWQiOjE2OTQ5MDQ1Njk4MDQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; TS01609085=0155200027bccd80d107c215d94c4501af96062a02fd966adb265e6a1437920e3a7a2a88b177309081aa7e18982c7c5a97f7fa2128; TS01f3ebfd=015520002735fbfddaed31e4aeec6ca45bacf3e925b4de113d9e930a3419e1eccf381279fa22f779409771c7f3a5d4e427f24cb46e; _hjIncludedInSessionSample_1993487=0; _dc_gtm_UA-18783836-7=1; cebsp_=14; _clsk=16jq8q6|1694907624321|19|0|y.clarity.ms/collect; _ga_ZE7SEP1EF1=GS1.1.1694904568.23.1.1694907626.0.0.0; _ce.s=v~b7779e39e6ae8d9a7d4cd472a12ed877f674aa28~lcw~1694907626097~vpv~11~as~false~v11.fhb~1694701165868~v11.lhb~1694701165868~gtrk.la~lmmo8kco~v11.cs~410675~v11nv~-3~v11.sla~1694907626199~v11.s~128763c0-54e9-11ee-b9d0-a54af4ed5719~v11.send~1694907625675~lcw~1694907626199; dtLatC=1; dtSa=-; RT="z=1&dm=www.santander.com.ar&si=bb93e321-29b3-428b-a419-69efb4fd65a1&ss=lmmnw8w1&sl=2&tt=v4&obo=1&rl=1"; b0bc2557a16ad5301891702c7711c375=41c7b83b99c899f6e9797b8b56824c56; _ga_HCPL89BEYP=GS1.1.1694904568.33.1.1694907626.23.0.0; _ga=GA1.1.1326062448.1691331477; _uetsid=6399dda0530911eeb91ce3f1017fe399; _uetvid=0a2f3150346411eeac70a904f5b67e73; rxvt=1694909427178|1694902838648; dtPC=507626236_294h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'referer: https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=9' \
  -H 'sec-ch-ua: "Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' \
  -H 'x-dtpc: $507626236_294h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed''',
        10:'''curl 'https://www.santander.com.ar/banco/contenthandler/\u0021ut/p/digest\u0021AbDW94IEdCatkCtzt8QCLw/searchfeed/search?sortKey=sortdestdefault&constraint=%7b%22type%22%3a%22category%22%2c%22id%22%3a%22rubro%22%2c%22values%22%3a%5b%22Compras%22%5d%7d&sortOrder=asc&index=search_service_portal%3a%3a/aplicaciones/tsr/collections/catalogo&query=*&start=108&results=12' \
  -H 'authority: www.santander.com.ar' \
  -H 'accept: */*' \
  -H 'accept-language: es-ES,es;q=0.9,en;q=0.8' \
  -H 'content-type: application/atom+xml; charset=UTF-8' \
  -H 'cookie: _gcl_au=1.1.1431664508.1691331476; _tt_enable_cookie=1; _ttp=Maq0rh1LD3C5M7ug9nlhMdwVqJD; _hjSessionUser_1993487=eyJpZCI6ImQ0Y2RiMGQ1LThjOWEtNTIwNS1hZWE0LTU4ZjUxNjkxNmNlYyIsImNyZWF0ZWQiOjE2OTEzMzE0NzY2NjMsImV4aXN0aW5nIjp0cnVlfQ==; bmuid=1691331480648-C6D4B3BB-B193-42C5-AD7E-AD4DA375C858; ga_sr_uid=92250777; ga_sr_seg=Universidad; ga_sr_cli=Cliente%20Santander; ga_sr_utyp=Usuario%20Logueado; ga_sr_styp=Usuario%20Logueado; _gid=GA1.3.1412623209.1694701025; _gaexp=GAX1.3.TSDKYmrqRXS_fw3cufLJrg.19628.0\u0021HTJ3P2lcQDmDF-CWGn3AVw.19651.1\u00215TxtJ_tgSSmNH44NxcHu4A.19708.1; _clck=2zva5g|2|ff2|0|1313; rxVisitor=1694894075322R6E4E1055ALG62JAKM12HRMFLOUUBH0D; dtCookie=v_4_srv_6_sn_2A41BE1436166DC846BE29275568CF59_perc_100000_ol_0_mul_1_app-3Acce8d23ebab01684_1; BSRD=\u0021f2iCcljGzaKSIBcKWz0yZ36n9QTefmXaesk3sO+6p/ZqwIlk8RnEJ5sKDrZ/SmzpuYXk/XiZmSAuoWs=; cebs=1; _ce.clock_event=1; _ce.clock_data=2217%2C181.230.193.17%2C1%2C3357fadb0316939352bbdd4d5360a97f; dtSa=-; _hjSession_1993487=eyJpZCI6IjFlZDc5YTBmLWY5YzMtNGZjMS1iNWMyLThhODE5MjU1N2U3OSIsImNyZWF0ZWQiOjE2OTQ5MDQ1Njk4MDQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; TS01609085=0155200027bccd80d107c215d94c4501af96062a02fd966adb265e6a1437920e3a7a2a88b177309081aa7e18982c7c5a97f7fa2128; TS01f3ebfd=015520002735fbfddaed31e4aeec6ca45bacf3e925b4de113d9e930a3419e1eccf381279fa22f779409771c7f3a5d4e427f24cb46e; _ga_ZE7SEP1EF1=GS1.1.1694904568.23.1.1694907417.0.0.0; dtLatC=2; b0bc2557a16ad5301891702c7711c375=1e5cf5ff97842335144890fd28fb7e92; _uetsid=6399dda0530911eeb91ce3f1017fe399; _uetvid=0a2f3150346411eeac70a904f5b67e73; _ga_HCPL89BEYP=GS1.1.1694904568.33.1.1694907418.27.0.0; _ga=GA1.1.1326062448.1691331477; _hjIncludedInSessionSample_1993487=0; _dc_gtm_UA-18783836-7=1; cebsp_=13; _ce.s=v~b7779e39e6ae8d9a7d4cd472a12ed877f674aa28~lcw~1694907418494~vpv~11~as~false~v11.fhb~1694701165868~v11.lhb~1694701165868~gtrk.la~lmmo3ynf~v11.cs~410675~v11nv~-2~v11.sla~1694907418494~v11.s~128763c0-54e9-11ee-b9d0-a54af4ed5719~lcw~1694907418495; RT="z=1&dm=www.santander.com.ar&si=bb93e321-29b3-428b-a419-69efb4fd65a1&ss=lmmnw8w1&sl=1&tt=v4&rl=1&ld=7x8k"; _clsk=16jq8q6|1694907418933|16|0|y.clarity.ms/collect; rxvt=1694909218953|1694902838648; dtPC=507417297_537h11vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'referer: https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=10' \
  -H 'sec-ch-ua: "Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' \
  -H 'x-dtpc: $507417297_537h11vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed''',
        11:'''curl 'https://www.santander.com.ar/banco/contenthandler/\u0021ut/p/digest\u0021eXuoZue-FQZVRV1EtaAziQ/searchfeed/search?sortKey=sortdestdefault&constraint=%7b%22type%22%3a%22category%22%2c%22id%22%3a%22rubro%22%2c%22values%22%3a%5b%22Compras%22%5d%7d&sortOrder=asc&index=search_service_portal%3a%3a/aplicaciones/tsr/collections/catalogo&query=*&start=120&results=12' \
  -H 'authority: www.santander.com.ar' \
  -H 'accept: */*' \
  -H 'accept-language: es-ES,es;q=0.9,en;q=0.8' \
  -H 'content-type: application/atom+xml; charset=UTF-8' \
  -H 'cookie: _gcl_au=1.1.1431664508.1691331476; _tt_enable_cookie=1; _ttp=Maq0rh1LD3C5M7ug9nlhMdwVqJD; _hjSessionUser_1993487=eyJpZCI6ImQ0Y2RiMGQ1LThjOWEtNTIwNS1hZWE0LTU4ZjUxNjkxNmNlYyIsImNyZWF0ZWQiOjE2OTEzMzE0NzY2NjMsImV4aXN0aW5nIjp0cnVlfQ==; bmuid=1691331480648-C6D4B3BB-B193-42C5-AD7E-AD4DA375C858; ga_sr_uid=92250777; ga_sr_seg=Universidad; ga_sr_cli=Cliente%20Santander; ga_sr_utyp=Usuario%20Logueado; ga_sr_styp=Usuario%20Logueado; _gid=GA1.3.1412623209.1694701025; _gaexp=GAX1.3.TSDKYmrqRXS_fw3cufLJrg.19628.0\u0021HTJ3P2lcQDmDF-CWGn3AVw.19651.1\u00215TxtJ_tgSSmNH44NxcHu4A.19708.1; _clck=2zva5g|2|ff2|0|1313; rxVisitor=1694894075322R6E4E1055ALG62JAKM12HRMFLOUUBH0D; dtCookie=v_4_srv_6_sn_2A41BE1436166DC846BE29275568CF59_perc_100000_ol_0_mul_1_app-3Acce8d23ebab01684_1; BSRD=\u0021f2iCcljGzaKSIBcKWz0yZ36n9QTefmXaesk3sO+6p/ZqwIlk8RnEJ5sKDrZ/SmzpuYXk/XiZmSAuoWs=; cebs=1; _ce.clock_event=1; _ce.clock_data=2217%2C181.230.193.17%2C1%2C3357fadb0316939352bbdd4d5360a97f; _hjSession_1993487=eyJpZCI6IjFlZDc5YTBmLWY5YzMtNGZjMS1iNWMyLThhODE5MjU1N2U3OSIsImNyZWF0ZWQiOjE2OTQ5MDQ1Njk4MDQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; TS01609085=0155200027bccd80d107c215d94c4501af96062a02fd966adb265e6a1437920e3a7a2a88b177309081aa7e18982c7c5a97f7fa2128; TS01f3ebfd=015520002735fbfddaed31e4aeec6ca45bacf3e925b4de113d9e930a3419e1eccf381279fa22f779409771c7f3a5d4e427f24cb46e; _hjIncludedInSessionSample_1993487=0; _clsk=16jq8q6|1694907589039|17|0|y.clarity.ms/collect; _ga_ZE7SEP1EF1=GS1.1.1694904568.23.1.1694907595.0.0.0; _ce.s=v~b7779e39e6ae8d9a7d4cd472a12ed877f674aa28~lcw~1694907595138~vpv~11~as~false~v11.fhb~1694701165868~v11.lhb~1694701165868~gtrk.la~lmmo7wuj~v11.cs~410675~v11nv~-2~v11.sla~1694907595173~v11.s~128763c0-54e9-11ee-b9d0-a54af4ed5719~v11.send~1694907594603~lcw~1694907595174; dtLatC=3; dtSa=-; RT="z=1&dm=www.santander.com.ar&si=bb93e321-29b3-428b-a419-69efb4fd65a1&ss=lmmnw8w1&sl=1&tt=v4&rl=1"; b0bc2557a16ad5301891702c7711c375=a253d705438524cc1f8e3ac5d09d9401; _ga_HCPL89BEYP=GS1.1.1694904568.33.1.1694907595.54.0.0; _ga=GA1.3.1326062448.1691331477; _uetsid=6399dda0530911eeb91ce3f1017fe399; _uetvid=0a2f3150346411eeac70a904f5b67e73; _dc_gtm_UA-18783836-7=1; cebsp_=14; rxvt=1694909396313|1694902838648; dtPC=507595221_675h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'referer: https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina=11' \
  -H 'sec-ch-ua: "Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' \
  -H 'x-dtpc: $507595221_675h10vKHPGRJFFCVRRRNKIUUVULCMUPISCMUUU-0e0' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed'''                      
        }
        #realiza requests de 1 a 11
        for i in range(1, 12): 
            request = Request.from_curl(curl_command=curl_command[i], callback=self.handle_content)
            yield request  

        '''#este bloque de codigo sirve para manejar la paginacion del sitio
        next_page = "https://www.santander.com.ar/banco/online/personas/beneficios/compras?pagina={}".format(self.pag)
        print("next page: " + next_page)

        #la ultima pagina es la numero 11 ---> ESTA HARDCODEADO FEO
        if self.pag <= 11:
           self.pag+=1      #aumento el contador
           #yield from response.follow(next_page, callback=self.parse)
           yield response.follow(next_page, callback=self.parse)'''


    def handle_content(self, response):
        namespaces = {
        'atom': 'http://www.w3.org/2005/Atom',
        'wplc': 'http://www.ibm.com/wplc/atom/1.0'  # Replace with the actual WPLC namespace URI
        }

        promociones = response.xpath('//atom:entry', namespaces=namespaces)
        for promocion in promociones:
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
            entry = {
                'tarjeta' : promocion.xpath('./wplc:field[@id="medios"]/text()', namespaces=namespaces).getall(),
                'local' : promocion.xpath('./wplc:field[@id="empresa"]/text()', namespaces=namespaces).get(),
                'producto' : promocion.xpath('./atom:title/text()', namespaces=namespaces).get(),
                'dia_semanal' : promocion.xpath('./wplc:field[@id="diabox"]/text()', namespaces=namespaces).getall(),
                'beneficio_cuotas' : promocion.xpath('.//wplc:field[@id="infobeneficiolinea1"]/text()', namespaces=namespaces).get() or ""+' '
                                    +promocion.xpath('.//wplc:field[@id="infobeneficiolinea2"]/text()', namespaces=namespaces).get() or "",
                'valido_hasta' : "{}".format(end_date) or None,
                'valido_desde' : "{}".format(start_date) or None,
                'descripcion_descuento' : promocion.xpath('./wplc:field[@id="description"]/text()', namespaces=namespaces).get(),
            }
            #se guarda cada entry en la lista de entries
            promos.append(entry)
            #se mete cada entry en supabase
            response = supabase.table("DESCUENTO").insert(entry).execute()
        
   

    #def close(self, reason):


#configuracion de console log
configure_logging({"LOG_FORMAT": "%(levelname)s: %(message)s"})

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



