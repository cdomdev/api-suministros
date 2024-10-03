export class MissingDataError extends Error {
    constructor(message) {
        super(message);
        this.name = 'missingDataError';
        this.statusCode = 400
    }
}

export class InvalidatedPasswordError extends Error {
    constructor(message) {
        super(message);
        this.name = 'invalidatedPasswordError';
        this.statusCode = 401
    }
}

export class InvalidatedDataUser extends Error {
    constructor(message) {
        super(message);
        this.name = 'invalidatedPasswordError';
        this.statusCode = 403
    }
}



export class UserNotFountError extends Error {
    constructor(message) {
        super(message);
        this.name = 'userNotFountError';
        this.statusCode = 404
    }
}


export class NotFountError extends Error {
    constructor(message) {
        super(message);
        this.name = 'userNotFountError';
        this.statusCode = 404
    }
}

export class OrderNotFountError extends Error {
    constructor(message) {
        super(message);
        this.name = 'userNotFountError';
        this.statusCode = 404
    }
}

export class UserExisting extends Error{
    constructor(message){
        super(message);
        this.name = 'userExisting'
        this.statusCode = 409
    }
}



export class ErrorServer extends Error{
    constructor(message = "Error en el servidor. Por favor intente de nuevo más tarde."){
        super(message);
        this.name = 'errorServer'
        this.statusCode = 500
    }
}