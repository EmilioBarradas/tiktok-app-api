export class ResourceNotFound extends Error {
    constructor(message) {
        super(message);

        Object.setPrototypeOf(this, ResourceNotFound.prototype);
    }
}