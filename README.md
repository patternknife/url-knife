# Strict-parser

## Overview

'Javascript URL(domain, uri, parameters, etc.), email parser using a powerful combination of regular expressions on XML, HTML or plain text'

## Installation

For ES5 users,

``` html
<html>
       <body>
       	<p id="content"></p>
       	<script src="../dist/strict-parser.bundle.js"></script>
       	<script type="text/javascript">
       
      
       	</script>
       </body>
</html>
```

For ES6 npm users, do 'npm install --save strict-parser' on console.

``` html
import StrictParser from 'strict-parser';
```

## Syntax & Usage

``` javascript

    /* All Samples */

    // A sample of 'Text editor(TextArea) & Plain texts'
    var textStr = 'https://www.google.com/maps/place/USA/@36.2218457,... tnae1ver.com:8000on the internet  Asterisk\n ' +
        'Have you visited http://goasidaio.ac.kr?abd=5안녕하세요?5...,.&kkk=5rk.,, ' +
        'Have <b>you</b> visited goasidaio.ac.kr?abd=5hell0?5...&kkk=5rk.,. ' +
        'the packed1book.net. fakeshouldnotbedetected.url?abc=fake s5houl７十七日dbedetected.jp?japan=go&html=<span>가나다@pacbook.net</span>; abc.com/ad/fg/?kk=5 abc@daum.net';

    // A sample of 'Text editor(ContentEditable)' 
    var textStr2 = 'https://www.google.com/maps/place/USA/@36.2218457,... tnae1ver.com:8000on the internet  Asterisk\n ' +
        'Have you visited http://goasidaio.ac.kr?abd=5안녕하세요?5...,.&kkk=5rk.,, ' +
        'Have <b>you</b> visited goasidaio.ac.kr?abd=5hell0?5...&kkk=5rk.,. ' +
        'the packed1book.net. fakeshouldnotbedetected.url?abc=fake s5houl７十七日dbedetected.jp?japan=go&html=&lt;span&gt;가나다@pacbook.net&lt;/span&gt; abc.com/ad/fg/?kk=5 abc@daum.net';

    // A sample of 'XML (HTML)'
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
        
```

#### Chapter 1. Parse urls in whatever situations !

##### 1. Text editor
  
``` javascript

    /**
     * @brief
     * Distill all urls from normal text, tags, comments in html
     * @author Andrew Kang
     * @param textStr string required
     * @param clsName string required
     * @param contentEditableMode boolean default false
     * @return string
     */
 var textStr_new = StrictParser.TextEditorArea.addClassToAllUrls(textStr, 'highlighted1');
 ```
You can check how url patterns are highlighted by running the sample source below.

https://github.com/Andrew-Kang-G/strict-parser/blob/master/public/index.html

or 
<a href="https://jsfiddle.net/AndrewKang/xtfjn8g3/17/" target="_blank">LIVE DEMO</a>

 

 
##### 2. One url
  
``` javascript
 var url = StrictParser.UrlArea.assortUrl("http://www.goopplgo.com/?abc=1")
 ```
 ###### console.log() 
 ``` javascript
{
  "url": "ssh://www.goopplgo.com/?abc=1",
  "removedTailOnUrl": "",
  "protocol": "ssh",
  "onlyDomain": "www.goopplgo.com",
  "onlyParams": "?abc=1",
  "onlyUri": "/",
  "onlyUriWithParams": "/?abc=1",
  "onlyParamsJsn": {
    "abc": "1"
  },
  "type": "domain",
  "port": null
}
 ```


##### 3. Plain texts

``` javascript
 var urls = StrictParser.TextArea.extractAllUrls(textStr),
 ```
 ##### console.log() ( To print them out, JSON.stringify(urls, null, 2) )
 ``` javascript
 [
  {
    "value": {
      "url": "https://www.google.com/maps/place/USA/@36.2218457",
      "removedTailOnUrl": ",...",
      "protocol": "https",
      "onlyDomain": "www.google.com",
      "onlyParams": null,
      "onlyUri": "/maps/place/USA/@36.2218457,...",
      "onlyUriWithParams": "/maps/place/USA/@36.2218457,...",
      "onlyParamsJsn": null,
      "type": "domain",
      "port": null
    },
    "area": "text",
    "index": {
      "start": 0,
      "end": 53
    }
  },
  {
    "value": {
      "url": "tnae1ver.com:8000",
      "removedTailOnUrl": "",
      "protocol": null,
      "onlyDomain": "tnae1ver.com",
      "onlyParams": null,
      "onlyUri": null,
      "onlyUriWithParams": null,
      "onlyParamsJsn": null,
      "type": "domain",
      "port": "8000"
    },
    "area": "text",
    "index": {
      "start": 54,
      "end": 71
    }
  },
  {
    "value": {
      "url": "http://goasidaio.ac.kr?abd=5안녕하세요?5...,.&kkk=5rk.,,",
      "removedTailOnUrl": "",
      "protocol": "http",
      "onlyDomain": "goasidaio.ac.kr",
      "onlyParams": "?abd=5안녕하세요?5...,.&kkk=5rk.,,",
      "onlyUri": null,
      "onlyUriWithParams": "?abd=5안녕하세요?5...,.&kkk=5rk.,,",
      "onlyParamsJsn": {
        "abd": "5안녕하세요?5...,.",
        "kkk": "5rk.,,"
      },
      "type": "domain",
      "port": null
    },
    "area": "text",
    "index": {
      "start": 115,
      "end": 166
    }
  },
  {
    "value": {
      "url": "goasidaio.ac.kr?abd=5hell0?5...&kkk=5rk.,.",
      "removedTailOnUrl": "",
      "protocol": null,
      "onlyDomain": "goasidaio.ac.kr",
      "onlyParams": "?abd=5hell0?5...&kkk=5rk.,.",
      "onlyUri": null,
      "onlyUriWithParams": "?abd=5hell0?5...&kkk=5rk.,.",
      "onlyParamsJsn": {
        "abd": "5hell0?5...",
        "kkk": "5rk.,."
      },
      "type": "domain",
      "port": null
    },
    "area": "text",
    "index": {
      "start": 191,
      "end": 233
    }
  },
  {
    "value": {
      "url": "packed1book.net",
      "removedTailOnUrl": "",
      "protocol": null,
      "onlyDomain": "packed1book.net",
      "onlyParams": null,
      "onlyUri": null,
      "onlyUriWithParams": null,
      "onlyParamsJsn": null,
      "type": "domain",
      "port": null
    },
    "area": "text",
    "index": {
      "start": 234,
      "end": 249
    }
  },
  {
    "value": {
      "url": "s5houl７十七日dbedetected.jp?japan=go&html=<span>가나다@pacbook.net</span>",
      "removedTailOnUrl": "",
      "protocol": null,
      "onlyDomain": "s5houl７十七日dbedetected.jp",
      "onlyParams": "?japan=go&html=<span>가나다@pacbook.net</span>",
      "onlyUri": null,
      "onlyUriWithParams": "?japan=go&html=<span>가나다@pacbook.net</span>",
      "onlyParamsJsn": {
        "japan": "go",
        "html": "<span>가나다@pacbook.net</span>"
      },
      "type": "domain",
      "port": null
    },
    "area": "text",
    "index": {
      "start": 287,
      "end": 354
    }
  },
  {
    "value": {
      "url": "abc.com/ad/fg/?kk=5",
      "removedTailOnUrl": "",
      "protocol": null,
      "onlyDomain": "abc.com",
      "onlyParams": "?kk=5",
      "onlyUri": "/ad/fg/",
      "onlyUriWithParams": "/ad/fg/?kk=5",
      "onlyParamsJsn": {
        "kk": "5"
      },
      "type": "domain",
      "port": null
    },
    "area": "text",
    "index": {
      "start": 355,
      "end": 374
    }
  }
]
```
##### 4. XML (HTML)

``` javascript
 var urls = StrictParser.XmlArea.extractAllUrls(xmlStr);    
```
###### console.log()
``` javascript
 [
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
   },
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
       "url": "s5houl７十七日dbedetected.jp?japan=go-",
       "removedTailOnUrl": "",
       "protocol": null,
       "onlyDomain": "s5houl７十七日dbedetected.jp",
       "onlyParams": "?japan=go-",
       "onlyUri": null,
       "onlyUriWithParams": "?japan=go-",
       "onlyParamsJsn": {
         "japan": "go-"
       },
       "type": "domain",
       "port": null
     },
     "area": "text"
   },
   {
     "value": {
       "url": "plus.google.co.kr",
       "removedTailOnUrl": "0에서..,",
       "protocol": null,
       "onlyDomain": "plus.google.co.kr0에서..,",
       "onlyParams": null,
       "onlyUri": null,
       "onlyUriWithParams": null,
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "text"
   },
   {
     "value": {
       "url": "https://plus.google.com/+google",
       "removedTailOnUrl": "",
       "protocol": "https",
       "onlyDomain": "plus.google.com",
       "onlyParams": null,
       "onlyUri": "/+google",
       "onlyUriWithParams": "/+google",
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "text"
   },
   {
     "value": {
       "url": "https://www.google.com/maps/place/USA/@36.2218457",
       "removedTailOnUrl": ",...",
       "protocol": "https",
       "onlyDomain": "www.google.com",
       "onlyParams": null,
       "onlyUri": "/maps/place/USA/@36.2218457,...",
       "onlyUriWithParams": "/maps/place/USA/@36.2218457,...",
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "text"
   },
   {
     "value": {
       "url": "gigi.dau.ac.kr?mac=10",
       "removedTailOnUrl": "",
       "protocol": null,
       "onlyDomain": "gigi.dau.ac.kr",
       "onlyParams": "?mac=10",
       "onlyUri": null,
       "onlyUriWithParams": "?mac=10",
       "onlyParamsJsn": {
         "mac": "10"
       },
       "type": "domain",
       "port": null
     },
     "area": "text"
   },
   {
     "value": {
       "url": "dau.ac.kr?mac=10",
       "removedTailOnUrl": "",
       "protocol": null,
       "onlyDomain": "dau.ac.kr",
       "onlyParams": "?mac=10",
       "onlyUri": null,
       "onlyUriWithParams": "?mac=10",
       "onlyParamsJsn": {
         "mac": "10"
       },
       "type": "domain",
       "port": null
     },
     "area": "text"
   },
   {
     "value": {
       "url": "구루.com",
       "removedTailOnUrl": "",
       "protocol": null,
       "onlyDomain": "구루.com",
       "onlyParams": null,
       "onlyUri": null,
       "onlyUriWithParams": null,
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "text"
   },
   {
     "value": {
       "url": "http://ne1ver.com:8000?abc=1&dd=5",
       "removedTailOnUrl": "",
       "protocol": "http",
       "onlyDomain": "ne1ver.com",
       "onlyParams": "?abc=1&dd=5",
       "onlyUri": null,
       "onlyUriWithParams": "?abc=1&dd=5",
       "onlyParamsJsn": {
         "abc": "1",
         "dd": "5"
       },
       "type": "domain",
       "port": "8000"
     },
     "area": "text"
   },
   {
     "value": {
       "url": "localhost:80",
       "removedTailOnUrl": "",
       "protocol": null,
       "onlyDomain": "localhost",
       "onlyParams": null,
       "onlyUri": null,
       "onlyUriWithParams": null,
       "onlyParamsJsn": null,
       "type": "localhost",
       "port": "80"
     },
     "area": "text"
   },
   {
     "value": {
       "url": "estonia.ee",
       "removedTailOnUrl": "/",
       "protocol": null,
       "onlyDomain": "estonia.ee",
       "onlyParams": null,
       "onlyUri": "/",
       "onlyUriWithParams": "/",
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "text"
   },
   {
     "value": {
       "url": "estonia.ee",
       "removedTailOnUrl": "?",
       "protocol": null,
       "onlyDomain": "estonia.ee",
       "onlyParams": null,
       "onlyUri": null,
       "onlyUriWithParams": null,
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "text"
   },
   {
     "value": {
       "url": "https://flaviocopes.com/how-to-inspect-javascript-object",
       "removedTailOnUrl": "/",
       "protocol": "https",
       "onlyDomain": "flaviocopes.com",
       "onlyParams": null,
       "onlyUri": "/how-to-inspect-javascript-object/",
       "onlyUriWithParams": "/how-to-inspect-javascript-object/",
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "text"
   },
   {
     "value": {
       "url": "203.35.33.555:8000",
       "removedTailOnUrl": "",
       "protocol": null,
       "onlyDomain": "203.35.33.555",
       "onlyParams": null,
       "onlyUri": null,
       "onlyUriWithParams": null,
       "onlyParamsJsn": null,
       "type": "ip",
       "port": "8000"
     },
     "area": "text"
   },
   {
     "value": {
       "url": "goasidaioaaa.ac.kr",
       "removedTailOnUrl": "",
       "protocol": null,
       "onlyDomain": "goasidaioaaa.ac.kr",
       "onlyParams": null,
       "onlyUri": null,
       "onlyUriWithParams": null,
       "onlyParamsJsn": null,
       "type": "domain",
       "port": null
     },
     "area": "text"
   }
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
   
     var emails = StrictParser.XmlArea.extractAllEmails(xmlStr, prefixSanitizer);    
   
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
var emails = StrictParser.TextArea.extractAllEmails(textStr),
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
        /**
         *
         * @brief
         * Distill all opening tags with each 'elementName'.
         * @author Andrew Kang
         * @param xmlStr string required
         * @return array
         *
         */
    var elements = StrictParser.XmlArea.extractAllElements(xmlStr);   
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
    /**
     * @brief
     * Distill all comments.
     * @author Andrew Kang
     * @param xmlStr string required
     * @return array
     */     
    var comments = StrictParser.XmlArea.extractAllComments(xmlStr); 
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
