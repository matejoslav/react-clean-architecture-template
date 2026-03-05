export class Exception {
  readonly message: string;

  constructor(message = 'An unknown error occurred') {
    this.message = message;
  }
}

export class UnknownException extends Exception {}

export class RemoteException<Raw = unknown> extends Exception {
  readonly rootCause: Raw;

  constructor(raw: Raw, message = 'A remote error occurred') {
    super(message);
    this.rootCause = raw;
  }
}

export class ServerException extends RemoteException {}

export class UnAuthorizedException extends RemoteException {
  constructor(raw: unknown) {
    super(raw, 'Unauthorized');
  }
}

export class LocalException<Raw = unknown> extends Exception {
  readonly rootCause: Raw;

  constructor(raw: Raw, message = 'A local error occurred') {
    super(message);
    this.rootCause = raw;
  }
}
