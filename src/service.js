import Pattern from './pattern';
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

        const rx = new RegExp(Pattern.Descendants.xml_element, "g");


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

        const rx = new RegExp(Pattern.Descendants.xml_comment, 'gi');

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

    extractAllFuzzyUrls(textStr) {

        if (!(textStr && typeof textStr === 'string')) {
            throw new ValidationError('the variable textStr must be a string type and not be null.');
        }

        // To increase the accuracy of applying regexes...
        textStr = textStr.replace(/[\n\r\t\s]{2,}/, ' ');

        let obj = [];

        let rx = new RegExp(Pattern.Children.fuzzy_url(), 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(textStr)) !== null) {

            /* SKIP DEPENDENCY */
 /*           if (/^@/.test(match[0])) {
                continue;
            }*/

            /* this can affect indexes so commented */
            //mod_val = mod_val.replace(/[\n\r\t\s]/g, '');

            let st_idx = match.index;
            let end_idx = match.index + match[0].length;

            let mod_val = match[0];
            let re = Url.normalizeUrl(mod_val);

            /* SKIP DEPENDENCY */

            // Decimals
            if (new RegExp('^(?:\\.|[0-9]|' + Pattern.Ancestors.two_bytes_num + '|[\\n\\r\\t\\s])+$', 'i').test(re['url'])) {
                // ip_v4 is OK
                if (!new RegExp('^' + Pattern.Ancestors.ip_v4 + '$', 'i').test(re['onlyDomain'])) {
                    continue;
                }
            }


            /* this part doesn't need to be included */
   /*         if (re['removedTailOnUrl'] && re['removedTailOnUrl'].length > 0) {
                end_idx -= re['removedTailOnUrl'].length;
            }*/

            obj.push({
                'value': re,
                'area': 'text'
          /*      'index': {
                    'start': st_idx,
                    'end': end_idx
                }*/
            });
        }

        return obj;

    },

    extractAllPureUrls(textStr) {

        //console.log('a : ' + Pattern.Children.url);

        if (!(textStr && typeof textStr === 'string')) {
            throw new ValidationError('the variable textStr must be a string type and not be null.');
        }

        let obj = [];

        let rx = new RegExp(Pattern.Children.url, 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(textStr)) !== null) {

            /* SKIP DEPENDENCY */
            if (/^@/.test(match[0])) {
                continue;
            }

            /* this can affect indexes so commented */
            //mod_val = mod_val.replace(/[\n\r\t\s]/g, '');

            let st_idx = match.index;
            let end_idx = match.index + match[0].length;

            let mod_val = match[0];
            let re = Url.assortUrl(mod_val);

            /* SKIP DEPENDENCY */
            if (new RegExp('^(?:\\.|[0-9]|' + Pattern.Ancestors.two_bytes_num + ')+$', 'i').test(re['onlyDomain'])) {
                // ip_v4 is OK
                if (!new RegExp('^' + Pattern.Ancestors.ip_v4 + '$', 'i').test(re['onlyDomain'])) {
                    continue;
                }
            }


            /* this part doesn't need to be included */
            if (re['removedTailOnUrl'] && re['removedTailOnUrl'].length > 0) {
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

        return obj;

    },

    extractCertainPureUris(textStr, uris, endBoundary) {

        let uri_ptrn = Util.Text.urisToOne(uris);

         //console.log('uri_ptrn : ' + uri_ptrn);

        if (!uri_ptrn) {
            throw new ValidationError('the variable uris are not available');
        }

        if(endBoundary){


            uri_ptrn = '(?:\\/[^\\n\\r\\t\\s]*\\/|' +
                '(?:[0-9]|' + Pattern.Ancestors.two_bytes_num + '|' + Pattern.Ancestors.lang_char + ')'
                + '[^/\\n\\r\\t\\s]*(?:[0-9]|' + Pattern.Ancestors.two_bytes_num + '|' + Pattern.Ancestors.lang_char + ')'
                + '\\/|\\/|\\b)' +
                '(?:' + uri_ptrn + ')' +

                '(?:' + Pattern.Ancestors.url_params_must + '|[\\n\\r\\t\\s]|$)'

            ;

        }else{

            uri_ptrn = '(?:\\/[^\\n\\r\\t\\s]*\\/|' +
                '(?:[0-9]|' + Pattern.Ancestors.two_bytes_num + '|' + Pattern.Ancestors.lang_char + ')'
                + '[^/\\n\\r\\t\\s]*(?:[0-9]|' + Pattern.Ancestors.two_bytes_num + '|' + Pattern.Ancestors.lang_char + ')'
                + '\\/|\\/|\\b)' +
                '(?:' + uri_ptrn + ')' + Pattern.Ancestors.url_params_recommended;
        }

        //console.log('escaped_uri_ptrn : ' + uri_ptrn);

        let obj = [];

        /* normal text area */
        let rx = new RegExp(uri_ptrn, 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(textStr)) !== null) {

            /* remove email patterns related to 'all_urls3_front' regex */
        /*    if (/^@/.test(match[0])) {
                continue;
            }*/

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

    extractAllPureStrBfAfColon(textStr, delimiter) {

        if (!(textStr && typeof textStr === 'string')) {
            throw new ValidationError('the variable textStr must be a string type and not be null.');
        }
        let isDelimiter = false;
        if (delimiter && typeof delimiter === 'string') {
            isDelimiter = true;
        }


        let obj = [];

        let rx = new RegExp(Pattern.Children.strBfAfColon, 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(textStr)) !== null) {


            let st_idx = match.index;
            let end_idx = match.index + match[0].length;

            let mod_val = match[0];


            if (new RegExp('^([^:]+):([^:]+)$', 'i').test(mod_val)) {

                let matches2 = new RegExp('^([^:]+):([^:]+)$', 'i').exec(mod_val);

                let m2_1 =  null;
                if(matches2[1]){
                    m2_1 = matches2[1].trim();
                }

                let m2_2 =  null;
                if(matches2[2]){
                    m2_2 = matches2[2].trim();
                    if(isDelimiter === true) {
                        m2_2 = m2_2.replace(new RegExp(Util.Text.escapeRegex(delimiter) + '$', 'gi'), '');
                    }
                    m2_2 = m2_2.trim();
                }


                obj.push({
                    'value': {'original': mod_val.trim(), 'left': m2_1, 'right': m2_2},
                    'area': 'text',
                    'index': {
                        'start': st_idx,
                        'end': end_idx
                    }
                });
            }

        }

        return obj;

    },

    extractAllPureEmails(textStr, final_prefixSanitizer) {

        if (!(textStr && typeof textStr === 'string')) {
            throw new ValidationError('the variable textStr must be a string type and not be null.');
        }

        let obj = [];

        let rx = new RegExp(Pattern.Children.email, 'gi');


        let match = {};

        while ((match = rx.exec(textStr)) !== null) {

            let mod_val = match[0];

            let mod_val_front = mod_val.split(/@/)[0];

            let st_idx = match.index;
            let end_idx = match.index + match[0].length;


            /* prefixSanitizer */
            if (final_prefixSanitizer === true) {

                // the 'border' is a en char that divides non-en and en areas.
                let border = '';
                let removedLength = 0;

                let rx_left_plus_border = new RegExp('^([^a-zA-Z0-9]+)([a-zA-Z0-9])', '');

                let is_mod_val_front_only_foreign_lang = true;

                let match2 = {};
                if ((match2 = rx_left_plus_border.exec(mod_val_front)) !== null) {

                    is_mod_val_front_only_foreign_lang = false;

                    //console.log('match2:' + match2);

                    if(match2[1]) {
                        removedLength = match2[1].length;
                    }
                    if(match2[2]) {
                        border = match2[2];
                    }
                }

                if (is_mod_val_front_only_foreign_lang === false) {
                    mod_val = mod_val.replace(rx_left_plus_border, '');
                    mod_val = border + mod_val;
                }

                st_idx += removedLength;

            }

            let re = Email.assortEmail(mod_val);

            //console.log('re : ' + re);
            /* this part doesn't need to be included */
            if (re['removedTailOnEmail'] && re['removedTailOnEmail'].length > 0) {
                end_idx -= re['removedTailOnEmail'].length;
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

        return obj;


    }
};

const Url = {

    /**
     * @brief
     * Normalize an url or an uri
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    normalizeUrl(url) {

        let obj = {
            url: null,
            normalizedUrl: null,
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

            url = Valid.checkIfStrOrFailAndTrimStr(url);

            let modified_url  = Util.Text.removeAllSpaces(url);


/*            if (!Valid.isFuzzyUrlPattern(url)) {
                console.log('Error url : ' + url);
                throw new ValidationError('This is neither an url nor an uri.');
            }*/


            // 1. full url
            obj['url'] = url;

            // 2. protocol
            let rx = new RegExp('^(' + Pattern.Descendants.fuzzy_protocols  + '|'+ Pattern.Descendants.fuzzy_protocols2 + ')' + Pattern.Descendants.fuzzy_protocol_domain_delimiter);

            let match = {};
            let isMatched = false;
            while ((match = rx.exec(modified_url)) !== null) {

                if (match[1]) {

                    isMatched = true;

                    // exception case for rx
                    if (match[1] === 'localhost') {
                        obj['protocol'] = null;
                        break;
                    }

                    let score_arrs = [];
                    let protocol_arrs = Pattern.Ancestors.all_protocols_arrs;

                    //console.log('protocol_arrs :' + protocol_arrs);

                    protocol_arrs.forEach(function (val, idx) {
                        score_arrs.push(Util.Text.similarity(val, match[1]));
               //         console.log('url : ' + url + 'aa : ' + Util.Text.similarity(val, match[1]), val, match[1]);
                    });

                    //console.log('sa : ' + score_arrs);

                    obj['protocol'] = protocol_arrs[Util.Text.indexOfMax(score_arrs)];

                    break;
                }

            }

            modified_url = modified_url.replace(rx, '');


            // Domain
            let rx1 = new RegExp('^' + Pattern.Descendants.fuzzy_only_domain, 'gi');
            let match1 = {};
            while ((match1 = rx1.exec(modified_url)) !== null) {

                //let domain_temp = match1[0];

                //let domain_temp_front = domain_temp.replace(new RegExp(Pattern.Descendants.fuzzy_url_body + '$', 'gi'), '');
                let domain_temp = match1[0];

                //console.log('domain_temp : ' + domain_temp);



                // decide domain type
                if (new RegExp(Pattern.Descendants.fuzzy_ip_v4, 'i').test(domain_temp)) {

                    obj['type'] = 'ip_v4';

                    domain_temp = domain_temp.replace(new RegExp('^[^0-9]+', 'g'), '');
                    domain_temp = domain_temp.replace(new RegExp('[^0-9]+$', 'g'), '');
                    domain_temp = domain_temp.replace(new RegExp('[^0-9]+', 'g'), '.');

                } else if (new RegExp(Pattern.Descendants.fuzzy_ip_v6, 'i').test(domain_temp)) {

                    obj['type'] = 'ip_v6';

                    domain_temp = domain_temp.replace(new RegExp('[^\\[\\]0-9:]', 'g'), '');


                } else if (/^localhost/i.test(domain_temp)) {

                    obj['type'] = 'localhost';
                    domain_temp = domain_temp.replace(new RegExp(Pattern.Ancestors.not_allowed_char_on_domain, 'gi'), '');

                } else {

                    // ,com ,co,.kr ...
                    domain_temp = domain_temp.replace(new RegExp
                    ('' + Pattern.Ancestors.all_keypad_meta_chars_without_delimiters + '+'+ '(' + Pattern.Ancestors.all_root_domains + '|[a-zA-Z]+)', 'gi'), '.$1');

                    let domain_temp_root_domain_match = new RegExp('\\.([^.]+)$', 'i').exec(domain_temp);
                    if(domain_temp_root_domain_match !== null){
                        if(domain_temp_root_domain_match[1]){

                            let score_arrs = [];
                            let root_domains_arrs = Pattern.Ancestors.all_root_domains_arrs;

                            root_domains_arrs.forEach(function (val, idx) {
                                score_arrs.push(Util.Text.similarity(val, domain_temp_root_domain_match[1]));
                            });

                            //console.log('sa : ' + score_arrs);

                            let root_domain = root_domains_arrs[Util.Text.indexOfMax(score_arrs)];

                            domain_temp = domain_temp.replace(new RegExp('\\.([^.]+)$', 'i'), '.' + root_domain)
                        }
                    }


                    obj['type'] = 'domain';

                    domain_temp = domain_temp.replace(new RegExp('^' + Pattern.Ancestors.no_lang_char + '+', 'i'), '');
                    domain_temp = domain_temp.replace(new RegExp(Pattern.Ancestors.not_allowed_char_on_domain, 'gi'), '');
                    domain_temp = domain_temp.replace(new RegExp(Pattern.Ancestors.no_lang_char + '+$', 'i'), '');
                }

                //console.log('domain_temp : ' + domain_temp);
                obj['onlyDomain'] = domain_temp;


            }

            modified_url = modified_url.replace(rx1, '');
            //console.log('modified_url : ' + modified_url);

            // Port
            let rx2 = new RegExp('^' + Pattern.Descendants.fuzzy_port_must, 'gi');
            let match2 = {};
            while  ((match2 = rx2.exec(modified_url)) !== null) {

                obj['port']= match2[0].replace( /^\D+/g, '');
                modified_url = modified_url.replace(rx2, '');

            }

            let protocol_str = obj['protocol'];
            if(!obj['protocol']){
                protocol_str = '';
            }else{
                protocol_str += '://';
            }

            let port_str = obj['port'];
            if(!obj['port']){
                port_str = '';
            }else{
                port_str= ':' + port_str;
            }

            let onlyDomain_str = obj['onlyDomain'];
            if(!onlyDomain_str){
                onlyDomain_str = '';
            }

            /* Now, only the end part of a domain is left */
            /* Consecutive param delimiters should be replaced into one */
            modified_url  = modified_url.replace(/[/]{2,}/gi, '/');
            modified_url  = modified_url.replace(/(.*?)[?]{2,}([^/]*?(?:=|$))(.*)/i, function(match, $1, $2, $3){
                //console.log(modified_url + ' a :' + $1 + '?' + $2 + $3);
                return $1 + '?' + $2 + $3;
            });


            /* 'modified_url' must start with '/,?,#' */
            let rx_modified_url = new RegExp('(?:\\/|\\?|\\#)', 'i');
            let match_modified_url = {};
            if ((match_modified_url = rx_modified_url.exec(modified_url)) !== null) {

                modified_url = modified_url.replace(new RegExp('^.*?(' + Util.Text.escapeRegex(match_modified_url[0]) + '.*)$', 'i'), function(match, $1){
                    return $1;
                });
            }

 /*           let rx_root_domain = new RegExp('\\.[^.]+$', 'i');
            let match_root_domain = {};
            if ((match_root_domain = rx_root_domain.exec(onlyDomain_str)) !== null) {

                if(match_root_domain[0]) {

                    let rx_root_domain_sub = new RegExp(Pattern.Ancestors.all_root_domains, 'i');
                    let match_root_domain_sub = {};
                    if ((match_root_domain_sub = rx_root_domain_sub.exec(match_root_domain[0])) !== null) {

                        onlyDomain_str = onlyDomain_str.replace(rx_root_domain, '.' + match_root_domain_sub[0]);

                    }

                }

            }*/

            obj['normalizedUrl'] = protocol_str + onlyDomain_str + port_str + modified_url;


            //console.log('modified_url3 : ' +  modified_url);


            if(!modified_url || modified_url.trim() === ''){

                obj['onlyParams'] = null;
                obj['onlyUri'] = null;

            }else{

                // PARAMS
                let rx3 = new RegExp('\\?(?:.|[\\n\\r\\t\\s])*$', 'gi');
                let match3 = {};
                while ((match3 = rx3.exec(modified_url)) !== null) {

                    obj['onlyParams'] = match3[0];
                }
                modified_url = modified_url.replace(rx3, '');

                if (obj['onlyParams'] === "?") {
                    obj['onlyParams'] = null;
                }


                // URI
                let rx4 = new RegExp('\\/(?:.|[\\n\\r\\t\\s])*$', 'gi');
                let match4 = {};
                while ((match4 = rx4.exec(modified_url)) !== null) {
                    obj['onlyUri'] = match4[0];
                }
                modified_url = modified_url.replace(rx4, '');

                if (obj['onlyUri'] === "/") {
                    obj['onlyUri'] = null;
                }

            }


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


            // If no uris no params, we remove suffix in case that it is a meta character.
           if (obj['onlyUri'] === null && obj['onlyParams'] === null) {

                if (obj['type'] !== 'ip_v6') {
                    // removedTailOnUrl
                    let rm_part_matches = obj['url'].match(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'));
                    if (rm_part_matches) {
                        obj['removedTailOnUrl'] = rm_part_matches[0];
                        obj['url'] = obj['url'].replace(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                    }
                } else {

                    if (obj['port'] === null) {

                        // removedTailOnUrl
                        let rm_part_matches = obj['url'].match(new RegExp('[^\\u005D]+$', 'gi'));
                        if (rm_part_matches) {
                            obj['removedTailOnUrl'] = rm_part_matches[0];
                            obj['url'] = obj['url'].replace(new RegExp('[^\\u005D]+$', 'gi'), '');
                        }

                    } else {

                        // removedTailOnUrl
                        let rm_part_matches = obj['url'].match(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'));
                        if (rm_part_matches) {
                            obj['removedTailOnUrl'] = rm_part_matches[0];
                            obj['url'] = obj['url'].replace(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                        }
                    }


                }

            } else if (obj['onlyUri'] !== null && obj['onlyParams'] === null) {

                let rm_part_matches = new RegExp('\\/([^/\\n\\r\\t\\s]+?)(' + Pattern.Ancestors.no_lang_char_num + '+)$', 'gi').exec(obj['url']);

                //console.log(obj['url'] + ' : ' + rm_part_matches[1]);

                if (rm_part_matches) {
                    if (rm_part_matches[1]) {
                        if (!new RegExp(Pattern.Ancestors.no_lang_char_num, 'gi').test(rm_part_matches[1])) {
                            if (rm_part_matches[2]) {
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['url'] = obj['url'].replace(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                            }
                        }
                    }

                }

            } else if (obj['onlyParams'] !== null) {

                let rm_part_matches = new RegExp('\\=([^=\\n\\r\\t\\s]+?)(' + Pattern.Ancestors.no_lang_char_num + '+)$', 'gi').exec(obj['url']);

   /*                    console.log(obj['url'] + '1 : ' + rm_part_matches[1]);
                              console.log(obj['url'] + '2 : ' + rm_part_matches[2]);*/

                if (rm_part_matches) {
                    if (rm_part_matches[1]) {
                        if (!new RegExp(Pattern.Ancestors.no_lang_char_num, 'gi').test(rm_part_matches[1])) {
                            if (rm_part_matches[2]) {
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['url'] = obj['url'].replace(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                            }
                        }
                    }

                }
            }


            // If no uri no params, we remove suffix in case that it is non-alphabets.
            // The regex below means "all except for '.'". It is for extracting all root domains, so non-domain types like ip are excepted.
            if (obj['type'] === 'domain') {

                if (obj['onlyUri'] === null && obj['onlyParams'] === null) {

                    if (obj['port'] === null) {

                        let onlyEnd = obj['url'].match(new RegExp('[^.]+$', 'gi'));
                        if (onlyEnd && onlyEnd.length > 0) {

                            // this is a root domain only in English like com, ac
                            // but the situation is like com가, ac나
                            if (/^[a-zA-Z]+/.test(onlyEnd[0])) {

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
            }
            // 12. uri like 'abc/def'
            //if(!new RegExp('^' + Pattern.Ancestors.all_protocols + '|\\.' + Pattern.Ancestors.all_root_domains + '\\/|\\?','gi').test(obj['onlyDomain'])){
/*            if (!new RegExp(Pattern.Children.url, 'gi').test(obj['normalizedUrl'])) {

                obj['onlyDomain'] = null;
                obj['type'] = 'uri';

                if (!/^[/]/.test(obj['url'])) {

                    obj['onlyUriWithParams'] = obj['url'];
                    obj['onlyUri'] = obj['url'].replace(/\?[^/]*$/gi, '');
                }
            }*/

            //}

        } catch (e) {

            console.log(e);

        } finally {

            return obj;

        }

    },

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

            url = Valid.checkIfStrOrFailAndTrimStr(url);

            url = Util.Text.removeAllSpaces(url);


            if (!Valid.isUrlPattern(url) && !Valid.isUriPattern(url)) {
                throw new ValidationError('This is neither an url nor an uri.' + ' / Error url : ' + url);
            }


            // 1. full url
            obj['url'] = url;

            // 2. protocol
            let rx = new RegExp('^([a-zA-Z0-9]+):');

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

                    let rx2 = new RegExp(Pattern.Ancestors.all_protocols, 'gi');

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
            if (new RegExp('^' + Pattern.Ancestors.ip_v4, 'i').test(url)) {
                obj['type'] = 'ip_v4';
            } else if (new RegExp('^' + Pattern.Ancestors.ip_v6, 'i').test(url)) {
                //console.log('r : ' + url);
                obj['type'] = 'ip_v6';
            } else if (/^localhost/i.test(url)) {
                obj['type'] = 'localhost';
            } else {
                obj['type'] = 'domain';
            }


            // If no uris no params, we remove suffix in case that it is a meta character.
            if (obj['onlyUri'] === null && obj['onlyParams'] === null) {

                if (obj['type'] !== 'ip_v6') {
                    // removedTailOnUrl
                    let rm_part_matches = obj['url'].match(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'));
                    if (rm_part_matches) {
                        obj['removedTailOnUrl'] = rm_part_matches[0];
                        obj['url'] = obj['url'].replace(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                    }
                } else {

                    if (obj['port'] === null) {

                        // removedTailOnUrl
                        let rm_part_matches = obj['url'].match(new RegExp('[^\\u005D]+$', 'gi'));
                        if (rm_part_matches) {
                            obj['removedTailOnUrl'] = rm_part_matches[0];
                            obj['url'] = obj['url'].replace(new RegExp('[^\\u005D]+$', 'gi'), '');
                        }

                    } else {

                        // removedTailOnUrl
                        let rm_part_matches = obj['url'].match(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'));
                        if (rm_part_matches) {
                            obj['removedTailOnUrl'] = rm_part_matches[0];
                            obj['url'] = obj['url'].replace(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                        }
                    }


                }

            } else if (obj['onlyUri'] !== null && obj['onlyParams'] === null) {

                let rm_part_matches = new RegExp('\\/([^/\\n\\r\\t\\s]+?)(' + Pattern.Ancestors.no_lang_char_num + '+)$', 'gi').exec(obj['url']);

                //console.log(obj['url'] + ' : ' + rm_part_matches[1]);

                if (rm_part_matches) {
                    if (rm_part_matches[1]) {
                        if (!new RegExp(Pattern.Ancestors.no_lang_char_num, 'gi').test(rm_part_matches[1])) {
                            if (rm_part_matches[2]) {
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['url'] = obj['url'].replace(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                            }
                        }
                    }

                }

            } else if (obj['onlyParams'] !== null) {

                let rm_part_matches = new RegExp('\\=([^=\\n\\r\\t\\s]+?)(' + Pattern.Ancestors.no_lang_char_num + '+)$', 'gi').exec(obj['url']);

                /*              console.log(obj['url'] + '1 : ' + rm_part_matches[1]);
                              console.log(obj['url'] + '2 : ' + rm_part_matches[2]);*/

                if (rm_part_matches) {
                    if (rm_part_matches[1]) {
                        if (!new RegExp(Pattern.Ancestors.no_lang_char_num, 'gi').test(rm_part_matches[1])) {
                            if (rm_part_matches[2]) {
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['removedTailOnUrl'] = rm_part_matches[2];
                                obj['url'] = obj['url'].replace(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                            }
                        }
                    }

                }
            }


            // If no uri no params, we remove suffix in case that it is non-alphabets.
            // The regex below means "all except for '.'". It is for extracting all root domains, so non-domain types like ip are excepted.
            if (obj['type'] === 'domain') {

                if (obj['onlyUri'] === null && obj['onlyParams'] === null) {

                    if (obj['port'] === null) {

                        let onlyEnd = obj['url'].match(new RegExp('[^.]+$', 'gi'));
                        if (onlyEnd && onlyEnd.length > 0) {

                            // this is a root domain only in English like com, ac
                            // but the situation is like com가, ac나
                            if (/^[a-zA-Z]+/.test(onlyEnd[0])) {

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
            }
            // 12. uri like 'abc/def'
            //if(!new RegExp('^' + Pattern.Ancestors.all_protocols + '|\\.' + Pattern.Ancestors.all_root_domains + '\\/|\\?','gi').test(obj['onlyDomain'])){
            if (!new RegExp(Pattern.Children.url, 'gi').test(obj['url'])) {

                obj['onlyDomain'] = null;
                obj['type'] = 'uri';

                if (!/^[/]/.test(obj['url'])) {

                    obj['onlyUriWithParams'] = obj['url'];
                    obj['onlyUri'] = obj['url'].replace(/\?[^/]*$/gi, '');
                }
            }

           //obj['normalizedUrl'] = this.normalizeUrl(obj['url'])['normalizedUrl'];


            //}

        } catch (e) {

            console.log(e);

        } finally {

            return obj;

        }

    }

};

const Email = {
    assortEmail(email){

        let obj = {
            email : null,
            removedTailOnEmail: null,
            type : null
        };

        try {

            email = Valid.checkIfStrOrFailAndTrimStr(email);
            email = Util.Text.removeAllSpaces(email);

            if (!Valid.isEmailPattern(email)) {
                throw new ValidationError('This is not an email');
            }

            obj['email'] = email;

            if (new RegExp('@' + Pattern.Ancestors.all_existences + '*' + Pattern.Ancestors.ip_v4, 'i').test(email)) {
                obj['type'] = 'ip_v4';
            } else if (new RegExp('@' + Pattern.Ancestors.all_existences + '*' + Pattern.Ancestors.ip_v6, 'i').test(email)) {
                //console.log('r : ' + url);
                obj['type'] = 'ip_v6';
            } else {
                obj['type'] = 'domain';
            }


            // If no uris no params, we remove suffix in case that it is a meta character.
            if (obj['type'] !== 'ip_v6') {
                // removedTailOnUrl
                let rm_part_matches = obj['email'].match(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'));
                if (rm_part_matches) {
                    obj['removedTailOnUrl'] = rm_part_matches[0];
                    obj['email'] = obj['email'].replace(new RegExp(Pattern.Ancestors.no_lang_char_num + '+$', 'gi'), '');
                }
            } else {

                // removedTailOnUrl
                let rm_part_matches = obj['email'].match(new RegExp('[^\\u005D]+$', 'gi'));
                if (rm_part_matches) {
                    obj['removedTailOnUrl'] = rm_part_matches[0];
                    obj['email'] = obj['email'].replace(new RegExp('[^\\u005D]+$', 'gi'), '');
                }

            }

            // If no uri no params, we remove suffix in case that it is non-alphabets.
            // The regex below means "all except for '.'". It is for extracting all root domains, so non-domain types like ip are excepted.

            let onlyEnd = obj['email'].match(new RegExp('[^.]+$', 'gi'));
            if (onlyEnd && onlyEnd.length > 0) {

                // this is a root domain only in English like com, ac
                // but the situation is like com가, ac나
                if (/^[a-zA-Z]+/.test(onlyEnd[0])) {

                    if (/[^a-zA-Z]+$/.test(obj['email'])) {

                        // remove non alphabets
                        obj['removedTailOnUrl'] = obj['email'].match(/[^a-zA-Z]+$/)[0] + obj['removedTailOnUrl'];
                        obj['email'] = obj['email'].replace(/[^a-zA-Z]+$/, '');
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

    Xml, Text, Url
}