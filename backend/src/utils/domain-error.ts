export class DomainError extends Error {
  constructor(
    public readonly statusCode: 400 | 401 | 403 | 404 | 409 | 422,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
