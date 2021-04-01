export class NoMatchingRule extends Error {
  constructor(
    readonly indices: string[]
  ) {
    super(`No rules matching [${indices.join(', ')}]`)
  }
}
