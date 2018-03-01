class StatusValidator {
    constructor(status) {
        this.status = status
    }

    isValid(status) {
        return this.status.hasOwnProperty(status);
    }
}

module.exports = StatusValidator;