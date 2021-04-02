import { Node } from 'ohm-js'
import { ErrorContext, SemanticError } from './semantic.error'


export class UndefinedVariable extends SemanticError {
  constructor(
    readonly name: string,
    ref: Node,
    context: ErrorContext,
  ) {
    super(`${name} is not defined`, ref, context)
  }
}
