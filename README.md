# Pattern-dreamer

## Overview

Pattern-dreamer's dream is always to get certain patterns(URL, URI, e-mail...) most without false positives in a string.

From ver. 1.5.5, the 'protocol://ip_v6' URL type is now available to be extracted. 

We have been able to parse URLs with no protocol from texts. Now, from ver. 1.4.0, 
we can parse certain URIs with no domain from texts. Check '3.1 Plain texts (Certain URIs)'.

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


#### Chapter 1. Get URLs, URIs in whatever situations !

##### 1. Text editor
  
``` javascript

var textStr = 'http://[::1]:8000에서 http ://www.example.com/wpstyle/?p=364 is ok \n' +
        'HTTP://foo.com/blah_blah_(wikipedia) https://www.google.com/maps/place/USA/@36.2218457,... tnae1ver.com:8000on the internet  Asterisk\n ' +
        'the packed1book.net. fakeshouldnotbedetected.url?abc=fake s5houl７十七日dbedetected.jp?japan=go&html=<span>가나다@pacbook.net</span>; abc.com/ad/fg/?kk=5 abc@daum.net' +
        'https://www.example.com/foo/?bar=baz&inga=42&quux\n' +
        'Have you visited http://goasidaio.ac.kr?abd=5안녕하세요?5...,.&kkk=5rk.,, ' +
        'http://✪df.ws/123\n' +
        'http://142.42.1.1:8080/\n' +
        'https://foo_bar.example.com에서 만나요. \n' +
        'http://foo.bar/?q=Test%20URL-encoded%20stuff \n' +
        'http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com ' +
        'Have <b>you</b> visited goasidaio.ac.kr?abd=5hell0?5...&kkk=5rk.,. ';
        
var textStr_new = PatternDreamer.TextEditorArea.addClassToAllUrls(textStr, 'highlighted1');
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

var textStr1 = '/abc/def abc/def /123a/abc/def /abc/def?a=5&b=tkt /xyj/asff' +
                'kds/sdsd https://google.com/abc/def?a=5&b=7 nice/guy bad/or/nice/guy ssh://nice.guy.com/?a=dkdfl';
                
 var uris = PatternDreamer.TextArea.extractCertainUris(textStr1, [['nice','guy'],['abc', 'def']]) 
 // This detects all URIs containing 'nice/guy' or 'abc/def'
 ```
 ###### console.log() 
 ``` javascript
 .... // Not all listed
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
        "start": 10,
        "end": 17
      }
    },
    "in_what_url": null
  },
  {
    "uri_detected": {
      "value": {
        "url": "abc/def?a=5",
        "removedTailOnUrl": "",
        "protocol": null,
        "onlyDomain": null,
        "onlyParams": "?a=5",
        "onlyUri": "abc/def",
        "onlyUriWithParams": "abc/def?a=5",
        "onlyParamsJsn": {
          "a": "5"
        },
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 18,
        "end": 29
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
        "start": 30,
        "end": 43
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
        "start": 44,
        "end": 62
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
        "onlyDomain": null,
        "onlyParams": "?a=5&b=7",
        "onlyUri": "/abc/def",
        "onlyUriWithParams": "/abc/def?a=5&b=7",
        "onlyParamsJsn": {
          "a": "5",
          "b": "7"
        },
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 99,
        "end": 115
      }
    },
    "in_what_url": {
      "value": {
        "url": "https://google.com/abc/def?a=5&b=7",
        "removedTailOnUrl": "",
        "protocol": "https",
        "onlyDomain": null,
        "onlyParams": "?a=5&b=7",
        "onlyUri": "https://google.com/abc/def",
        "onlyUriWithParams": "https://google.com/abc/def?a=5&b=7",
        "onlyParamsJsn": {
          "a": "5",
          "b": "7"
        },
        "type": "uri",
        "port": null
      },
      "area": "text",
      "index": {
        "start": 81,
        "end": 115
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
        "start": 116,
        "end": 124
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
        "start": 128,
        "end": 140
      }
    },
    "in_what_url": null
  }
]
```

##### 3.2 Plain texts (URL)

``` javascript
    var textStr = 'http://[::1]:8000에서 http ://www.example.com/wpstyle/?p=364 is ok \n' +
        'HTTP://foo.com/blah_blah_(wikipedia) https://www.google.com/maps/place/USA/@36.2218457,... tnae1ver.com:8000on the internet  Asterisk\n ' +
        'the packed1book.net. fakeshouldnotbedetected.url?abc=fake s5houl７十七日dbedetected.jp?japan=go&html=<span>가나다@pacbook.net</span>; abc.com/ad/fg/?kk=5 abc@daum.net' +
        'https://www.example.com/foo/?bar=baz&inga=42&quux\n' +
        'Have you visited http://goasidaio.ac.kr?abd=5안녕하세요?5...,.&kkk=5rk.,, ' +
        'http://✪df.ws/123\n' +
        'http://142.42.1.1:8080/\n' +
        'https://foo_bar.example.com에서 만나요. \n' +
        'http://foo.bar/?q=Test%20URL-encoded%20stuff \n' +
        'http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com ' +
        'Have <b>you</b> visited goasidaio.ac.kr?abd=5hell0?5...&kkk=5rk.,. ';
        
 var urls = PatternDreamer.TextArea.extractAllUrls(textStr),
 ```
 ##### console.log() ( To print them out, JSON.stringify(urls, null, 2) )
 ``` javascript
 [
 // `Not all listed`
  {
    "value": {
      "url": "http://[::1]:8000",
      "removedTailOnUrl": "",
      "protocol": "http",
      "onlyDomain": "[::1]",
      "onlyParams": null,
      "onlyUri": null,
      "onlyUriWithParams": null,
      "onlyParamsJsn": null,
      "type": "ip_v6",
      "port": "8000"
    },
    "area": "text",
    "index": {
      "start": 0,
      "end": 17
    }
  },
  {
    "value": {
      "url": "http://www.example.com/wpstyle/?p=364",
      "removedTailOnUrl": "\"",
      "protocol": "http",
      "onlyDomain": "www.example.com",
      "onlyParams": "?p=364\"",
      "onlyUri": "/wpstyle/",
      "onlyUriWithParams": "/wpstyle/?p=364\"",
      "onlyParamsJsn": {
        "p": "364\""
      },
      "type": "domain",
      "port": null
    },
    "area": "text",
    "index": {
      "start": 21,
      "end": 60
    }
  },
  {
    "value": {
      "url": "HTTP://foo.com/blah_blah_(wikipedia)",
      "removedTailOnUrl": "",
      "protocol": "HTTP",
      "onlyDomain": "foo.com",
      "onlyParams": null,
      "onlyUri": "/blah_blah_(wikipedia)",
      "onlyUriWithParams": "/blah_blah_(wikipedia)",
      "onlyParamsJsn": null,
      "type": "domain",
      "port": null
    },
    "area": "text",
    "index": {
      "start": 68,
      "end": 104
    }
  },
  {
    "value": {
      "url": "https://www.google.com/maps/place/USA/@36.2218457,...",
      "removedTailOnUrl": "",
      "protocol": "https",
      "onlyDomain": "www.google.com",
      "onlyParams": null,
      "onlyUri": "/maps/place/USA/@36.2218457,...",
      "onlyUriWithParams": "/maps/place/USA/@36.2218457,...",
      "onlyParamsJsn": null,
      "type": "domain",
      "port": null,
    },
    "area": "text",
    "index": {
      "start": 105,
      "end": 158
    }
  }
....
....
 ]
```
##### 5. XML (HTML)

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
   },
   {
     "value": {
       "url": "ssh://www.aaa가.com",
       "removedTailOnUrl": "",
       "protocol": "ssh",
       "onlyDomain": "www.aaa가.com",
       "onlyParams": null,
       "onlyUri": null,
       "onlyUriWithParams": null,
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "comment"
   },
   {
     "value": {
       "url": "www.naver.com",
       "removedTailOnUrl": "",
       "protocol": null,
       "onlyDomain": "www.naver.com",
       "onlyParams": null,
       "onlyUri": null,
       "onlyUriWithParams": null,
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "comment"
   },
   {
     "value": {
       "url": "http://www.aaa가가.com/image/showWorkOrderImg?fileName=12345.png",
       "removedTailOnUrl": "",
       "protocol": "http",
       "onlyDomain": "www.aaa가가.com",
       "onlyParams": "?fileName=12345.png",
       "onlyUri": "/image/showWorkOrderImg",
       "onlyUriWithParams": "/image/showWorkOrderImg?fileName=12345.png",
       "onlyParamsJsn": {
         "fileName": "12345.png"
       },
       "type": "domain",
       "port": null
     },
     "area": "element : img"
   },
   {
     "value": {
       "url": "https://www.aadc给s.cn",
       "removedTailOnUrl": "",
       "protocol": "https",
       "onlyDomain": "www.aadc给s.cn",
       "onlyParams": null,
       "onlyUri": null,
       "onlyUriWithParams": null,
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "element : p"
   },
   {
     "value": {
       "url": "en.wikipedia.org/wiki/Wikipedia:About",
       "removedTailOnUrl": "",
       "protocol": null,
       "onlyDomain": "en.wikipedia.org",
       "onlyParams": null,
       "onlyUri": "/wiki/Wikipedia:About",
       "onlyUriWithParams": "/wiki/Wikipedia:About",
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "text"
   }
    .....
 ]
```

#### Chapter 2. Parse emails in whatever situations !

##### 1. XML (HTML)
``` javascript
    /**
     * @brief
     * Distill all emails from normal text, tags, comments in html
     * @author Andrew Kang
     * @param xmlStr string required
     * @param prefixSanitizer boolean (default : true)
     * @return array
     */
   
     var emails = PatternDreamer.XmlArea.extractAllEmails(xmlStr, prefixSanitizer);    
   
```
###### console.log()
``` javascript
[
  {
    "value": "abc件给@navered.com",
    "area": "comment"
  },
  {
    "value": "aa件给@daum.net",
    "area": "comment"
  },
  {
    "value": "abc@daum.net",
    "area": "text"
  },
  {
    "value": "abcd@daum.co.kr",
    "area": "text"
  },
  {
    "value": "가나다@pacbook.net",
    "area": "text"
  }
] 
```

##### 2. Plain texts

``` javascript
var emails = PatternDreamer.TextArea.extractAllEmails(textStr),
 ```
 
 ###### console.log() 
 ``` javascript
[
  {
    "value": "가나다@pacbook.net",
    "area": "text"
  },
  {
    "value": "abc@daum.net",
    "area": "text"
  }
]
```

#### Chapter 3. Parse elements and comments from XML(HTML) !

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