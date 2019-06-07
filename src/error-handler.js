/*
*   Private : Error Handler (Customized)
* */

// 1. ValidationError - warn users of wrong values.

class ValidationError extends Error {

    constructor(message) {
        super();
        this.message = message;
        this.stack = (new Error()).stack;
        this.name = this.constructor.name;
    }

}

export default ValidationError;


