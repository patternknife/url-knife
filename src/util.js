/*
*     Private : Utils
* */
import Valid from "./valid";
import ValidationError from './error-handler';
import Rx from './rx';

const Text = {

    /* args - st : 대상 스트링, index : replacement가 삽입될 위치, replacement : 바뀌어지는 스트링 */
    replaceAt: function (st, index, replacement) {

        //console.log(str.length);
        let str = st.toString();
        let len = str.length;
        let fw = str.substr(0, index);
        let lw = str.substr(index, index + len);

        return fw + replacement + lw;

    },

    replaceBetween(from, start, end, what) {
        return from.substring(0, start) + what + from.substring(end);
    },
    escapeRegex(v) {
        return v.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    removeAllSpaces(v) {
        return v.replace(/[\n\r\t\s]/g, '');
    },
    reduceEndIndex(tg, endIndex, ptrn) {

        let obj = {
            'tg': tg,
            'endIndex': endIndex
        };

        let rx = new RegExp(ptrn, 'gi');
        let match = {};
        while ((match = rx.exec(tg)) !== null) {
            endIndex -= match[0].length;
        }

        obj['tg'] = tg.replace(rx, '');
        obj['endIndex'] = endIndex;

        return obj;
    },

    urisToOne(uris){

        let re = '';

        for(let a=0; a < uris.length; a++){

            let re_partial = '';
            for(let b=0; b < uris[a].length; b++){

                if (!(uris[a][b] && typeof uris[a][b] === 'string')) {
                    throw new ValidationError('A value not in a string type has been found : ' + uris[a][b] + ' / loc in for clause : a=' + a + ' / b=' + b);
                }

                uris[a][b] = this.removeAllSpaces(uris[a][b]);
                if(b === 0) {
                    if (new RegExp('^' + Rx.Ancestors.no_lang_char_num, 'i').test(uris[a][b])) {
                        throw new ValidationError('The first letter of the first URI part must not be a meta char : not valid : ' + uris[a][b]);
                    }
                }

                if(b < uris[a].length - 1){
                    re_partial +=  uris[a][b] + '/';
                }else{
                    re_partial +=  uris[a][b];
                }

            }

            if(a < uris.length - 1){
                re +=  this.escapeRegex(re_partial) + '|';
            }else{
                re +=  this.escapeRegex(re_partial);
            }

        }

        return re;

    }

};

export default {
    Text
}