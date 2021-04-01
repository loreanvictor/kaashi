import { Node } from 'ohm-js'


export class SemanticError extends Error {
  readonly rootMessage: string

  constructor(
    readonly root: string | Error,
    readonly ref?: Node,
  ) {
    super(
      (
        typeof root === 'string'
        ? root
        : root.message
      )
      +
      (
        ref
        ? ('\n' + ref.source.getLineAndColumnMessage())
        : ''
      )
    )

    this.rootMessage = typeof root === 'string' ? root : root.message
  }
}
