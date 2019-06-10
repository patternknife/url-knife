import ValidationError from './error-handler';
import Rx from './rx';

/*
*     Private : Validation Check
* */
const Valid = {

    checkAndTrimStr(sth) {

        if (!(sth && typeof sth === 'string')) {

            throw new ValidationError('the variable url must be a string type and not be null.');

        } else {

            sth = sth.trim();

        }

        return sth;

    },

    isUrlPattern(v) {

        //v = this.checkAndTrimStr(v);

/*        if (/\?\//.test(v)) {
            throw new ValidationError('?/ is a wrong url pattern.');
        }*/

        if(!new RegExp('^' + Rx.Children.url ,'gi').test(v)){
           return false;
        }

        return true

    },
    isUriPattern(v) {

        //v = this.checkAndTrimStr(v);

        if(!new RegExp('^' + Rx.Descendants.all_uris ,'gi').test(v)){
            return false;
        }

        return true

    },

};

export default Valid;