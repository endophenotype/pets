export class ExpectedError extends Error {
  isExpected = true
  code: ExpectedErrorCode

  constructor(code: ExpectedErrorCode, message?: string, options?: ErrorOptions) {
    super(message, options)
    this.code = code
  }
}

export type ExpectedErrorCode =
  | 'NOT_FOUND'
  | 'PERSON_BLOCKED'
  | 'NO_PERMISSION'
  | 'STATIC_PAGE_NOT_FOUND'
  | 'PERSON_ALREADY_EXISTS'
  | 'USER_ALREADY_EXISTS'
  | 'WRONG_PASSWORD'
  | 'WRONG_NICK_OR_PASSWORD'
  | 'UNKNOWN_ERROR'
