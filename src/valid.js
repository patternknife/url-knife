import Pattern from './pattern';

/*
*     Private : Validation Check
* */
const Valid = {

    checkIfStrOrFailAndTrimStr(sth) {

        if (!(sth && typeof sth === 'string')) {

            throw new Error('the variable url must be a string type and not be null.');

        } else {

            sth = sth.trim();

        }

        return sth;

    },

    isFuzzyUrlPattern(v) {

        if(!new RegExp('^' + Pattern.Children.fuzzy_url() ,'gi').test(v)){
            return false;
        }

        return true

    },

    isUrlPattern(v) {

        //v = this.checkAndTrimStr(v);

/*        if (/\?\//.test(v)) {
            throw new Error('?/ is a wrong url pattern.');
        }*/

        if(!new RegExp('^' + Pattern.Children.url ,'gi').test(v)){
           return false;
        }

        return true

    },
    isUriPattern(v) {

        //v = this.checkAndTrimStr(v);

        if(!new RegExp('^' + Pattern.Descendants.all_uris ,'gi').test(v)){
            return false;
        }

        return true

    },

    isEmailPattern(v) {

        if(!new RegExp('^' + Pattern.Children.email ,'gi').test(v)){
            return false;
        }

        return true

    },

    checkIfProtocolJsnObjOrFail(noProtocolJsn){

        if(!(noProtocolJsn && typeof noProtocolJsn === 'object' &&
                noProtocolJsn.hasOwnProperty('ip_v4') && typeof noProtocolJsn['ip_v4'] === 'boolean' &&
                noProtocolJsn.hasOwnProperty('ip_v6')  && typeof noProtocolJsn['ip_v6'] === 'boolean' &&
                noProtocolJsn.hasOwnProperty('localhost') && typeof noProtocolJsn['localhost'] === 'boolean' &&
                noProtocolJsn.hasOwnProperty('intranet') && typeof noProtocolJsn['intranet'] === 'boolean'
            )){

            throw new Error('Not a "noProtocolJsn{' +
                '\'ip_v4\' : [boolean],' +
                '\'ip_v6\' : [boolean],' +
                '\'localhost\' : [boolean],' +
                '\'intranet\' : [boolean]' +
                '}" object');

        }
    }

};

export default Valid;