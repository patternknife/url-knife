/*
*     Private : Utils
* */
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
    }

};

export default {
    Text
}