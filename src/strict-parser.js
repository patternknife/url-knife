/*
*
*
*   -- Strict-parser --
*
*   Copyright (c) 2019 Andrew Kang
*
*   The MIT License (MIT)

    Copyright (c) 2011-2018 Twitter, Inc.
    Copyright (c) 2011-2018 The Bootstrap Authors

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.


* */

import Jquery from 'jquery';

import Terms from './terms';

const fup = require("fast-url-parser");
fup.queryString = require("querystringparser");

/*
*   Private : Error Handler (Customized)
* */

// 1. ValidationError - warn users of wrong values.
function ValidationError() {

    let temp = Error.apply(this, arguments);
    temp.name = this.name = 'ValidationError';
    this.message = temp.message;

    if (Object.defineProperty) {

        // getter for more optimize goodness
        Object.defineProperty(this, 'stack', {
            get: function () {
                return temp.stack
            },
            configurable: true // so you can change it if you want
        })

    } else {

        this.stack = temp.stack

    }

}

ValidationError.prototype = Object.create(Error.prototype, {

    constructor: {
        value: ValidationError,
        writable: true,
        configurable: true
    }

});


/*
*     Private : Core
* */

const RxGroup_P = {

    /* The three properties must be considered together if one of them is modified */
    lang_char: '[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6E5\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]',
    no_lang_char: '[^\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6E5\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]',
    no_lang_char_num: '[^0-9\\uFF10-\\uFF19\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6E5\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]',

    all_protocols: '(?:apr|dhcp|dns|dsn|ftp|http|https|imap|icmp|idrp|ip|irc|pop3|par|rlogin|smtp|ssl|ssh|tcp|telnet|upd|ups)',
    /* remove alpha-nums from rfc3986_unreserved([A-Za-z0-9-_.~]) */
    rfc3986_unreserved_no_alphaNums: '[\\u002D\\u005F\\u002E\\u007E]',

    /* CH & JP 2 byte nums */
    two_bytes_num: '[\\uFF10-\\uFF19]'

};

const RxGroup = {

    xml_comment: '<\\!--(?:.|[\\n\\r\\t])*?-->',
    xml_element:

    /* Type A. <p> or <p abc> */

    '(?:<' + '(?:' + RxGroup_P.lang_char + '[^<>\\u0022\\u0027\\t\\s]*)' + '(?:[\\t\\s]+[^<>\\u0022\\u0027\\u002F]*?|)(?:[\\n\\r\\t\\s]*\\/[\\n\\r\\t\\s]*|)>)|' +

    /* Type B. <p abc="" ...> */

    /* 1) Head part*/
    '(?:<' + '(?:' + RxGroup_P.lang_char + '[^<>\\u0022\\u0027\\t\\s]*)' + '[\\t\\s]+[^<>\\n\\r\\t\\s\\u0022\\u0027\\u002F].*?' +

    /* 2) Tail part*/

    // text (ex. readonly)>
    '(?:[\\t\\s]+?[^<>\\n\\r\\t\\s\\u0022\\u0027\\u002F]+?|' +
    // "....">
    '(?:[\\u0022].*?[\\u0022]|[\\u0027].*?[\\u0027])[\\n\\r\\t\\s]*)' +

    /* 3) Final tail part */
    '(?:[\\n\\r\\t\\s]*\\/[\\n\\r\\t\\s]*|)>)|' +

    /* Type C. </p> */
    '(?:<\\/' + '(?:' + RxGroup_P.lang_char + '[^<>\\u0022\\u0027\\t\\s]*)' + '[^>]*?>)',

    /* possibilities (localhost, ip nums without protocols) */
    all_urls:
    '(?:' + RxGroup_P.all_protocols + '[\\n\\r\\t\\s]*:[\\n\\r\\t\\s]*/[\\n\\r\\t\\s]*/[\\n\\r\\t\\s]*)(?:[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+|\\blocalhost\\b)' +
    // port or not
    '(?:[\\t\\s]*:[\\t\\s]*[0-9]+|)' +
    // uri, params
    '(?:(?:(/|\\?|#)[^\\n\\r\\t\\s]*)|)',

    /* all_urls from validator.js */
    all_urls2: '(?:' + RxGroup_P.all_protocols + '[\\n\\r\\t\\s]*:[\\n\\r\\t\\s]*/[\\n\\r\\t\\s]*/[\\n\\r\\t\\s]*)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?',

    /* additional possibilities (domain without protocols) */
    /* this is for ./ref/terms.js ('https://www.iana.org/domains/root/db') */
    all_urls3_front: '(?:(?:' + RxGroup_P.all_protocols + '[\\n\\r\\t\\s]*:[\\n\\r\\t\\s]*/[\\n\\r\\t\\s]*/[\\n\\r\\t\\s]*)|@|)' +
    RxGroup_P.lang_char + '(?:\\.|(?:[0-9]|' + RxGroup_P.two_bytes_num + '|' + RxGroup_P.rfc3986_unreserved_no_alphaNums + '|' + RxGroup_P.lang_char + '))*\\.',
    all_urls3_end : '(?:' + Terms.all_root_domains + '\\b)' +
    '(?:' + Terms.all_root_domains  + '|\\.)*' +
    // port or not
    '(?:[\\n\\r\\t\\s]*:[\\n\\r\\t\\s]*[0-9]+|)' +
    // uri, params
    '(?:(?:(/|\\?|#)[^\\n\\r\\t\\s]*)|)',


    /* this is for ./ref/terms.js ('https://www.iana.org/domains/root/db') */
    all_urls3_end2: '(?:(?:\\/|\\?)[^\\n\\r\\t\\s]*|\\.[^\\n\\r\\t\\s]+|[\\n\\r\\t\\s]*:[\\n\\r\\t\\s]*[0-9]+|\\b)',
    //all_urls3_end: '(?:(?:\\/|\\?)[\\n\\r\\t\\s]*[^\\s]*|(?:\\b))',

    /* only uri (in the future not yet)*/
    all_urls4:
    // 1. '/a...' (the first letter must be any lang char and nums)
    '(?:\\/' + '(?:[0-9]|' + RxGroup_P.two_bytes_num + '|' + RxGroup_P.lang_char + ')' + '[^/\\n\\r\\t\\s]*(?:\\/[^/\\n\\r\\t\\s]*|\\b))' +
    '|' +
    // 2. 'abc/...' (the first letter must be any lang char and nums)
    '(?:(?:[0-9]|' + RxGroup_P.two_bytes_num + '|' + RxGroup_P.lang_char + ')' + '[^/\\n\\r\\t\\s]*\\/[^\\n\\r\\t\\s]*)',

    all_emails: '(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))[\\n\\r\\t\\s]*@[\\n\\r\\t\\s]*((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{1,3}))',


};


/*
*     Private : Processing
* */
const XmlService = {

    extractAllPureElements(xmlStr) {

        const rx = new RegExp(RxGroup.xml_element, "g");


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

        const rx = new RegExp(RxGroup.xml_comment, 'gi');

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
const ValidService = {

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

/*
*     Private : Utils
* */
const UtilObj = {

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
    /* args - st : 대상 스트링, index : replacement가 삽입될 위치, replacement : 바뀌어지는 스트링 */

    replaceAt: function (st, index, replacement) {

        //console.log(str.length);
        let str = st.toString();
        let len = str.length;
        let fw = str.substr(0, index);
        let lw = str.substr(index, index + len);

        return fw + replacement + lw;

    }

};


/*
*     Public
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

        const cmt_matches = XmlService.extractAllPureComments(xmlStr);

        let matches = XmlService.extractAllPureElements(xmlStr);


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

        let el_matches = XmlService.extractAllPureElements(xmlStr);
        let matches = XmlService.extractAllPureComments(xmlStr);

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

        const url_core_rx = RxGroup.all_urls + '|' + RxGroup.all_urls2 + '|' + RxGroup.all_urls3_front + RxGroup.all_urls3_end;


        let obj = [];

        if (!skipXml) {

            let cmt_matches = XmlArea.extractAllComments(xmlStr);
            let el_matches = XmlArea.extractAllElements(xmlStr);

            /* 1. comment */
            for (let a = 0; a < cmt_matches.length; a++) {

                let rx = new RegExp(url_core_rx, 'gi');

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

                let rx = new RegExp(url_core_rx, 'gi');

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
            xmlStr = xmlStr.replace(new RegExp(RxGroup.xml_comment, 'gi'), '');

            /* 4. Remove all elements */
            xmlStr = xmlStr.replace(new RegExp(RxGroup.xml_element, "g"), '');


        }


        /* check if all comments and elements have been removed properly */
        //console.log('xmlStr : ' + xmlStr);


        /* 5. normal text area */
        let rx = new RegExp(url_core_rx, 'gi');

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

                let rx = new RegExp(RxGroup.all_emails, 'gi');

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

                let rx = new RegExp(RxGroup.all_emails, 'gi');

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
            xmlStr = xmlStr.replace(new RegExp(RxGroup.xml_comment, 'gi'), '');

            /* 4. Remove all elements */
            const elementRegex = '(?:' + RxGroup_P.lang_char + '[^<>\\u0022\\u0027\\t\\s]*)';
            xmlStr = xmlStr.replace(new RegExp(RxGroup.xml_element, "g"), '');

        }

        /* 5. normal text area */
        let rx = new RegExp(RxGroup.all_emails, 'gi');

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

/*
*     Public
* */
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

        const url_core_rx = RxGroup.all_urls + '|' + RxGroup.all_urls2 + '|' + RxGroup.all_urls3_front + RxGroup.all_urls3_end;

        let obj = [];

        /* normal text area */
        let rx = new RegExp(url_core_rx, 'gi');

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

/*
*     Public
* */
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

        /* To apply the regex 'url_core_rx', make <div>,<br> a line return */
        if(contentEditableMode && contentEditableMode === true){
            //textStr = textStr.replace(/&nbsp;/gi, ' ');
            textStr = textStr.replace(/<div>/gi, '<br>').replace(/<\/div>/gi, '');
            textStr = textStr.replace(/<br>/gi, '\n');
        }


        /* This needs to be optimized for the future */
        let t = Jquery('<p>'+ textStr + '</p>');
        t.find('.' + clsName).contents().unwrap();

        const url_core_rx = RxGroup.all_urls + '|' + RxGroup.all_urls2 + '|' + RxGroup.all_urls3_front + RxGroup.all_urls3_end;

        t.each(function() {


            let txt = Jquery(this).html();

            //console.log(contentEditableMode + ' t1: ' + txt);

            let obj = [];

            /* normal text area */
            let rx = new RegExp(url_core_rx, 'gi');

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
                txt = UtilObj.replaceAt(txt, val['index']['end'], '</span>');
                txt = UtilObj.replaceAt(txt, val['index']['start'], '<span class="' + clsName + '">');

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
/*
*     Public
* */
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

            url = ValidService.checkAndTrimStr(url);

            url = UtilObj.removeAllSpaces(url);


            ValidService.failIfNotUrlPtrn(url);


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

                    let rx2 = new RegExp(RxGroup_P.all_protocols, 'gi');

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
                let rm_part_matches = obj['url'].match(new RegExp(RxGroup_P.no_lang_char_num + '+$', 'gi'));
                if (rm_part_matches) {
                    obj['removedTailOnUrl'] = rm_part_matches[0];
                    obj['url'] = obj['url'].replace(new RegExp(RxGroup_P.no_lang_char_num + '+$', 'gi'), '');
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