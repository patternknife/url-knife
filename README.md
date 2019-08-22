# Extract-normalize-urls [![NPM version](https://img.shields.io/npm/v/extract-normalize-urls.svg)](https://www.npmjs.com/package/extract-normalize-urls)
## Overview
Extract and normalize urls, fuzzy urls, urls without protocols, uris in natural language texts.

#### URL extractor
<a href="https://jsfiddle.net/AndrewKang/xtfjn8g3/" target="_blank">LIVE DEMO</a>

##### If you can't see any results on 'jsfiddle.net', change the 'Editor layout' like this.
![how-to-see](https://user-images.githubusercontent.com/46193964/61584977-777d9200-ab8c-11e9-8e68-11b01c592b73.png)

#### Fuzzy URL extractor
<a href="https://jsfiddle.net/AndrewKang/p0tc4ovb/" target="_blank">LIVE DEMO</a>

## Installation

For ES5 users,

``` html
<html>
       <body>
       	<p id="content"></p>
       	<script src="../dist/extract-normalize-urls.bundle.js"></script>
       	<script type="text/javascript">
       
      
       	</script>
       </body>
</html>
```

For ES6 npm users, do 'npm install --save extract-normalize-urls' on console.

``` html
import Pattern from 'extract-normalize-urls';
```

## Syntax & Usage
[Chapter 1. Normalize or parse one URL](#chapter-1-normalize-or-parse-one-url)

[Chapter 2. Extract all URLs](#chapter-2-extract-all-urls)

[Chapter 3. Extract URIs with certain names](#chapter-3-extract-uris-with-certain-names)

[Chapter 4. Extract all fuzzy URLs](#chapter-4-extract-all-fuzzy-urls)

[Chapter 5. Highlight all URLs in texts](#chapter-5-highlight-all-urls-in-texts)

[Chapter 6. Extract all URLs in raw HTML or XML](#chapter-6-extract-all-urls-in-raw-html-or-xml)


#### Chapter 1. Normalize or parse one URL
  
``` javascript
/**
* @brief
* Normalize an url with potential human errors (Intranet urls are not normalized.)
*/
var sample1 = Pattern.UrlArea.normalizeUrl("htp/:/abcgermany.,def;:9094 #park//noon??abc=retry")
var sample2 = Pattern.UrlArea.normalizeUrl("'://abc.jppp:9091 /park/noon'")
var sample3 = Pattern.UrlArea.normalizeUrl("ss hd : /university,.acd. ;jpkp: 9091/adc??abc=.com")

 ```
 ###### console.log() 
 ``` javascript
{
  "url": "htp/:/abcgermany.,def;:9094 #park//noon??abc=retry",
  "normalizedUrl": "http://abcgermany.de:9094#park/noon?abc=retry",
  "removedTailOnUrl": "",
  "protocol": "http",
  "onlyDomain": "abcgermany.de",
  "onlyParams": "?abc=retry",
  "onlyUri": "#park/noon",
  "onlyUriWithParams": "#park/noon?abc=retry",
  "onlyParamsJsn": {
    "abc": "retry"
  },
  "type": "domain",
  "port": "9094"
}
{
  "url": "'://abc.jppp:9091 /park/noon'",
  "normalizedUrl": "abc.jp:9091/park/noon",
  "removedTailOnUrl": "'",
  "protocol": null,
  "onlyDomain": "abc.jp",
  "onlyParams": null,
  "onlyUri": "/park/noon'",
  "onlyUriWithParams": "/park/noon'",
  "onlyParamsJsn": null,
  "type": "domain",
  "port": "9091"
}
{
  "url": "ss hd : /university,.acd. ;jpkp로 접속",
  "normalizedUrl": "ssh://university.ac.jp",
  "removedTailOnUrl": "",
  "protocol": "ssh",
  "onlyDomain": "university.ac.jp",
  "onlyParams": null,
  "onlyUri": null,
  "onlyUriWithParams": null,
  "onlyParamsJsn": null,
  "type": "domain",
  "port": null
}
 ``` 
``` javascript
/**
* @brief
* Parse an url with no potential human errors
*/
var url = Pattern.UrlArea.parseUrl("xtp://gooppalgo.com/park/tree/?abc=1")
 ```
 ###### console.log() 
 ``` javascript
 {
  "url": "xtp://gooppalgo.com/park/tree/?abc=1",
  "removedTailOnUrl": "",
  "protocol": "xtp (unknown protocol)",
  "onlyDomain": "gooppalgo.com",
  "onlyParams": "?abc=1",
  "onlyUri": "/park/tree/",
  "onlyUriWithParams": "/park/tree/?abc=1",
  "onlyParamsJsn": {
    "abc": "1"
  },
  "type": "domain",
  "port": null
}
 ```
 
 #### Chapter 2. Extract all URLs
 
 ``` javascript
     var textStr = 'http://[::1]:8000에서 http ://www.example.com/wpstyle/?p=364 is ok \n' +
         'HTTP://foo.com/blah_blah_(wikipedia) https://www.google.com/maps/place/USA/@36.2218457,... tnae1ver.com:8000on the internet  Asterisk\n ' +
         'the packed1book.net. fakeshouldnotbedetected.url?abc=fake s5houl７十七日dbedetected.jp?japan=go&html=<span>가나다@pacbook.net</span>; abc.com/ad/fg/?kk=5 abc@daum.net' +
         'Have you visited http://goasidaio.ac.kr?abd=5안녕하세요?5...,.&kkk=5rk.,, ' +
         'http://✪df.ws/123\n' +
         'http://142.42.1.1:8080/\n' +
         'http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com ' +
         'Have <b>you</b> visited goasidaio.ac.kr?abd=5hell0?5...&kkk=5rk.,. ';
  
      /**
       * @brief
       * Distill all urls from normal text
       * @author Andrew Kang
       * @param textStr string required
       * @param noProtocolJsn object
       *    default :  {
                  'ip_v4' : false,
                  'ip_v6' : false,
                  'localhost' : false,
                  'intranet' : false
              }
        
  var urls = Pattern.TextArea.extractAllUrls(textStr, {
                     'ip_v4' : true,
                     'ip_v6' : false,
                     'localhost' : false,
                     'intranet' : true
 })
  ```
  ###### console.log() 
 <a href="https://jsfiddle.net/AndrewKang/xtfjn8g3/" target="_blank">LIVE DEMO</a>
 
#### Chapter 3. Extract URIs with certain names

``` javascript

var sampleText = 'https://google.com/abc/777?a=5&b=7 abc/def 333/kak abc/55에서 abc/53 abc/53a/ka /123a/abc/556/dd /abc/123?a=5&b=tkt /xyj/asff' +
               'a333/kak  nice/guy/ bad/or/nice/guy ssh://nice.guy.com/?a=dkdfl';
 
    /**
     * @brief
     * Distill uris with certain names from normal text
     * @author Andrew Kang
     * @param textStr string required
     * @param uris array required
     * for example, [['a','b'], ['c','d']]
     * If you use {number}, this means 'only number' ex) [['a','{number}'], ['c','d']]
     * @param endBoundary boolean (default : false)
     * @return array
     */ 
               
 var uris = Pattern.TextArea.extractCertainUris(sampleText,
  [['{number}', 'kak'], ['nice','guy'],['abc', '{number}']], true)
 
 // 'If endBoundary is set to false, more uris are detected.'
 // This detects all URIs containing '{number}/kak' or nice/guy' or 'abc/{number}'
 ```
 ###### console.log() 
 ``` javascript
[
  {
    "uri_detected": {
      "value": {
        "url": "/abc/777?a=5&b=7",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": "",
        "onlyParams": "?a=5&b=7",
        "onlyUri": "/abc/777",
        "onlyUriWithParams": "/abc/777?a=5&b=7",
        "onlyParamsJsn": {
          "a": "5",
          "b": "7"
        },
        "type": "domain",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 18,
        "end": 34
      }
    },
    "in_what_url": {
      "value": {
        "url": "https://google.com/abc/777?a=5&b=7",
        "removedTailOnUrl": "",
        "protocol": "https",
        "onlyDomain": "google.com",
        "onlyParams": "?a=5&b=7",
        "onlyUri": "/abc/777",
        "onlyUriWithParams": "/abc/777?a=5&b=7",
        "onlyParamsJsn": {
          "a": "5",
          "b": "7"
        },
        "type": "domain",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 0,
        "end": 34
      }
    }
  },
  {
    "uri_detected": {
      "value": {
        "url": "333/kak",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": null,
        "onlyParams": null,
        "onlyUri": "333/kak",
        "onlyUriWithParams": "333/kak",
        "onlyParamsJsn": null,
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 43,
        "end": 51
      }
    },
    "in_what_url": null
  },
  {
    "uri_detected": {
      "value": {
        "url": "abc/53",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": null,
        "onlyParams": null,
        "onlyUri": "abc/53",
        "onlyUriWithParams": "abc/53",
        "onlyParamsJsn": null,
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 60,
        "end": 67
      }
    },
    "in_what_url": null
  },
  {
    "uri_detected": {
      "value": {
        "url": "abc/533/ka",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": null,
        "onlyParams": null,
        "onlyUri": "abc/533/ka",
        "onlyUriWithParams": "abc/533/ka",
        "onlyParamsJsn": null,
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 67,
        "end": 77
      }
    },
    "in_what_url": null
  },
  {
    "uri_detected": {
      "value": {
        "url": "/123a/abc/556/dd",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": null,
        "onlyParams": null,
        "onlyUri": "/123a/abc/556/dd",
        "onlyUriWithParams": "/123a/abc/556/dd",
        "onlyParamsJsn": null,
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 89,
        "end": 105
      }
    },
    "in_what_url": null
  },
  {
    "uri_detected": {
      "value": {
        "url": "/abc/123?a=5&b=tkt",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": null,
        "onlyParams": "?a=5&b=tkt",
        "onlyUri": "/abc/123",
        "onlyUriWithParams": "/abc/123?a=5&b=tkt",
        "onlyParamsJsn": {
          "a": "5",
          "b": "tkt"
        },
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 106,
        "end": 124
      }
    },
    "in_what_url": null
  },
  {
    "uri_detected": {
      "value": {
        "url": "nice/guy",
        "removedTailOnUrl": "/",
        "protocol": null,
        "onlyDomain": null,
        "onlyParams": null,
        "onlyUri": "nice/guy",
        "onlyUriWithParams": "nice/guy",
        "onlyParamsJsn": null,
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 144,
        "end": 153
      }
    },
    "in_what_url": null
  },
  {
    "uri_detected": {
      "value": {
        "url": "/or/nice/guy",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": null,
        "onlyParams": null,
        "onlyUri": "/or/nice/guy",
        "onlyUriWithParams": "/or/nice/guy",
        "onlyParamsJsn": null,
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 157,
        "end": 170
      }
    },
    "in_what_url": null
  }
]
```
 
#### Chapter 4. Extract all fuzzy URLs
###### This does not detect intranets due to false positives. If you need to extract intranets, go to the Chapter 4. below. 

``` javascript
var textStr = '142 .42.1.1:8080 123.45 xtp://--[::1]:8000에서 h ttpp ;//-www.ex ample;com    -/wpstyle/??p=3?6/4&x=5/3 in the ssh h::/;/ww.example.com/wpstyle/?p=364 is ok ' +
         'h ttp:/://132 .42.,1.1 HT TP:// foo, co,.kr/blah_blah_(wikipedia) https://www.google .org :8005/maps/place/USA/@36.2218457,... tnae1ver.co. jp;8000on the internet  Asterisk\n ' +
         'the packed1book.net. 가나다@apacbook.ac.kr fakeshouldnotbedetected.url?abc=fake s5houl７十七日dbedetected.jp?japan=go&html=<span>가나다@pacbook.travelersinsurance</span>;' +
         ' abc,com//ad/fg/?kk=5 abc@daum.net Have you visited http://agoasidaio.ac.kr?abd=55...,.&kkk=5rk.,, ' +
         'Have <b>you</b> visited goasidaio.ac.kr?abd=5hell0?5...&kkk=5rk.,. ';
 
     /**
      * @brief
     * Distill all urls including fuzzy matched ones from normal text
      * @author Andrew Kang
      * @param textStr string required
        
       
 var urls = Pattern.TextArea.extractAllFuzzyUrls(textStr)
 ```
 ###### console.log() 
<a href="https://jsfiddle.net/AndrewKang/p0tc4ovb/" target="_blank">LIVE DEMO</a>

#### Chapter 5. Highlight all URLs in texts
  
``` javascript

var sampleText = "If you visit "192.179.3.5?abc=2"..  
                   http://[::1]:8000.... "

    /**
     * @brief
     * Distill all urls
     * @author Andrew Kang
     * @param textStr string required
     * @param clsName string required
     * @param contentEditableMode boolean default false
     * @param noProtocolJsn object
     *    default :  {
                'ip_v4' : false,
                'ip_v6' : false,
                'localhost' : false,
                'intranet' : false
            }

     * @return string
     */
             
var textStr_new = Pattern.TextEditorArea.addClassToAllUrls(sampleText, 'highlighted1', false, {
                              'ip_v4' : true,
                              'ip_v6' : true,
                              'localhost' : true,
                              'intranet' : false
                          });
 ```

You can check how url patterns are highlighted by running the sample source below.

https://github.com/Andrew-Kang-G/extract-normalize-urls/blob/master/public/index.html

or 
<a href="https://jsfiddle.net/AndrewKang/xtfjn8g3/" target="_blank">LIVE DEMO</a>

#### Chapter 6. Extract all URLs in raw HTML or XML
  
``` javascript
    // The sample of 'XML (HTML)'
var xmlStr =
        'en.wikipedia.org/wiki/Wikipedia:About\n' +
        '<body><p>packed1book.net?user[name][first]=tj&user[name][last]=holowaychuk</p>\n' +
        'fakeshouldnotbedetected.url?abc=fake -s5houl７十七日dbedetected.jp?japan=go- ' +
        'plus.google.co.kr0에서.., \n' +
        'https://plus.google.com/+google\n' +
        'https://www.google.com/maps/place/USA/@36.2218457,...' +
        '<img style=\' = > float : none ; height: 200px;max-width: 50%;margin-top : 3%\' alt="undefined" src="http://www.aaa가가.com/image/showWorkOrderImg?fileName=12345.png"/>\n' +
        '<!--how about adackedbooked.co.kr-the site?  请发邮件给我abc件给@navered.com ssh://www.aaa가.com" <p >--邮件给aa件给@daum.net</p> www.naver.com\n  <p style="width: 100%"></p>-->  "abc@daum.net"로 보내주세요. ' +
        '-gigi.dau.ac.kr?mac=10 -dau.ac.kr?mac=10 <p id="abc" class="def xxx gh" style="<>">abcd@daum.co.kr에서 가나다@pacbook.net<span style="color: rgb(127,127,127);">Please align the paper to the left.</span>&nbsp;</p>\n' +
        '<p> 구루.com <img style="float:none;height: 200px;margin-top : 3%" src="/image/showWorkOrderImg?fileName=123456.png" alt="undefined" abc/></p>\n' +
        'http: //ne1ver.com:8000?abc=1&dd=5 localhost:80 estonia.ee/ estonia.ee? <p class="https://www.aadc给s.cn"> 	https://flaviocopes.com/how-to-inspect-javascript-object/ ※Please ask 203.35.33.555:8000 if you have any issues! ※&nbsp;&nbsp;&nbsp;&nbsp;</p></body> Have you visited goasidaioaaa.ac.kr';
        
var urls = PatternExtractor.XmlArea.extractAllUrls(xmlStr);    
```
###### console.log()
``` javascript
 [
// Not all listed
     {
       "value": {
         "url": "packed1book.net?user[name][first]=tj&user[name][last]=holowaychuk",
         "removedTailOnUrl": "",
         "protocol": null,
         "onlyDomain": "packed1book.net",
         "onlyParams": "?user[name][first]=tj&user[name][last]=holowaychuk",
         "onlyUri": null,
         "onlyUriWithParams": "?user[name][first]=tj&user[name][last]=holowaychuk",
         "onlyParamsJsn": {
           "user": {
             "name": {
               "first": "tj",
               "last": "holowaychuk"
             }
           }
         },
         "type": "domain",
         "port": null
       },
       "area": "text"
   },
   {
     "value": {
       "url": "adackedbooked.co.kr",
       "removedTailOnUrl": "",
       "protocol": null,
       "onlyDomain": "adackedbooked.co.kr",
       "onlyParams": null,
       "onlyUri": null,
       "onlyUriWithParams": null,
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "comment"
   }
    .....
 ]
```

Please inform me of more sophisticated patterns you need by leaving issues on Github or emailing me at studypurpose@naver.com.
