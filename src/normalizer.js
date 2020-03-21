import Pattern from "./pattern";
import Util from "./util";

export const Normalizer = {

    modified_url : null,

    extractAndNormalizeProtocolFromSpacesRemovedUrl(){

        let protocol = null;

        let rx = new RegExp('^(' + Pattern.Descendants.fuzzy_protocols  + '|'+ Pattern.Descendants.fuzzy_protocols2 + ')' + Pattern.Descendants.fuzzy_protocol_domain_delimiter);

        let match = {};
        let isMatched = false;
        while ((match = rx.exec(this.modified_url)) !== null) {

            if (match[1]) {

                isMatched = true;

                // exception case for rx
                if (match[1] === 'localhost') {
                    protocol = null;
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

                protocol = protocol_arrs[Util.Text.indexOfMax(score_arrs)];

                break;
            }

        }

        this.modified_url = this.modified_url.replace(rx, '');


        return protocol;

    },

    extractAndNormalizeDomainFromProtocolRemovedUrl(){

        let result = {
            'domain' : null,
            'type' : null
        }


        let rx1 = new RegExp('(' + Pattern.Descendants.fuzzy_only_domain + '.*?)(' + Pattern.Descendants.fuzzy_port_recommended +
            Pattern.Descendants.fuzzy_url_params_recommended + ')$', 'gi');
        let match1 = {};
        while ((match1 = rx1.exec(this.modified_url)) !== null) {

            // remaining full url
            let domain_temp = match1[0];
            // domain
            let domain_temp2 = match1[1];
            // full url without domain
            let domain_temp3 = match1[2];

            //console.log('domain_temp : ' + domain_temp);

            // decide domain type
            if (new RegExp(Pattern.Descendants.fuzzy_ip_v4, 'i').test(domain_temp2)) {

                result['type'] = 'ip_v4';

                // with id pwd
                if(new RegExp('^.*@' + Pattern.Descendants.fuzzy_ip_v4, 'i').test(domain_temp)){
                    domain_temp2 = domain_temp2.replace(new RegExp('[^0-9]+$', 'g'), '');
                }else{
                    domain_temp2 = domain_temp2.replace(new RegExp('^[^0-9]+', 'g'), '');
                    domain_temp2 = domain_temp2.replace(new RegExp('[^0-9]+$', 'g'), '');
                    domain_temp2 = domain_temp2.replace(new RegExp('[^0-9]+', 'g'), '.');
                }


            } else if (new RegExp(Pattern.Descendants.fuzzy_ip_v6, 'i').test(domain_temp2)) {

                result['type']  = 'ip_v6';

                // with id pwd
                if(new RegExp('^.*@' + Pattern.Descendants.fuzzy_ip_v6, 'i').test(domain_temp2)){

                    if(domain_temp2.split('@[')[1]){
                        let afterAt = domain_temp2.split('@[')[1];
                        afterAt = afterAt.replace(new RegExp('[^\\[\\]0-9:]', 'g'), '');
                        domain_temp2 = domain_temp2.split('@[')[0] + '@[' + afterAt;
                    }

                }else{
                    domain_temp2 = domain_temp2.replace(new RegExp('[^\\[\\]0-9:]', 'g'), '');
                }


            } else if (/^localhost$/i.test(domain_temp2)) {

                result['type']  = 'localhost';
                //domain_temp = domain_temp.replace(new RegExp(Pattern.Ancestors.not_allowed_char_on_domain, 'gi'), '');

            } else {

                //console.log('domain_temp1 : ' + domain_temp);
                //console.log('domain_temp1.5 : ' + domain_temp2);
                //console.log('domain_temp1.52 : ' + domain_temp3);
                // ,com ,co,.kr ...
                domain_temp2 = domain_temp2.replace(new RegExp
                ('' + Pattern.Ancestors.all_keypad_meta_chars_without_delimiters + '+'+ '(' + Pattern.Ancestors.all_root_domains + '|[a-zA-Z]+)', 'gi'), '.$1');

                let domain_temp_root_domain_match = new RegExp('\\.([^.]+)$', 'i').exec(domain_temp2);
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

                result['type']  = 'domain';

                domain_temp2 = domain_temp2.replace(new RegExp('^' + Pattern.Ancestors.no_lang_char + '+', 'i'), '');
                //domain_temp = domain_temp.replace(new RegExp(Pattern.Ancestors.not_allowed_char_on_domain, 'gi'), '');
                domain_temp2 = domain_temp2.replace(new RegExp(Pattern.Ancestors.no_lang_char + '+$', 'i'), '');
            }

            //console.log('domain_temp2 : ' + domain_temp2);

            // root domain integrity
            if(result['type'] === 'domain') {
                // root domain integrity
                let d2_arrs = domain_temp2.split('.');

                let match_rt = {};
                let match_srt = {};
                let calculated_domain = '';
                let root_domain = '';
                let root_domain2 = null;
                let sub_root_domain = '';
                if ((match_rt = new RegExp(Pattern.Ancestors.all_root_domains, 'i').exec(d2_arrs[d2_arrs.length - 1])) !== null && d2_arrs.length >= 2) {
                    root_domain = match_rt[0];
                }
                if (d2_arrs.length >= 3 && d2_arrs[d2_arrs.length - 2].length < 4) {
                    if ((match_srt = new RegExp(Pattern.Ancestors.all_root_domains, 'i').exec(d2_arrs[d2_arrs.length - 2])) !== null) {
                        root_domain2 = match_srt[0];
                    }
                }

                d2_arrs.forEach(function (val, idx) {

                    if (idx === d2_arrs.length - 1) {
                        calculated_domain += root_domain;
                    } else if (root_domain2 && idx === d2_arrs.length - 2) {
                        calculated_domain += root_domain2 + '.';
                    } else {
                        calculated_domain += val + '.';
                    }

                })

                result['domain'] = calculated_domain;

            }else{

                result['domain'] = domain_temp2;
            }

            this.modified_url = domain_temp3;

        }

        /*            modified_url = modified_url.replace(new RegExp('(' + Pattern.Descendants.fuzzy_only_domain + '.*?)' + Pattern.Descendants.fuzzy_port_recommended +
                        Pattern.Descendants.fuzzy_url_params_recommended + '$', 'gi'), '');*/
        //console.log('modified_url : ' + this.modified_url);
        this.modified_url = this.modified_url.replace(new RegExp('^(?:' + Pattern.Ancestors.two_bytes_num + '|' +  Pattern.Ancestors.lang_char + ')+', 'i'), '');
        //console.log('modified_url2 : ' + this.modified_url);
        return result;

    },

    extractAndNormalizePortFromDomainRemovedUrl(){

        let port = null;

        let rx2 = new RegExp('^' + Pattern.Descendants.fuzzy_port_must, 'gi');
        let match2 = {};

        //console.log('aa : ' + this.modified_url)

        while  ((match2 = rx2.exec(this.modified_url)) !== null) {


            port = match2[0].replace( /^\D+/g, '');
            this.modified_url = this.modified_url.replace(rx2, '');
        }

        return port;

    },

    finalizeNormalization(protocol, port, domain){

        /* Now, only the end part of a domain is left */
        /* Consecutive param delimiters should be replaced into one */
        this.modified_url = this.modified_url.replace(/[#]{2,}/gi, '#');
        this.modified_url  = this.modified_url.replace(/[/]{2,}/gi, '/');
        this.modified_url  = this.modified_url.replace(/(.*?)[?]{2,}([^/]*?(?:=|$))(.*)/i, function(match, $1, $2, $3){
            //console.log(modified_url + ' a :' + $1 + '?' + $2 + $3);
            return $1 + '?' + $2 + $3;
        });

        /* 'modified_url' must start with '/,?,#' */
        let rx_modified_url = new RegExp('(?:\\/|\\?|\\#)', 'i');
        let match_modified_url = {};
        if ((match_modified_url = rx_modified_url.exec(this.modified_url)) !== null) {

            this.modified_url = this.modified_url.replace(new RegExp('^.*?(' + Util.Text.escapeRegex(match_modified_url[0]) + '.*)$', 'i'), function(match, $1){
                return $1;
            });
        }

        let protocol_str = protocol;
        if(!protocol){
            protocol_str = '';
        }else{
            protocol_str += '://';
        }

        let port_str = port;
        if(!port){
            port_str = '';
        }else{
            port_str= ':' + port_str;
        }

        let onlyDomain_str = domain;
        if(!onlyDomain_str){
            onlyDomain_str = '';
        }

        return protocol_str + onlyDomain_str + port_str + this.modified_url;

    },

    extractAndNormalizeUriParamsFromPortRemovedUrl(){

        let result = {
            uri : null,
            params : null
        };


        if(!this.modified_url || this.modified_url.trim() === ''){

            result['params'] = null;
            result['uri'] = null;

        }else{

            // PARAMS
            let rx3 = new RegExp('\\?(?:.)*$', 'gi');
            let match3 = {};
            while ((match3 = rx3.exec(this.modified_url)) !== null) {

                result['params'] = match3[0];
            }
            this.modified_url = this.modified_url.replace(rx3, '');

            if (result['params'] === "?") {
                result['params']  = null;
            }


            // URI
            let rx4 = new RegExp('[#/](?:.)*$', 'gi');
            let match4 = {};
            while ((match4 = rx4.exec(this.modified_url)) !== null) {
                result['uri'] = match4[0];
            }
            this.modified_url = this.modified_url.replace(rx4, '');

            if (result['uri'] === "/") {
                result['uri'] = null;
            }

        }

        return result;

    }

}