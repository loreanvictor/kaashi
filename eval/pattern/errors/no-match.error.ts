export class NoMatchingPattern extends Error {
  constructor() {
    super('None of specified patterns matched! Use `otherwise` to ensure one pattern matches.')
  }
}
