export class IllegalArgument extends Error {
    constructor(message) {
        super(message);

        Object.setPrototypeOf(this, IllegalArgument.prototype);
    }
}