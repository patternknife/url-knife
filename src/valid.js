import ValidationError from './error-handler';

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

export default Valid;