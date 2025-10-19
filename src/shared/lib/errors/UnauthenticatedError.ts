export class UnauthenticatedError extends Error {
  code = 401;

  constructor(message: string) {
    super(message);
    this.name = "UnauthenticatedError";
  }
}
