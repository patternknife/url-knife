import Rx from './rx';
import {ValidationError} from './error-handler';


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

    failIfNotUrlPtrn(v) {

        v = this.checkAndTrimStr(v);

        if (/\?\//.test(v)) {

            throw new ValidationError('?/ is a wrong url pattern.');

        }


    }

};


export default {

    Valid, Xml
}