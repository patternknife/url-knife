# Pattern-extractor [![NPM version](https://img.shields.io/npm/v/pattern-extractor.svg)](https://www.npmjs.com/package/pattern-extractor)
## Overview
Pattern-extractor always challenges patterns hard to be extracted in texts.  
Currently it handles six patterns 
(url, uri, fuzzy url, domain, email, strings before and after the colon).

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
       	<script src="../dist/pattern-extractor.bundle.js"></script>
       	<script type="text/javascript">
       
      
       	</script>
       </body>
</html>
```

For ES6 npm users, do 'npm install --save pattern-extractor' on console.

``` html
import PatternExtractor from 'pattern-extractor';
```

## Syntax & Usage
[Chapter 1. URL, URI](#chapter-1-url,-uri)

[Chapter 2. Strings before and after the colon](#chapter-2-strings-before-and-after-the-colon)

[Chapter 3. Email](#chapter-3-email)

[Chapter 4. Elements and Comment](#chapter-4-elements-and-comment)




#### Chapter 1. URL, URI

##### 1. TextArea (Certain URIs)

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
               
 var uris = PatternExtractor.TextArea.extractCertainUris(sampleText,
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

##### 2. TextEditorArea
  
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
             
var textStr_new = PatternExtractor.TextEditorArea.addClassToAllUrls(sampleText, 'highlighted1', false, {
                              'ip_v4' : true,
                              'ip_v6' : true,
                              'localhost' : true,
                              'intranet' : false
                          });
 ```

You can check how url patterns are highlighted by running the sample source below.

https://github.com/Andrew-Kang-G/pattern-extractor/blob/master/public/index.html

or 
<a href="https://jsfiddle.net/AndrewKang/xtfjn8g3/" target="_blank">LIVE DEMO</a>
 
##### 3. UrlArea
  
``` javascript
var url = PatternExtractor.UrlArea.assortUrl("xtp://gooppalgo.com/park/tree/?abc=1")
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
 
 
``` javascript
var url = PatternExtractor.UrlArea.normalizeUrl("xtp://gooppalgo.com/park/tree/?abc=1")
 ```
 ###### console.log() 
 ``` javascript
 {
  "url": "xtp:// gooppalgo.com/park/tree/?abc=1",
  "normalizedUrl": "ftp://gooppalgo.com/park/tree/?abc=1",
  "removedTailOnUrl": "",
  "protocol": "ftp",
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
 

##### 4. TextArea (Fuzzy URL)
###### This does not detect intranets due to false positives. If you need to extract intranets, go to 3.3 Plain texts (URL) below. 

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
        
       
 var urls = PatternExtractor.TextArea.extractAllFuzzyUrls(textStr)
 ```
 ###### console.log() 
<a href="https://jsfiddle.net/AndrewKang/p0tc4ovb/" target="_blank">LIVE DEMO</a>

##### 5. TextArea (URL)

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
       
 var urls = PatternExtractor.TextArea.extractAllUrls(textStr, {
                    'ip_v4' : true,
                    'ip_v6' : false,
                    'localhost' : false,
                    'intranet' : true
})
 ```
 ###### console.log() 
<a href="https://jsfiddle.net/AndrewKang/xtfjn8g3/" target="_blank">LIVE DEMO</a>

##### 6. XmlArea

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
#### Chapter 2. Strings before and after the colon


##### 1. TextArea

``` javascript

    var sampleTxt = 'olah billo:78517700-1f01- 11e3-a6b7-3c970e02b4ec, ' +
      'jiglo piglo:68517700-1f\t01-11e3-a6b7-3c970e02b4ec \n ' +
     'nimho james: 98517700-1f01-11e3 -a6b7-3c970e02b4ec\tkathy ruck:38517700-1f01-11e3-a6b7-3c970e02b4ec';
    
    /**
     * @brief
     * Distill all 'strings before and after the colon'
     * @author Andrew Kang
     * @param textStr string required
     * @param delimiter string (If no delimiter, the next priority is a line return, followed by a tab and space)
     * @return array
     */
    var sbacs = PatternExtractor.TextArea.extractAllStrBfAfColon(sampleTxt, ',');
 ```
 ###### console.log()
 ``` javascript
[
  {
    "value": {
      "original": "olah billo:78517700-1f01- 11e3-a6b7-3c970e02b4ec,",
      "left": "olah billo",
      "right": "78517700-1f01- 11e3-a6b7-3c970e02b4ec"
    },
    "area": "text",
    "index": {
      "start": 0,
      "end": 49
    }
  },
  {
    "value": {
      "original": "jiglo piglo:68517700-1f\t01-11e3-a6b7-3c970e02b4ec",
      "left": "jiglo piglo",
      "right": "68517700-1f\t01-11e3-a6b7-3c970e02b4ec"
    },
    "area": "text",
    "index": {
      "start": 49,
      "end": 101
    }
  },
  {
    "value": {
      "original": "nimho james: 98517700-1f01-11e3 -a6b7-3c970e02b4ec",
      "left": "nimho james",
      "right": "98517700-1f01-11e3 -a6b7-3c970e02b4ec"
    },
    "area": "text",
    "index": {
      "start": 101,
      "end": 153
    }
  },
  {
    "value": {
      "original": "kathy ruck:38517700-1f01-11e3-a6b7-3c970e02b4ec",
      "left": "kathy ruck",
      "right": "38517700-1f01-11e3-a6b7-3c970e02b4ec"
    },
    "area": "text",
    "index": {
      "start": 153,
      "end": 201
    }
  }
]
 ```

#### Chapter 3. Email

##### 1. TextArea

``` javascript
var emails = PatternExtractor.TextArea.extractAllEmails(textStr),
 ```
 
 ###### console.log() 
 ``` javascript
[
  {
    "value": {
      "email": "가나다@apacbook.ac.kr",
      "removedTailOnEmail": null,
      "type": "domain"
    },
    "area": "text",
    "index": {
      "start": 222,
      "end": 240
    }
  },
  .....
  
```


#### Chapter 4. Elements and Comment

##### 1. XmlArea (Elements)
``` javascript

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
        
var elements = PatternExtractor.XmlArea.extractAllElements(xmlStr);   
```
###### console.log() 
``` javascript
[
  {
    "value": "<body>",
    "elementName": "body",
    "startIndex": 0,
    "lastIndex": 5,
    "commentArea": false
  },
  {
    "value": "<p>",
    "elementName": "p",
    "startIndex": 6,
    "lastIndex": 8,
    "commentArea": false
  },
  {
    "value": "</p>",
    "elementName": "/p",
    "startIndex": 9,
    "lastIndex": 12,
    "commentArea": false
  },
  {
    "value": "<img style=' = > float : none ; height: 200px;max-width: 50%;margin-top : 3%' alt=\"undefined\" src=\"http://www.aaa가가.com/image/showWorkOrderImg?fileName=12345.png\"/>",
    "elementName": "img",
    "startIndex": 14,
    "lastIndex": 177,
    "commentArea": false
  },
  {
    "value": "<p >",
    "elementName": "p",
    "startIndex": 229,
    "lastIndex": 232,
    "commentArea": true
  },
  {
    "value": "</p>",
    "elementName": "/p",
    "startIndex": 251,
    "lastIndex": 254,
    "commentArea": true
  },
  {
    "value": "<p id=\"abc\" class=\"def xxx gh\" style=\"<>\">",
    "elementName": "p",
    "startIndex": 300,
    "lastIndex": 341,
    "commentArea": false
  },
  {
    "value": "<span style=\"color: rgb(127,127,127);\">",
    "elementName": "span",
    "startIndex": 375,
    "lastIndex": 413,
    "commentArea": false
  },
  {
    "value": "</span>",
    "elementName": "/span",
    "startIndex": 449,
    "lastIndex": 455,
    "commentArea": false
  },
  {
    "value": "</p>",
    "elementName": "/p",
    "startIndex": 462,
    "lastIndex": 465,
    "commentArea": false
  },
  {
    "value": "<p>",
    "elementName": "p",
    "startIndex": 467,
    "lastIndex": 469,
    "commentArea": false
  },
  {
    "value": "<img style=\"float:none;height: 200px;margin-top : 3%\" src=\"/image/showWorkOrderImg?fileName=123456.png\" alt=\"undefined\" abc/>",
    "elementName": "img",
    "startIndex": 470,
    "lastIndex": 594,
    "commentArea": false
  },
  {
    "value": "</p>",
    "elementName": "/p",
    "startIndex": 595,
    "lastIndex": 598,
    "commentArea": false
  },
  {
    "value": "<p class=\"https://www.aadc给s.cn\">",
    "elementName": "p",
    "startIndex": 635,
    "lastIndex": 667,
    "commentArea": false
  },
  {
    "value": "</p>",
    "elementName": "/p",
    "startIndex": 829,
    "lastIndex": 832,
    "commentArea": false
  },
  {
    "value": "</body>",
    "elementName": "/body",
    "startIndex": 833,
    "lastIndex": 839,
    "commentArea": false
  }
]
```
 
##### 2. XmlArea (Comments)
``` javascript

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
           
var comments = PatternExtractor.XmlArea.extractAllComments(xmlStr); 
```
###### console.log() 
``` javascript
[
  {
    "value": "<!-- 请发邮件给我abc件给@navered.com http://www.aaa가.com\" <p >--邮件给aa件给@daum.net</p> www.naver.com\n  -->",
    "startIndex": 179,
    "lastIndex": 274
  }
]
```
 
## More sophisticated parsing patterns

1. Url (From ver 1.0.1, more stronger than before)  
 
    A) The core regex is based on the 'Validator.js' 
    
    B) Rare cases such as localhost,ip numbers is detected
    
    C) Urls with no-protocol are distilled (strong point)
    
     e.g., a sample url without protocols such as http or https
     
        ```
        [...
           {
             "value": {
               "url": "s5houl７十七日dbedetected.jp?japan=go",
               "protocol": null,
               "onlyDomain": "s5houl７十七日dbedetected.jp",
               "onlyParams": "?japan=go",
               "onlyUri": null,
               "onlyUriWithParams": "?japan=go",
               "onlyParamsJsn": {
                 "japan": "go"
               },
               "type": "domain"
             },
             "area": "text"
           }
        ]
        ```
        
        // wrong domains such as this are not distilled
        ```
        fakeshouldnotbedetected.url?abc=fake
        ```
        
     The core regex combined with all existing root domains (around over 1770) has made it possible 
     to implement a logic to extract urls with no-protocol.  
   
    D) Detailed information about a parsed url from xmls or texts is provided. (strong point)
    
    e.g.,
    
    ```
    [...
        {
          "url": "xtp:// gooppalgo.com/park/tree/?abc=1",
          "protocol": "xtp (unknown protocol)",
          "onlyDomain": "gooppalgo.com",
          "onlyParams": "?abc=1",
          "onlyUri": "/park/tree/",
          "onlyUriWithParams": "/park/tree/?abc=1",
          "onlyParamsJsn": {
            "abc": "1"
          },
          "type": "domain"
        }
    ]
    ```
    
    E) For the "onlyParamsJsn" property, the 'fast-url-parser'(https://github.com/petkaantonov/urlparser) has been used.

2. Email  

    A) Can separate only emails from post-connected characters.  
        [ex.] abc@naver.comCOCO, cde@adela.co.kr에서, fgh@adela.co.kr(next)   
              -> abc@naver.com, cde@adela.co.kr, fgh@adela.co.kr  
                          
    B) Can separate only emails from pre-connected characters.      
        [ex.] 请发邮件给我abc@naver.com, ---과자@daum.net, "all_day@bbqg.com" 
              -> abc@naver.com, 과자@daum.net, all_day@bbqg.com
          
3. Element
   
    A) A well-known regex indicating tags is not simply '<[^>]+>'.
    This regex fails to parse some rare cases such as '`````<p class="here>to" style="width:100%">`````' where '>' is inserted in the 
    class attribute.
    
    B) This library has overcome the weakness above.

  
Please inform me of more sophisticated patterns you need by leaving issues on Github or emailing me at studypurpose@naver.com.
