import { Node } from 'ohm-js'


export interface ErrorContext {
  name(): string
}


export class SemanticError extends Error {
  readonly rootMessage: string
  readonly location: string

  constructor(
    readonly root: string | Error,
    readonly ref: Node | string,
    readonly context: ErrorContext,
  ) {
    super(
      (
        typeof root === 'string'
        ? root
        :  root.message
      )
      +
      (
        typeof ref === 'string'
        ? ref
        : ('\n' + ref.source.getLineAndColumnMessage())
      )
    )

    this.rootMessage = typeof root === 'string' ? root : root.message
    this.location = (
      typeof ref === 'string'
      ? ref
      : ('\n' + ref.source.getLineAndColumnMessage())
    )
  }
}
