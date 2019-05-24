# Strict-parser

## Overview

**Strict-parser** is an open source JavaScript library in order to parse certain patterns such as
urls, emails or decimals on xml(or html) which is, as you are aware, divided into three areas - elements, 
comments and texts. You can obtain strings with certain patterns and where they are on them, and can also use this library on plain texts.

## More sophisticated parsing patterns

1. Url (From ver 0.0.3, more stronger than before)  
 
    A) The core regex is based on 'validator.js' 
    
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
              "onlyUriWithParams": "?japan=go",
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
   
    D) Detailed information about a parsed url on xmls or texts is provided. (strong point)
    
    e.g.,
    
    ```
    [...
        {
          "url": "xtp:// gooppalgo.com/park/tree?abc=1",
          "protocol": "xtp (unknown protocol)",
          "onlyUriWithParams": "/park/tree?abc=1",
          "onlyDomain": "gooppalgo.com",
          "type": "domain"
        }
    ]
    ```

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

## Syntax & Usage (ES6 uses 'let' instead of 'var')

### XmlArea

``` javascript

    /**
     * @variable xmlStr is only a html sample.
     */ 
    var xmlStr = '<body><p>packed1book.net</p>\n' +
        'fakeshouldnotbedetected.url?abc=fake s5houl７十七日dbedetected.jp?japan=go <img style=\' = > float : none ; height: 200px;max-width: 50%;margin-top : 3%\' alt="undefined" src="http://www.aaa가가.com/image/showWorkOrderImg?fileName=12345.png"/>\n' +
        '<!-- 请发邮件给我abc件给@navered.com ssh://www.aaa가.com" <p >--邮件给aa件给@daum.net</p> www.naver.com\n  <p style="width: 100%"></p>-->  "abc@daum.net"로 보내주세요. ' +
        '-gigi.dau.ac.kr?mac=10 -dau.ac.kr?mac=10 <p id="abc" class="def xxx gh" style="<>">abcd@daum.co.kr에서 가나다@pacbook.net<span style="color: rgb(127,127,127);">Please align the paper to the left.</span>&nbsp;</p>\n' +
        '<p> 구루.com <img style="float:none;height: 200px;margin-top : 3%" src="/image/showWorkOrderImg?fileName=123456.png" alt="undefined" abc/></p>\n' +
        'http: //ne1ver.com:8000?abc=1&dd=5 localhost:80 abcd.com<p class="https://www.aadc给s.cn"> www.aaa그给.com/abc/def	https://flaviocopes.com/how-to-inspect-javascript-object/ ※Please ask 203.35.33.555:8000 if you have any issues! ※&nbsp;&nbsp;&nbsp;&nbsp;</p></body>';   
```


#### 1. XmlArea.extractAllUrls
``` javascript
        /**
         * @brief
         * Distill all urls from normal text, tags, comments in html
         * @author Andrew Kang
         * @param xmlStr string required
         * @return array
         */
     var urls = StrictParser.XmlArea.extractAllUrls(xmlStr);    
   
```
##### console.log() ( To print them out, JSON.stringify(urls, null, 2) )
``` javascript
[
  {
    "value": {
      "url": "ssh://www.aaa가.com",
      "protocol": "ssh",
      "onlyDomain": "www.aaa가.com",
      "onlyUriWithParams": null,
      "type": "domain"
    },
    "area": "comment"
  },
  {
    "value": {
      "url": "www.naver.com",
      "protocol": null,
      "onlyDomain": "www.naver.com",
      "onlyUriWithParams": null,
      "type": "domain"
    },
    "area": "comment"
  },
  {
    "value": {
      "url": "http://www.aaa가가.com/image/showWorkOrderImg?fileName=12345.png",
      "protocol": "http",
      "onlyDomain": "www.aaa가가.com",
      "onlyUriWithParams": "/image/showWorkOrderImg?fileName=12345.png",
      "type": "domain"
    },
    "area": "element : img"
  },
  {
    "value": {
      "url": "https://www.aadc给s.cn",
      "protocol": "https",
      "onlyDomain": "www.aadc给s.cn",
      "onlyUriWithParams": null,
      "type": "domain"
    },
    "area": "element : p"
  },
  {
    "value": {
      "url": "packed1book.net",
      "protocol": null,
      "onlyDomain": "packed1book.net",
      "onlyUriWithParams": null,
      "type": "domain"
    },
    "area": "text"
  },
  {
    "value": {
      "url": "s5houl７十七日dbedetected.jp?japan=go",
      "protocol": null,
      "onlyDomain": "s5houl７十七日dbedetected.jp",
      "onlyUriWithParams": "?japan=go",
      "type": "domain"
    },
    "area": "text"
  },
  {
    "value": {
      "url": "gigi.dau.ac.kr?mac=10",
      "protocol": null,
      "onlyDomain": "gigi.dau.ac.kr",
      "onlyUriWithParams": "?mac=10",
      "type": "domain"
    },
    "area": "text"
  },
  {
    "value": {
      "url": "dau.ac.kr?mac=10",
      "protocol": null,
      "onlyDomain": "dau.ac.kr",
      "onlyUriWithParams": "?mac=10",
      "type": "domain"
    },
    "area": "text"
  },
  {
    "value": {
      "url": "구루.com",
      "protocol": null,
      "onlyDomain": "구루.com",
      "onlyUriWithParams": null,
      "type": "domain"
    },
    "area": "text"
  },
  {
    "value": {
      "url": "http://ne1ver.com:8000?abc=1&dd=5",
      "protocol": "http",
      "onlyDomain": "ne1ver.com:8000",
      "onlyUriWithParams": "?abc=1&dd=5",
      "type": "domain"
    },
    "area": "text"
  },
  {
    "value": {
      "url": "localhost:80",
      "protocol": null,
      "onlyDomain": "localhost:80",
      "onlyUriWithParams": null,
      "type": "localhost"
    },
    "area": "text"
  },
  {
    "value": {
      "url": "abcd.com",
      "protocol": null,
      "onlyDomain": "abcd.com",
      "onlyUriWithParams": null,
      "type": "domain"
    },
    "area": "text"
  },
  {
    "value": {
      "url": "www.aaa그给.com/abc/def",
      "protocol": null,
      "onlyDomain": "www.aaa그给.com",
      "onlyUriWithParams": "/abc/def",
      "type": "domain"
    },
    "area": "text"
  },
  {
    "value": {
      "url": "https://flaviocopes.com/how-to-inspect-javascript-object/",
      "protocol": "https",
      "onlyDomain": "flaviocopes.com",
      "onlyUriWithParams": "/how-to-inspect-javascript-object/",
      "type": "domain"
    },
    "area": "text"
  },
  {
    "value": {
      "url": "203.35.33.555:8000",
      "protocol": null,
      "onlyDomain": "203.35.33.555:8000",
      "onlyUriWithParams": null,
      "type": "ip"
    },
    "area": "text"
  }
]
```


#### 2. XmlArea.extractAllEmails
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
##### console.log()
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


#### 3. XmlArea.extractAllElements
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
##### console.log() 
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
 
 
#### 4. XmlArea.extractAllComments
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
##### console.log() 
``` javascript
[
  {
    "value": "<!-- 请发邮件给我abc件给@navered.com http://www.aaa가.com\" <p >--邮件给aa件给@daum.net</p> www.naver.com\n  -->",
    "startIndex": 179,
    "lastIndex": 274
  }
]
```
 
 
### TextArea

#### TextArea.assortUrl
``` javascript
 var url = StrictParser.TextArea.assortUrl("http://www.goopplgo.com/?abc=1")
 ```
 ##### console.log() 
 ``` javascript
{
  "url": "http://www.goopplgo.com/?abc=1",
  "protocol": "http",
  "onlyDomain": "www.goopplgo.com",
  "onlyUriWithParams": "/?abc=1",
  "type": "domain"
}
 ```