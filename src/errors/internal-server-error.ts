export class InternalServerError extends Error {
  constructor() {
    super('Email already exists.')
  }
}