import { Node } from 'ohm-js'


export class SemanticError extends Error {
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
  }
}
