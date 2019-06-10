import Rx from './rx';
import ValidationError from './error-handler';
import Valid from './valid';
import Util from './util';

const fup = require("fast-url-parser");
fup.queryString = require("querystringparser");

/*
*     Private : Processing
* */
const Xml = {

    extractAllPureElements(xmlStr) {

        const rx = new RegExp(Rx.Descendants.xml_element, "g");


        let matches = [];
        let match = {};
        while ((match = rx.exec(xmlStr)) !== null) {

            //console.log(match[0].split(/[\t\s]+|>/)[0]);
            matches.push({
                'value': match[0],
                'elementName': match[0].split(/[\t\s]+|>/)[0].replace(/^</, ''),
                'startIndex': match.index,
                'lastIndex': match.index + match[0].length - 1
            })

        }

        return matches;

    },

    extractAllPureComments(xmlStr) {

        const rx = new RegExp(Rx.Descendants.xml_comment, 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(xmlStr)) !== null) {

            matches.push({
                'value': match[0],
                'startIndex': match.index,
                'lastIndex': match.index + match[0].length - 1
            })

        }

        return matches;

    },

};

const Text = {

    extractAllPureUrls(textStr) {

        if (!(textStr && typeof textStr === 'string')) {
            throw new ValidationError('the variable textStr must be a string type and not be null.');
        }

        let obj = [];

        let rx = new RegExp(Rx.Children.url, 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(textStr)) !== null) {

            /* skip email patterns related to 'all_urls3_front' regex */
            if (/^@/.test(match[0])) {
                continue;
            }

            let mod_val = match[0];

            obj.push({
                'value': Url.assortUrl(mod_val),
                'area': 'text',
                'index': {
                    'start': match.index,
                    'end': match.index + match[0].length
                }
            });
        }

        return obj;

    },

    extractCertainPureUris(textStr, uris) {

        let uri_ptrn = Util.Text.urisToOne(uris);

        // console.log('uri_ptrn : ' + uri_ptrn);

        if (!uri_ptrn) {
            throw new ValidationError('the variable uris are not available');
        }

        uri_ptrn = '(?:\\/[^\\n\\r\\t\\s]*\\/|'+
            '(?:[0-9]|' + Rx.Ancestors.two_bytes_num + '|' + Rx.Ancestors.lang_char + ')'
            +'[^/\\n\\r\\t\\s]*(?:[0-9]|' + Rx.Ancestors.two_bytes_num + '|' + Rx.Ancestors.lang_char + ')'
            + '\\/|\\/|\\b)' +
            '(?:' + uri_ptrn + ')' + Rx.Ancestors.url_params_or_not;


        // console.log('escaped_uri_ptrn : ' + uri_ptrn);

        let obj = [];

        /* normal text area */
        let rx = new RegExp(uri_ptrn, 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(textStr)) !== null) {

            /* remove email patterns related to 'all_urls3_front' regex */
            if (/^@/.test(match[0])) {
                continue;
            }

            let mod_val = match[0];

            obj.push({
                'value': Url.assortUrl(mod_val),
                'area': 'text',
                'index': {
                    'start': match.index,
                    'end': match.index + match[0].length
                }
            });
        }


        return obj;

    }
};

const Url = {

    /**
     * @brief
     * Assort an url or an uri into each type.
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

            url = Valid.checkAndTrimStr(url);

            url = Util.Text.removeAllSpaces(url);


            if(!Valid.isUrlPattern(url) && !Valid.isUriPattern(url)){
                throw new ValidationError('This is neither an url nor an uri.');
            }


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

           if (obj['onlyUri'] === "/") {
                obj['onlyUri'] = null;
            }

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
            if (new RegExp('^' + Rx.Ancestors.ip_v4, 'i').test(url)) {
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

            }else if(obj['onlyUri'] !== null && obj['onlyParams'] === null){

                let rm_part_matches = new RegExp('\\/([^/\\n\\r\\t\\s]+?)(' + Rx.Ancestors.no_lang_char_num + '+)$', 'gi').exec(obj['url']);

                //console.log(obj['url'] + ' : ' + rm_part_matches[1]);

                if (rm_part_matches) {
                    if(rm_part_matches[1]){
                        if(!new RegExp(Rx.Ancestors.no_lang_char_num, 'gi').test(rm_part_matches[1])){
                            if(rm_part_matches[2]) {
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['url'] = obj['url'].replace(new RegExp(Rx.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                            }
                        }
                    }

                }

            }else if(obj['onlyParams'] !== null){

                let rm_part_matches = new RegExp('\\=([^=\\n\\r\\t\\s]+?)(' + Rx.Ancestors.no_lang_char_num + '+)$', 'gi').exec(obj['url']);

  /*              console.log(obj['url'] + '1 : ' + rm_part_matches[1]);
                console.log(obj['url'] + '2 : ' + rm_part_matches[2]);*/

                if (rm_part_matches) {
                    if(rm_part_matches[1]){
                        if(!new RegExp(Rx.Ancestors.no_lang_char_num, 'gi').test(rm_part_matches[1])){
                            if(rm_part_matches[2]) {
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['url'] = obj['url'].replace(new RegExp(Rx.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                            }
                        }
                    }

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

            // 12. uri like 'abc/def'
            //if(!new RegExp('^' + Rx.Ancestors.all_protocols + '|\\.' + Rx.Ancestors.all_root_domains + '\\/|\\?','gi').test(obj['onlyDomain'])){

            if (!new RegExp(Rx.Children.url, 'gi').test(obj['url'])) {

                obj['onlyDomain'] = null;
                obj['type'] = 'uri';

                if (!/^[/]/.test(obj['url'])) {

                    obj['onlyUriWithParams'] = obj['url'];
                    obj['onlyUri'] = obj['url'].replace(/\?[^/]*$/gi, '');
                }
            }



            //}

        } catch (e) {

            console.log(e);

        } finally {

            return obj;

        }

    }


};


export default {

    Xml, Text, Url
}