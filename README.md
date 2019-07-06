# Pattern-dreamer [![NPM version](https://img.shields.io/npm/v/pattern-dreamer.svg)](https://www.npmjs.com/package/pattern-dreamer)
## Overview
Pattern-dreamer always challenges patterns hard to be extracted in texts.  
Currently it handles six patterns 
(url, uri, fuzzy url, domain, email, strings before and after the colon).

#### URL extractor
<a href="https://jsfiddle.net/AndrewKang/xtfjn8g3/" target="_blank">LIVE DEMO</a>

#### Fuzzy URL extractor (beta, parameters, uris in urls not yet fully considered)
<a href="https://jsfiddle.net/AndrewKang/p0tc4ovb/" target="_blank">LIVE DEMO</a>

## Update
From ver. 2.0, the new function '.extractAllFuzzyUrls()' is available as a beta version. This will help us to extract all urls even in wrong formats possibly caused by human errors.   
Also, the return format of 'PatternDreamer.TextArea.extractAllEmails' has been changed.

From ver. 1.7, 'Strings before and after the colon' is now available to be extracted. 

[Go to the Chapter 2. Strings before and after the colon](#chapter-2-strings-before-and-after-the-colon)
 
From ver. 1.6, it is available to extract 'ip_v4, ip_v6, localhost and intranet' even when they miss protocols such as 'http'.

``` javascript
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

     * @return array
     */
     
 var sampleString = '192.179.3.5 
 fakeshouldnotbedetected.urld?abc=fake
 http://[::1]:8000에서
  http ://www.example.com/wpstyle/?p=364 is ok... ';      
  
 var urls = PatternDreamer.TextArea.extractAllUrls(sampleString, {
                    'ip_v4' : true,
                    'ip_v6' : false,
                    'localhost' : false,
                    'intranet' : true
                });
 
 // Result
  [   {
        "value": {
          "url": "192.179.3.5",
          "removedTailOnUrl": "",
          "protocol": null,
          "onlyDomain": "192.179.3.5",
          "onlyParams": null,
          "onlyUri": null,
          "onlyUriWithParams": null,
          "onlyParamsJsn": null,
          "type": "ip",
          "port": null
        },
        "area": "text",
        "index": {
          "start": 0,
          "end": 11
        }
      },
      {
      "value": {
        "url": "fakeshouldnotbedetected.urld?abc=fake",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": "fakeshouldnotbedetected.urld",
        "onlyParams": "?abc=fake",
        "onlyUri": null,
        "onlyUriWithParams": "?abc=fake",
        "onlyParamsJsn": {
          "abc": "fake"
        },
        "type": "domain",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 14,
        "end": 51
      }
     },
 ... etc           
 ``` 
However, that is a matter of choice. For example, if you set noProtocolJsn['ip_v4'] to 'true',
the string like '192.179.3.5' is extracted. If it is set to 'false', '192.179.3.5' is not extracted 
but 'http://192.179.3.5' is still extracted, as the protocol 'http' is detected.

If you set set noProtocolJsn['intranet'] to 'true', 'fakeshouldnotbedetected.urld?abc=fake' is detected.
However, it should not be extracted, as the root domain 'urld' does not exist in the world. 
The URL does not even have any protocols.

In case of "noProtocolJsn['intranet']", some false positives can be caused. 
  
From ver. 1.5.5, the 'protocol://ip_v6' URL type is now available to be extracted. 

We have been able to extract missing protocol URLs from texts. Now, from ver. 1.4.0, 
we can extract certain missing domain URIs from texts. Check '3.1 Plain texts (Certain URIs)'.

## Installation

For ES5 users,

``` html
<html>
       <body>
       	<p id="content"></p>
       	<script src="../dist/pattern-dreamer.bundle.js"></script>
       	<script type="text/javascript">
       
      
       	</script>
       </body>
</html>
```

For ES6 npm users, do 'npm install --save pattern-dreamer' on console.

``` html
import PatternDreamer from 'pattern-dreamer';
```

## Syntax & Usage
[Chapter 1. URL, URI](#chapter-1-url,-uri)

[Chapter 2. Strings before and after the colon](#chapter-2-strings-before-and-after-the-colon)

[Chapter 3. Email](#chapter-3-email)

[Chapter 4. Elements and Comment](#chapter-4-elements-and-comment)




#### Chapter 1. URL, URI

##### 1. Text editor
  
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
             
var textStr_new = PatternDreamer.TextEditorArea.addClassToAllUrls(sampleText, 'highlighted1', false, {
                              'ip_v4' : true,
                              'ip_v6' : true,
                              'localhost' : true,
                              'intranet' : false
                          });
 ```

You can check how url patterns are highlighted by running the sample source below.

https://github.com/Andrew-Kang-G/pattern-dreamer/blob/master/public/index.html

or 
<a href="https://jsfiddle.net/AndrewKang/xtfjn8g3/" target="_blank">LIVE DEMO</a>
 
##### 2. One url
  
``` javascript
var url = PatternDreamer.UrlArea.assortUrl("xtp://gooppalgo.com/park/tree/?abc=1")
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
##### 3.1 Plain texts (Certain URIs)

``` javascript

var sampleText = ' abc/def /123a/abc/def /abc/def?a=5&b=tkt /xyj/asff' +
                'kds/sdsd https://google.com/abc/def?a=5&b=7 nice/guy bad/or/nice/guy ssh://nice.guy.com/?a=dkdfl';
                
 var uris = PatternDreamer.TextArea.extractCertainUris(sampleText, [['abc', 'def'], ['nice','guy']]) 
 // This detects all URIs containing 'nice/guy' or 'abc/def'
 ```
 ###### console.log() 
 ``` javascript
 [
  {
    "uri_detected": {
      "value": {
        "url": "abc/def",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": null,
        "onlyParams": null,
        "onlyUri": "abc/def",
        "onlyUriWithParams": "abc/def",
        "onlyParamsJsn": null,
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 0,
        "end": 7
      }
    },
    "in_what_url": null
  },
  {
    "uri_detected": {
      "value": {
        "url": "/123a/abc/def",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": null,
        "onlyParams": null,
        "onlyUri": "/123a/abc/def",
        "onlyUriWithParams": "/123a/abc/def",
        "onlyParamsJsn": null,
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 8,
        "end": 21
      }
    },
    "in_what_url": null
  },
  {
    "uri_detected": {
      "value": {
        "url": "/abc/def?a=5&b=tkt",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": null,
        "onlyParams": "?a=5&b=tkt",
        "onlyUri": "/abc/def",
        "onlyUriWithParams": "/abc/def?a=5&b=tkt",
        "onlyParamsJsn": {
          "a": "5",
          "b": "tkt"
        },
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 22,
        "end": 40
      }
    },
    "in_what_url": null
  },
  {
    "uri_detected": {
      "value": {
        "url": "/abc/def?a=5&b=7",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": "",
        "onlyParams": "?a=5&b=7",
        "onlyUri": "/abc/def",
        "onlyUriWithParams": "/abc/def?a=5&b=7",
        "onlyParamsJsn": {
          "a": "5",
          "b": "7"
        },
        "type": "domain",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 77,
        "end": 93
      }
    }, 
    // *** In case the full-url is detected
    "in_what_url": {
      "value": {
        "url": "https://google.com/abc/def?a=5&b=7",
        "removedTailOnUrl": "",
        "protocol": "https",
        "onlyDomain": "google.com",
        "onlyParams": "?a=5&b=7",
        "onlyUri": "/abc/def",
        "onlyUriWithParams": "/abc/def?a=5&b=7",
        "onlyParamsJsn": {
          "a": "5",
          "b": "7"
        },
        "type": "domain",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 59,
        "end": 93
      }
    }
  },
  {
    "uri_detected": {
      "value": {
        "url": "nice/guy",
        "removedTailOnUrl": "",
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
        "start": 94,
        "end": 102
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
        "start": 106,
        "end": 118
      }
    },
    "in_what_url": null
  }
]
```
##### 3.2 Plain texts (Fuzzy URL)

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
      * @param noProtocolJsn object
      *    default :  {
                 'ip_v4' : false,
                 'ip_v6' : false,
                 'localhost' : false,
                 'intranet' : false
             }
       
 var urls = PatternDreamer.TextArea.extractAllFuzzyUrls(textStr)
 ```
 ##### console.log() ( To print them out, JSON.stringify(urls, null, 2) )
<a href="https://jsfiddle.net/AndrewKang/p0tc4ovb/" target="_blank">LIVE DEMO</a>

##### 3.3 Plain texts (URL)

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
       
 var urls = PatternDreamer.TextArea.extractAllUrls(textStr, {
                    'ip_v4' : true,
                    'ip_v6' : false,
                    'localhost' : false,
                    'intranet' : true
})
 ```
 ##### console.log() ( To print them out, JSON.stringify(urls, null, 2) )
 
<a href="https://jsfiddle.net/AndrewKang/xtfjn8g3/" target="_blank">LIVE DEMO</a>

##### 4. XML (HTML)

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
        
var urls = PatternDreamer.XmlArea.extractAllUrls(xmlStr);    
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


##### 1. Plain texts

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
    var sbacs = PatternDreamer.TextArea.extractAllStrBfAfColon(sampleTxt, ',');
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

##### 1. Plain texts

``` javascript
var emails = PatternDreamer.TextArea.extractAllEmails(textStr),
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

##### 1. Elements
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
        
var elements = PatternDreamer.XmlArea.extractAllElements(xmlStr);   
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
 
##### 2. Comments
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
           
var comments = PatternDreamer.XmlArea.extractAllComments(xmlStr); 
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
