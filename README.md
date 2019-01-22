# Strict-parser

## Overview

**Strict-parser** is an open source JavaScript library in order to parse certain patterns such as
urls, emails or decimals on xml(or html) which is, as you are aware, divided into three areas - elements, 
comments and text. You can obtain strings with certain patterns and where they are on html.

## More sophisticated parsing patterns

1. Url  
 
    A) referred to validator.js and added no-protocol cases such as www.google.com 
    or ip numbers like 192.168.0.5:8000/abc.  

2. Email  

    A) separated only emails from post-connected characters.  
        [ex.] abc@naver.comCOCO, cde@adela.co.kr에서, fgh@adela.co.kr(next)   
              -> abc@naver.com, cde@adela.co.kr, fgh@adela.co.kr  
                          
    B) separated only emails from pre-connected characters.      
        [ex.] 请发邮件给我abc@naver.com, ---과자@daum.net, "all_day@bbqg.com" 
              -> abc@naver.com, 과자@daum.net, all_day@bbqg.com
          
3. Element
   
    A) a well-known regex indicating tags is not simply '<[^>]+>'.
    This regex fails to parse some cases such as '`````<p class="here>to" style="width:100%">`````' where '>' is inserted in the 
    class attribute.

4. Zero-dependency except for regular expressions for parsing - any xml type is available.  

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

## Syntax & Usage (ES6 : var->let)

### Sample (XmlArea)

``` javascript

    /**
     * @variable xmlStr is only a html sample.
     */ 
    var htmlStr = '<body><p></p>\n' +
        '<img style=\' = > float : none ; height: 200px;max-width: 50%;margin-top : 3%\' alt="undefined" src="http://www.aaa가가.com/image/showWorkOrderImg?fileName=12345.png"/>\n' +
        '<!-- 请发邮件给我abc件给@navered.com http://www.aaa가.com" <p >--邮件给aa件给@daum.net</p> www.naver.com\n  -->  "abc@daum.net"로 보내주세요. ' +
        '<p id="abc" class="def xxx gh" style="<>">abcd@daum.co.kr에서 가나다@pacbook.net<span style="color: rgb(127,127,127);">Please align the paper to the left.</span>&nbsp;</p>\n' +
        '<p><img style="float:none;height: 200px;margin-top : 3%" src="/image/showWorkOrderImg?fileName=123456.png" alt="undefined" abc/></p>\n' +
        'http: //localhost:8000 localhost:80<p class="https://www.aadc给s.cn"> www.aaa가가.com/abc/def	https://flaviocopes.com/how-to-inspect-javascript-object/ ※Please ask 203.35.33.555:8000 if you have any issues! ※&nbsp;&nbsp;&nbsp;&nbsp;</p></body>';   
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
##### console.log(urls) ( To print them out, JSON.stringify(urls, null, 2) )
``` javascript
[
  {
    "value": {
      "protocol": "http",
      "onlyDomain": "www.aaa가.com",
      "type": "domain",
      "url": "http://www.aaa가.com"
    },
    "area": "comment"
  },
  {
    "value": {
      "protocol": "",
      "onlyDomain": "www.naver.com",
      "type": "domain",
      "url": "www.naver.com"
    },
    "area": "comment"
  },
  {
    "value": {
      "protocol": "http",
      "onlyDomain": "www.aaa가가.com",
      "type": "domain",
      "url": "http://www.aaa가가.com/image/showWorkOrderImg?fileName=12345.png"
    },
    "area": "element : img"
  },
  {
    "value": {
      "protocol": "https",
      "onlyDomain": "www.aadc给s.cn",
      "type": "domain",
      "url": "https://www.aadc给s.cn"
    },
    "area": "element : p"
  },
  {
    "value": {
      "protocol": "http",
      "onlyDomain": "localhost:8000",
      "type": "localhost",
      "url": "http://localhost:8000"
    },
    "area": "text"
  },
  {
    "value": {
      "protocol": "",
      "onlyDomain": "localhost:80",
      "type": "localhost",
      "url": "localhost:80"
    },
    "area": "text"
  },
  {
    "value": {
      "protocol": "",
      "onlyDomain": "www.aaa가가.com",
      "type": "domain",
      "url": "www.aaa가가.com/abc/def"
    },
    "area": "text"
  },
  {
    "value": {
      "protocol": "https",
      "onlyDomain": "flaviocopes.com",
      "type": "domain",
      "url": "https://flaviocopes.com/how-to-inspect-javascript-object/"
    },
    "area": "text"
  },
  {
    "value": {
      "protocol": "",
      "onlyDomain": "203.35.33.555:8000",
      "type": "ip",
      "url": "203.35.33.555:8000"
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
   
     var urls = StrictParser.XmlArea.extractAllEmails(xmlStr, prefixSanitizer);    
   
```
##### console.log(urls)
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
##### console.log(urls) 
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
##### console.log(urls) 
``` javascript
[
  {
    "value": "<!-- 请发邮件给我abc件给@navered.com http://www.aaa가.com\" <p >--邮件给aa件给@daum.net</p> www.naver.com\n  -->",
    "startIndex": 179,
    "lastIndex": 274
  }
]
```
 
 
### Sample (TextArea)

#### 1. TextArea.assortUrl
``` javascript
 var result = StrictParser.TextArea.assortUrl("http://www.goopplgo.com")
 ```
 ##### console.log(url) 
 ``` javascript
{
  "protocol": "http",
  "onlyDomain": "www.goopplgo.com",
  "type": "domain",
  "url": "http://www.goopplgo.com"
}
 ```