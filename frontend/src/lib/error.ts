/**
 *
 * Custom Error Class for Rememberry including own definition of error codes.
 * @extends Error
 */
class RememberryError extends Error {
  /**
   *
   * List of all error codes:
   * 1: Standard error
   * 2: dongs
   */
  code: number;

  /**
   *
   * Constructor for Rememberry custom error.
   *
   * @param {string} message - Error message
   * @param {number} code - error code
   */
  constructor(message: string, code: number = 1) {
    super("RemError: " + message);
    this.name = "RememberryError";
    this.code = code;
  }
}

class AuthenticationError extends RememberryError {
  constructor(message: string, code = 1) {
    super(message, code);
    this.name = "AuthenticationError";
  }
}

const test = new RememberryError("Hello");
