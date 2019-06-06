import Jquery from 'jquery';
const fup = require("fast-url-parser");
fup.queryString = require("querystringparser");


import {ValidationError} from './error-handler';

import Util from './util';
import Rx from './rx';
import Service from './service';



/*
*     All Public
* */
const XmlArea = {


    /**
     *
     * @brief
     * Distill all opening tags with each 'elementName'.
     * @author Andrew Kang
     * @param xmlStr string required
     * @return array
     *
     */
    extractAllElements(xmlStr) {

        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new ValidationError('the variable xmlStr must be a string type and not be null.');
        }

        const cmt_matches = Service.Xml.extractAllPureComments(xmlStr);

        let matches = Service.Xml.extractAllPureElements(xmlStr);


        for (let a = 0; a < matches.length; a++) {
            for (let i = 0; i < cmt_matches.length; i++) {
                if (cmt_matches[i].startIndex < matches[a].startIndex && matches[a].lastIndex < cmt_matches[i].lastIndex) {

                    matches[a]['commentArea'] = true;
                    break;

                }
            }

            if (matches[a]['commentArea'] !== true) {
                matches[a]['commentArea'] = false;
            }

        }


        return matches;

    },

    /**
     * @brief
     * Distill all comments. Comments inside tags are ignored.
     * @author Andrew Kang
     * @param xmlStr string required
     * @return array
     */
    extractAllComments(xmlStr) {

        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new ValidationError('the variable xmlStr must be a string type and not be null.');
        }

        let el_matches = Service.Xml.extractAllPureElements(xmlStr);
        let matches = Service.Xml.extractAllPureComments(xmlStr);

        el_matches = el_matches.reverse();
        matches = matches.reverse();

        matches.forEach(function (val, idx) {

            for (let i = 0; i < el_matches.length; i++) {
                if (el_matches[i].startIndex < val.startIndex && val.lastIndex < el_matches[i].lastIndex) {

                    delete matches[idx];
                    break;

                }
            }
        });


        return matches;

    },

    /**
     * @brief
     * Distill all urls from normal text, tags, comments in html
     * @author Andrew Kang
     * @param xmlStr string required
     * @param skipXml boolean (default : false)
     * @return array
     */
    extractAllUrls(xmlStr, skipXml = false) {

        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new ValidationError('the variable xmlStr must be a string type and not be null.');
        }

        let obj = [];

        if (!skipXml) {

            let cmt_matches = XmlArea.extractAllComments(xmlStr);
            let el_matches = XmlArea.extractAllElements(xmlStr);

            /* 1. comment */
            for (let a = 0; a < cmt_matches.length; a++) {

                let rx = new RegExp(Rx.Children.url, 'gi');

                let matches = [];
                let match = {};

                while ((match = rx.exec(cmt_matches[a].value)) !== null) {

                    /* remove email patterns related to 'all_urls3_front' regex */
                    if (/^@/.test(match[0])) {
                        continue;
                    }

                    /* comment - regex conflict case handler */
                    let mod_val = match[0].replace(/-->$/, '');

                    mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
                    mod_val = mod_val.trim();

                    obj.push({
                        'value': UrlArea.assortUrl(mod_val),
                        'area': 'comment'
                    });

                }

            }

            /* 2. element */
            for (let a = 0; a < el_matches.length; a++) {

                let rx = new RegExp(Rx.Children.url, 'gi');

                let matches = [];
                let match = {};

                while ((match = rx.exec(el_matches[a].value)) !== null) {

                    /* remove email patterns related to 'all_urls3_front' regex */
                    if (/^@/.test(match[0])) {
                        continue;
                    }


                    /* attribute value - regex conflict case handler */
                    let mod_val = match[0].replace(new RegExp('[\\u0022\\u0027](?:[\\t\\s]+|[\\t\\s]*/[\\t\\s]*)(?:>|)', 'gi'), '');

                    mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
                    mod_val = mod_val.trim();

                    obj.push({
                        'value': UrlArea.assortUrl(mod_val),
                        'area': 'element : ' + el_matches[a].elementName
                    });

                }

            }

            /* 3. Remove all comments */
            xmlStr = xmlStr.replace(new RegExp(Rx.Descendants.xml_comment, 'gi'), '');

            /* 4. Remove all elements */
            xmlStr = xmlStr.replace(new RegExp(Rx.Descendants.xml_element, "g"), '');


        }


        /* check if all comments and elements have been removed properly */
        //console.log('xmlStr : ' + xmlStr);


        /* 5. normal text area */
        let rx = new RegExp(Rx.Children.url, 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(xmlStr)) !== null) {

            /* remove email patterns related to 'all_urls3_front' regex */
            if (/^@/.test(match[0])) {
                continue;
            }

            let mod_val = match[0];
            mod_val = mod_val.replace(/[\n\r\t\s]/g, '');

            obj.push({
                'value': UrlArea.assortUrl(mod_val),
                'area': 'text'
            });
        }


        return obj;

    },

    /**
     * @brief
     * Distill all emails from normal text, tags, comments in html
     * @author Andrew Kang
     * @param xmlStr string required
     * @param prefixSanitizer boolean (default : true)
     * @param skipXml boolean (default : false)
     * @return array
     */
    extractAllEmails(xmlStr, prefixSanitizer = true, skipXml = false) {

        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new ValidationError('the variable xmlStr must be a string type and not be null.');
        }

        let final_prefixSanitizer = null;
        if (prefixSanitizer) {
            final_prefixSanitizer = true;
        } else {
            if (prefixSanitizer === false) {
                final_prefixSanitizer = false;
            } else {
                final_prefixSanitizer = true;
            }
        }

        let obj = [];

        if (!skipXml) {

            let cmt_matches = XmlArea.extractAllComments(xmlStr);
            let el_matches = XmlArea.extractAllElements(xmlStr);

            /* 1. comment */
            for (let a = 0; a < cmt_matches.length; a++) {

                let rx = new RegExp(Rx.Descendants.all_emails, 'gi');

                let matches = [];
                let match = {};

                while ((match = rx.exec(cmt_matches[a].value)) !== null) {

                    /* comment - regex conflict case handler */
                    let mod_val = match[0].replace(/-->$/, '');

                    mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
                    mod_val = mod_val.trim();

                    let mod_val_front = mod_val.split(/@/)[0];

                    /* prefixSanitizer */
                    if (final_prefixSanitizer === true) {

                        mod_val = mod_val.replace(new RegExp('^[^0-9\\p{L}]+', 'u'), '');

                        let border = '';
                        let rx_border = new RegExp('^[^a-zA-Z0-9]+([a-zA-Z0-9])', 'gi');
                        let is_mod_val_front_only_foreign_lang = true;
                        while ((match = rx_border.exec(mod_val_front)) !== null) {

                            is_mod_val_front_only_foreign_lang = false;
                            border = match[1];

                        }

                        if (is_mod_val_front_only_foreign_lang === false) {

                            mod_val = mod_val.replace(rx_border, '');
                            mod_val = border + mod_val;
                        }

                    }

                    obj.push({
                        'value': mod_val,
                        'area': 'comment'
                    });

                }

            }

            /* 2. element */
            for (let a = 0; a < el_matches.length; a++) {

                let rx = new RegExp(Rx.Descendants.all_emails, 'gi');

                let matches = [];
                let match = {};

                while ((match = rx.exec(el_matches[a].value)) !== null) {

                    /* attribute value - regex conflict case handler */
                    let mod_val = match[0].replace(new RegExp('[\\u0022\\u0027](?:[\\t\\s]+|[\\t\\s]*/[\\t\\s]*)(?:>|)', 'gi'), '');

                    mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
                    mod_val = mod_val.trim();

                    let mod_val_front = mod_val.split(/@/)[0];

                    /* prefixSanitizer */
                    if (final_prefixSanitizer === true) {

                        mod_val = mod_val.replace(new RegExp('^[^0-9\\p{L}]+', 'u'), '');

                        let border = '';
                        let rx_border = new RegExp('^[^a-zA-Z0-9]+([a-zA-Z0-9])', 'gi');
                        let is_mod_val_front_only_foreign_lang = true;
                        while ((match = rx_border.exec(mod_val_front)) !== null) {

                            is_mod_val_front_only_foreign_lang = false;
                            border = match[1];

                        }

                        if (is_mod_val_front_only_foreign_lang === false) {
                            mod_val = mod_val.replace(rx_border, '');
                            mod_val = border + mod_val;
                        }

                    }


                    obj.push({
                        'value': mod_val,
                        'area': 'element : ' + el_matches[a].elementName
                    });

                }

            }

            /* 3. Remove all comments */
            xmlStr = xmlStr.replace(new RegExp(Rx.Descendants.xml_comment, 'gi'), '');

            /* 4. Remove all elements */
            const elementRegex = '(?:' + Rx.Ancestors.lang_char + '[^<>\\u0022\\u0027\\t\\s]*)';
            xmlStr = xmlStr.replace(new RegExp(Rx.Descendants.xml_element, "g"), '');

        }

        /* 5. normal text area */
        let rx = new RegExp(Rx.Descendants.all_emails, 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(xmlStr)) !== null) {

            let mod_val = match[0];

            mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
            mod_val = mod_val.trim();

            let mod_val_front = mod_val.split(/@/)[0];

            /* prefixSanitizer */
            if (final_prefixSanitizer === true) {

                mod_val = mod_val.replace(new RegExp('^[^0-9\\p{L}]+', 'u'), '');

                let border = '';
                let rx_border = new RegExp('^[^a-zA-Z0-9]+([a-zA-Z0-9])', 'gi');
                let is_mod_val_front_only_foreign_lang = true;
                while ((match = rx_border.exec(mod_val_front)) !== null) {

                    is_mod_val_front_only_foreign_lang = false;
                    border = match[1];

                }

                if (is_mod_val_front_only_foreign_lang === false) {
                    mod_val = mod_val.replace(rx_border, '');
                    mod_val = border + mod_val;
                }

            }

            obj.push({
                'value': mod_val,
                'area': 'text'
            });
        }

        return obj;

    }

};

const TextArea = {


    /**
     * @brief
     * Distill all urls from normal text, tags, comments in html
     * @author Andrew Kang
     * @param textStr string required
     * @return array
     */
    extractAllUrls(textStr) {

        if (!(textStr && typeof textStr === 'string')) {
            throw new ValidationError('the variable textStr must be a string type and not be null.');
        }


        let obj = [];

        /* normal text area */
        let rx = new RegExp(Rx.Children.url, 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(textStr)) !== null) {

            /* remove email patterns related to 'all_urls3_front' regex */
            if (/^@/.test(match[0])) {
                continue;
            }

            let mod_val = match[0];
            mod_val = mod_val.replace(/[\n\r\t\s]/g, '');

            obj.push({
                'value': UrlArea.assortUrl(mod_val),
                'area': 'text',
                'index': {
                    'start': match.index,
                    'end': match.index + match[0].length
                }
            });
        }


        return obj;

    },


    /**
     * @brief
     * Distill all emails from normal text, tags, comments in html
     * @author Andrew Kang
     * @param textStr string required
     * @param prefixSanitizer boolean (default : true)
     * @return array
     */
    extractAllEmails(textStr, prefixSanitizer) {

        return XmlArea.extractAllEmails(textStr, null, true);

    }


};

const TextEditorArea = {

    /**
     * @brief
     * Distill all urls from normal text, tags, comments in html
     * @author Andrew Kang
     * @param textStr string required
     * @param clsName string required
     * @param contentEditableMode boolean default false
     * @return string
     */
    addClassToAllUrls(textStr, clsName, contentEditableMode) {

        if (!(textStr && typeof textStr === 'string')) {
            throw new ValidationError('the variable textStr must be a string type and not be null.');
        }

        /* To apply the regex 'Rx.Children.url', make <div>,<br> a line return */
        if(contentEditableMode && contentEditableMode === true){
            //textStr = textStr.replace(/&nbsp;/gi, ' ');
            textStr = textStr.replace(/<div>/gi, '<br>').replace(/<\/div>/gi, '');
            textStr = textStr.replace(/<br>/gi, '\n');
        }


        /* This needs to be optimized for the future */
        let t = Jquery('<p>'+ textStr + '</p>');
        t.find('.' + clsName).contents().unwrap();


        t.each(function() {


            let txt = Jquery(this).html();

            //console.log(contentEditableMode + ' t1: ' + txt);

            let obj = [];

            /* normal text area */
            let rx = new RegExp(Rx.Children.url, 'gi');

            let matches = [];
            let match = {};

            while ((match = rx.exec(txt)) !== null) {

                /* remove email patterns related to 'all_urls3_front' regex */
                if (/^@/.test(match[0])) {
                    continue;
                }

                let mod_val = match[0];
                mod_val = mod_val.replace(/[\n\r\t\s]/g, '');

                let re = UrlArea.assortUrl(mod_val);
                let st_idx = match.index;
                let end_idx = match.index + match[0].length;


                /* this part doesn't need to be highlighted */
                if(re['removedTailOnUrl'] && re['removedTailOnUrl'].length > 0){
                    end_idx -= re['removedTailOnUrl'].length;
                }

                obj.push({
                    'value': re,
                    'area': 'text',
                    'index': {
                        'start': st_idx,
                        'end': end_idx
                    }
                });
            }

            //console.log('obj : ' + JSON.stringify(obj));


            /* Add the 'clsName' */
            obj.reverse().forEach(function (val, idx) {
                txt = Util.Text.replaceAt(txt, val['index']['end'], '</span>');
                txt = Util.Text.replaceAt(txt, val['index']['start'], '<span class="' + clsName + '">');

            });

            //console.log(contentEditableMode + ' t2 : ' + txt);

            Jquery(this).text(txt);
        });


        textStr = t.text();


        //console.log(contentEditableMode + ' t3 : ' + textStr);


        if(contentEditableMode && contentEditableMode === true){
            textStr = textStr.replace(/\n/gi, '<br>');
        }


        return textStr;

    }
}

const UrlArea = {

    /**
     * @brief
     * Assort an url into each type.
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    assortUrl(url) {

        let obj = {
            url: null,
            removedTailOnUrl: '',
            protocol: null,
            onlyDomain: null,
            onlyParams: null,
            onlyUri: null,
            onlyUriWithParams: null,
            onlyParamsJsn: null,
            type: null,
            port: null
        };

        try {

            url = Service.Valid.checkAndTrimStr(url);

            url = Util.Text.removeAllSpaces(url);


            Service.Valid.failIfNotUrlPtrn(url);


            // 1. full url
            obj['url'] = url;

            // 2. protocol
            let rx = new RegExp('^([a-zA-Z0-9]+):', 'gi');

            let match = {};
            let isMatched = false;
            while ((match = rx.exec(url)) !== null) {

                if (match[1]) {

                    isMatched = true;

                    // exception case for rx
                    if (match[1] === 'localhost') {
                        obj['protocol'] = null;
                        break;
                    }

                    let rx2 = new RegExp(Rx.Ancestors.all_protocols, 'gi');

                    let match2 = {};
                    let isMatched2 = false;
                    while ((match2 = rx2.exec(match[1]) !== null)) {
                        obj['protocol'] = match[1];
                        isMatched2 = true;
                    }

                    if (!isMatched2) {
                        obj['protocol'] = match[1] + ' (unknown protocol)';
                    }

                    break;
                }

            }

            if (!isMatched) {
                obj['protocol'] = null;
            }

            // 3. Separate a domain and the 'UriWithParams'
            url = url.replace(/^(?:[a-zA-Z0-9]+:\/\/)/g, '');

            // 4. Separate params
            let rx3 = new RegExp('\\?(?:.|[\\n\\r\\t\\s])*$', 'gi');
            let match3 = {};
            while ((match3 = rx3.exec(url)) !== null) {
                obj['onlyParams'] = match3[0];
            }
            url = url.replace(rx3, '');

            if (obj['onlyParams'] === "?") {
                obj['onlyParams'] = null;
            }

            // 5. Separate uri
            let rx2 = new RegExp('\\/(?:.|[\\n\\r\\t\\s])*$', 'gi');
            let match2 = {};
            while ((match2 = rx2.exec(url)) !== null) {
                obj['onlyUri'] = match2[0];
            }
            url = url.replace(rx2, '');

            // 6.
            let onlyUri = obj['onlyUri'];
            let onlyParams = obj['onlyParams'];
            if (!onlyUri) {
                onlyUri = '';
            }
            if (!onlyParams) {
                onlyParams = '';
            }

            obj['onlyUriWithParams'] = onlyUri + onlyParams;
            if (!obj['onlyUriWithParams']) {
                obj['onlyUriWithParams'] = null;
            }

            // 7. obj['onlyParams'] to JSON
            if (obj['onlyParams']) {

                try {
                    obj['onlyParamsJsn'] = fup.parse(obj['onlyParams'], true).query;
                } catch (e1) {
                    console.log(e1);
                }
                /*                let onlyParamsJsnTxt = obj['onlyParams'].replace(/^\?/, '');
                                obj['onlyParamsJsn'] = JSON.parse('{"' + decodeURI(onlyParamsJsnTxt.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');*/
            }

            // 8. port
            if (/:[0-9]+$/.test(url)) {
                obj['port'] = url.match(/[0-9]+$/)[0];
                url = url.replace(/:[0-9]+$/, '');
            }

            // 9.
            obj['onlyDomain'] = url;

            // 10. type : domain, ip, localhost
            if (/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(url)) {
                obj['type'] = 'ip';
            } else if (/^localhost/i.test(url)) {
                obj['type'] = 'localhost';
            } else {
                obj['type'] = 'domain';
            }


            // If no params, we remove suffix in case that it is a meta character.
            if (obj['onlyUri'] === null && obj['onlyParams'] === null) {

                // removedTailOnUrl
                let rm_part_matches = obj['url'].match(new RegExp(Rx.Ancestors.no_lang_char_num + '+$', 'gi'));
                if (rm_part_matches) {
                    obj['removedTailOnUrl'] = rm_part_matches[0];
                    obj['url'] = obj['url'].replace(new RegExp(Rx.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                }

            }


            // If no uri no params, we remove suffix in case that it is non-alphabets.
            if (obj['onlyUri'] === null && obj['onlyParams'] === null) {

                if (obj['port'] === null) {
                    // this is a domain with no uri no params
                    let onlyEnd = obj['url'].match(new RegExp('[^.]+$', 'gi'));
                    if (onlyEnd && onlyEnd.length > 0) {

                        // this is a root domain like com, ac
                        if (/[a-zA-Z]/.test(onlyEnd[0])) {
                            if (/[^a-zA-Z]+$/.test(obj['url'])) {

                                // remove non alphabets
                                obj['removedTailOnUrl'] = obj['url'].match(/[^a-zA-Z]+$/)[0] + obj['removedTailOnUrl'];
                                obj['url'] = obj['url'].replace(/[^a-zA-Z]+$/, '');
                            }
                        }

                    }
                } else {
                    // this is a domain with no uri no params
                    let onlyEnd = obj['url'].match(new RegExp('[^:]+$', 'gi'));
                    if (onlyEnd && onlyEnd.length > 0) {

                        // this is a port num like 8000
                        if (/[0-9]/.test(onlyEnd[0])) {
                            if (/[^0-9]+$/.test(obj['url'])) {

                                // remove non numbers
                                obj['removedTailOnUrl'] = obj['url'].match(/[^0-9]+$/)[0] + obj['removedTailOnUrl'];
                                obj['url'] = obj['url'].replace(/[^0-9]+$/, '');
                            }
                        }

                    }

                }

            }


        } catch (e) {

            console.log(e);

        } finally {

            return obj;

        }

    }


};


export default {

    XmlArea,
    TextArea,
    TextEditorArea,
    UrlArea

};