export class NotPrimitive extends Error {
  constructor(
    readonly object: any
  ) {
    super(`${object} is not a primitive.`)
  }
}