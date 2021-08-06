class ErrorResponse extends Error {
    constructor(message, code) {
      super(message);
      this.statusCode = code;
    }
  }
  
  export default ErrorResponse;
  