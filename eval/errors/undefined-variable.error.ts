import { Node } from 'ohm-js'
import { SemanticError } from './semantic.error'


export class UndefinedVariable extends SemanticError {
  constructor(
    readonly name: string,
    readonly ref?: Node,
  ) {
    super(`${name} is not defined`, ref)
  }
}
